// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const participantCount = await prisma.participant.groupBy({
    by: ['regionId', 'statusRegion'],
    _count: {
      id: true
    }
  });

  const regions = await prisma.region.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const resultMap: Record<
    number,
    {
      regionId: number;
      regionName: string;
      validated: number;
      invalidated: number;
    }
  > = {};

  for (const item of participantCount) {
    const { regionId, statusRegion, _count } = item;
    if (!resultMap[regionId]) {
      const regionName =
        regions.find((region) => region.id === regionId)?.name || 'Unknown';
      resultMap[regionId] = {
        regionId,
        regionName,
        validated: 0,
        invalidated: 0
      };
    }

    if (statusRegion) {
      resultMap[regionId].validated = _count.id;
    } else {
      resultMap[regionId].invalidated = _count.id;
    }
  }

  const result = Object.values(resultMap).sort(
    (a, b) => b.invalidated - a.invalidated
  );

  // Langkah 1: Cari no_registrasi yang duplikat
  const duplicateRegistrations = await prisma.participant.groupBy({
    by: ['noRegistration'],
    _count: {
      noRegistration: true
    },
    having: {
      noRegistration: {
        _count: {
          gt: 1
        }
      }
    }
  });

  // Langkah 2: Ambil detail data duplikat
  const duplicateDetails = await prisma.participant.findMany({
    where: {
      noRegistration: {
        in: duplicateRegistrations.map((item) => item.noRegistration)
      }
    }
  });
  return NextResponse.json({ duplicateRegistrations });
}
