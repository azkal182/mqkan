import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRegionPDF, pdfToBuffer } from '@/lib/generate-region-pdf';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ regionId: string }> }
) {
  try {
    // Langsung destructure params untuk mendapatkan id
    const { regionId } = await params;

    // Validasi ID
    if (!regionId) {
      return NextResponse.json(
        { error: 'Region ID is required' },
        { status: 400 }
      );
    }

    const region = await prisma.region.findFirst({
      where: {
        id: regionId
      },
      select: {
        name: true
      }
    });

    if (!region) {
      return NextResponse.json({ error: 'Region Not exist' }, { status: 400 });
    }

    const participants = await prisma.participant.findMany({
      where: {
        regionId: regionId,
        statusRegion: true
      },
      include: {
        province: { select: { name: true } },
        regency: { select: { label: true } },
        district: { select: { name: true } },
        village: { select: { name: true } },
        region: { select: { name: true } },
        subKelas: {
          include: {
            kelas: { select: { name: true } }
          }
        }
      },
      orderBy: [
        { subKelas: { kelas: { name: 'asc' } } },
        { subKelas: { name: 'asc' } },
        { gender: 'asc' },
        { fullName: 'asc' }
      ]
    });

    const sanitizedRegionName = region.name.replace(/[^a-zA-Z0-9]/g, '_');
    const pdfDoc = createRegionPDF(participants, region.name);
    const pdfBuffer = await pdfToBuffer(pdfDoc);

    // return NextResponse.json({ regionId });
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=region-${sanitizedRegionName}.pdf`
      }
    });
  } catch (error) {
    console.error('Error deleting official:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
