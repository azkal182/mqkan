import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DateTime } from 'luxon';
import { RegistrationUpdateSchema } from '@/schemas/registration-schema';
import { handleError } from '@/lib/error-handler';
import { updateRegistration } from '@/actions/registration-action';

export async function GET(req: NextRequest) {
  try {
    const key = await req.headers.get('x-api-key');
    if (!key || key !== '5c0acbf1-8696-4429-ae17-9fc11b41896d') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const participants = await prisma.participant.findMany({
      orderBy: {
        createdAt: 'desc'
      },
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
      ijazahUrl: participant.ijazahUrl,
      statusCenter: participant.statusCenter,
      statusRegion: participant.statusRegion,
      createdAt: participant.createdAt
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

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Ambil dan konversi nilai
    const rawData = {
      id: formData.get('id') as string,
      fullName: formData.get('fullName') as string,
      nik: formData.get('nik') as string,
      birthPlace: formData.get('birthPlace') as string,
      birthDate: formData.get('birthDate') as string,
      gender: formData.get('gender') as string,
      kelasId: formData.get('kelasId') as string,
      subKelasId: formData.get('subKelasId') as string,
      institutionName: formData.get('institutionName') as string,
      institutionAddress: formData.get('institutionAddress') as string,
      regionId: formData.get('regionId') as string,
      provinceId: Number(formData.get('provinceId')),
      regencyId: Number(formData.get('regencyId')),
      districtId: Number(formData.get('districtId')),
      villageId: Number(formData.get('villageId')),
      postalCode: formData.get('postalCode') as string,
      address: formData.get('address') as string,
      fatherName: formData.get('fatherName') as string,
      motherName: formData.get('motherName') as string,
      parentPhone: formData.get('parentPhone') as string,
      kk: formData.get('kk') as File | null,
      sk: formData.get('sk') as File | null,
      ijazah: formData.get('ijazah') as File | null,
      photo: formData.get('photo') as File | null
    };

    // Validasi data input
    const parsed = RegistrationUpdateSchema.parse(rawData);
    const result = await updateRegistration(parsed);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return Response.json(handleError(error, 'updateParticipant'), {
      status: 400
    });
  }
}
