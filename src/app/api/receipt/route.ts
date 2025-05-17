import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { message: 'id tidak ditemukan' },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.participant.findUnique({
      where: { id: id, statusRegion: true },
      include: {
        subKelas: {
          include: {
            kelas: true
          }
        },
        region: true
      }
    });
    if (!data) {
      return NextResponse.json({ message: 'Data tidak ditemukan' });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'server error' });
  }
}
