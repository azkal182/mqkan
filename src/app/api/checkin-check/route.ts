import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const data = await prisma.participant.findMany({
    where: {
      statusRegion: true,
      checkIn: false
    },
    select: {
      fullName: true,
      region: {
        select: {
          name: true
        }
      },
      subKelas: {
        select: {
          name: true,
          kelas: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  const fornmattedData = data.map((d) => {
    return {
      fullName: d.fullName,
      region: d.region.name,
      subKelas: d.subKelas!.name!,
      kelas: d.subKelas!.kelas!.name!
    };
  });
  const sortedData = fornmattedData.sort((a, b) =>
    a.region.localeCompare(b.region)
  );

  console.log(sortedData);
  return NextResponse.json(sortedData);
}
