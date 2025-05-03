import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';

export async function GET(req: NextRequest) {
  try {
    const key = await req.headers.get('x-api-key');
    if (!key || key !== '5c0acbf1-8696-4429-ae17-9fc11b41896d') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const participants = await prisma.participant.findMany({
      include: {
        subKelas: {
          include: {
            kelas: true
          }
        },
        region: {
          select: {
            name: true
          }
        },
        province: {
          select: {
            name: true
          }
        },
        regency: {
          select: {
            label: true
          }
        },
        district: {
          select: {
            name: true
          }
        },
        village: {
          select: {
            name: true,
            postalCode: true
          }
        }
      }
    });

    const data = participants.map((participant) => ({
      id: participant.id,
      noRegistration: participant.noRegistration,
      fullName: participant.fullName,
      nik: participant.nik,
      ttl: `${participant.birthPlace}, ${DateTime.fromJSDate(
        new Date(participant.birthDate)
      )
        .setZone('Asia/Jakarta')
        .toFormat('dd-MM-yyyy')}`,
      gender: participant.gender,
      fatherName: participant.fatherName,
      motherName: participant.motherName,

      province: participant.province.name,
      regency: participant.regency.label,
      district: participant.district.name,
      village: participant.village.name,
      postalCode: participant.village.postalCode,
      address: participant.address,
      parentPhone: participant.parentPhone,
      institutionName: participant.institutionName,
      institutionAddress: participant.institutionAddress,
      kelas: participant?.subKelas?.kelas?.name,
      subKelas: participant?.subKelas?.name,
      region: participant.region.name,
      photoUrl: participant.photoUrl,
      skUrl: participant.skUrl,
      kkUrl: participant.kkUrl,
      ijazahUrl: participant.ijazahUrl
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    // console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
