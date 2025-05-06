'use server';
import { prisma } from '@/lib/prisma';

export interface ParticipantResponse {
  id: string;
  noRegistration: string;
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: Date;
  gender: string;
  institutionName: string;
  institutionAddress: string;
  province: { id: number; name: string };
  regency: { id: number; name: string };
  district: { id: number; name: string };
  village: { id: number; name: string };
  region: { id: string; name: string };
  kelas: string;
  subKelas: string;
  statusCenter: boolean;
  statusRegion: boolean;
}

export interface ParticipantsResponse {
  data: ParticipantResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getParticipants(
  filters: {
    kelasId?: string;
    subKelasId?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  regionIds?: string[]
): Promise<ParticipantsResponse> {
  const { kelasId, subKelasId, search, page = 1, limit = 10 } = filters;

  const kelasIds = kelasId ? kelasId.split('.') : [];
  const subKelasIds = subKelasId ? subKelasId.split('.') : [];

  const whereCondition: any = {};

  // Filter berdasarkan kelas
  if (kelasId && kelasId.length > 0) {
    whereCondition.subKelas = {
      kelasId: { in: kelasIds }
    };
  }

  // Filter berdasarkan subKelas
  if (subKelasId && subKelasId.length > 0) {
    whereCondition.subKelas = {
      ...whereCondition.subKelas,
      id: { in: subKelasIds }
    };
  }

  if (regionIds && regionIds.length > 0) {
    whereCondition.regionId = { in: regionIds };
  }

  // Filter pencarian
  if (search) {
    whereCondition.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { noRegistration: { contains: search, mode: 'insensitive' } },
      { institutionName: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Ambil data peserta dan total count
  const [participants, total] = await Promise.all([
    prisma.participant.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
      include: {
        province: { select: { id: true, name: true } },
        regency: { select: { id: true, label: true } },
        district: { select: { id: true, name: true } },
        village: { select: { id: true, name: true } },
        region: { select: { id: true, name: true } },
        subKelas: {
          include: {
            kelas: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.participant.count({ where: whereCondition })
  ]);

  // Transformasi data untuk response
  const transformedData = participants.map((p) => ({
    id: p.id,
    noRegistration: p.noRegistration,
    fullName: p.fullName,
    nik: p.nik,
    birthPlace: p.birthPlace,
    birthDate: p.birthDate,
    gender: p.gender,
    institutionName: p.institutionName,
    institutionAddress: p.institutionAddress,
    province: p.province,
    regency: { id: p.regency.id, name: p.regency.label! },
    district: p.district,
    village: p.village,
    region: p.region,
    kelas: p.subKelas?.kelas.name as string,
    subKelas: p.subKelas?.name as string,
    statusCenter: p.statusCenter,
    statusRegion: p.statusRegion
  }));

  return {
    data: transformedData,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export const getParticipantById = async (
  id: string
): Promise<ParticipantResponse | null> => {
  const participant = await prisma.participant.findUnique({
    where: {
      id
    },
    include: {
      province: { select: { id: true, name: true } },
      regency: { select: { id: true, label: true } },
      district: { select: { id: true, name: true } },
      village: { select: { id: true, name: true } },
      region: { select: { id: true, name: true } },
      subKelas: {
        include: {
          kelas: true
        }
      }
    }
  });

  if (participant) {
    return {
      id: participant.id,
      noRegistration: participant.noRegistration,
      fullName: participant.fullName,
      nik: participant.nik,
      birthPlace: participant.birthPlace,
      birthDate: participant.birthDate,
      gender: participant.gender,
      institutionName: participant.institutionName,
      institutionAddress: participant.institutionAddress,
      province: participant.province,
      regency: { id: participant.regency.id, name: participant.regency.label! },
      district: participant.district,
      village: participant.village,
      region: participant.region,
      kelas: participant.subKelas?.kelas.name as string,
      subKelas: participant.subKelas?.name as string,
      statusCenter: participant.statusCenter,
      statusRegion: participant.statusRegion
    };
  } else {
    return null;
  }
};

export const getParticipantCount = async () => {
  return await prisma.participant.count();
};
export const getTotalParticipantsCount = async () => {
  const participants = await prisma.participant.findMany({
    select: {
      gender: true
    }
  });

  const putraCount = participants.filter((p) => p.gender === 'PUTRA').length;
  const putriCount = participants.filter((p) => p.gender === 'PUTRI').length;

  return {
    total: putraCount + putriCount,
    putra: putraCount,
    putri: putriCount
  };
};

export const getAllParticipantsCount = async () => {
  // Ambil semua kelas beserta subkelas dan jumlah peserta
  // const subKelasData = await prisma.subKelas.findMany({
  //     select: {
  //         name: true, // Nama subKelas
  //         kelas: {
  //             select: { name: true } // Nama kelas
  //         },
  //         _count: {
  //             select: { participant: true } // Jumlah peserta dalam subKelas
  //         }
  //     }
  // });

  // Format hasil dalam bentuk array object
  //   return subKelasData.map((sub) => ({
  //     kelas: sub.kelas.name, // Nama kelas
  //     subKelas: sub.name, // Nama subKelas
  //     count: sub._count.participant // Jumlah peserta
  //   }));
  const subKelasData = await prisma.subKelas.findMany({
    select: {
      name: true,
      kelas: {
        select: { name: true }
      },
      participant: {
        select: {
          gender: true
        }
      }
    }
  });
  return subKelasData.map((sub) => {
    const putraCount = sub.participant.filter(
      (p) => p.gender === 'PUTRA'
    ).length;
    const putriCount = sub.participant.filter(
      (p) => p.gender === 'PUTRI'
    ).length;

    return {
      kelas: sub.kelas.name,
      subKelas: sub.name,
      count: putraCount + putriCount,
      putra: putraCount,
      putri: putriCount
    };
  });
};

export const getReviewById = async (id: string) => {
  const data = await prisma.participant.findUnique({
    where: {
      id
    },
    include: {
      subKelas: {
        select: {
          kelas: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });
  // Transformasi data
  const transformedData = {
    ...data,
    kelasId: data?.subKelas?.kelas.id,
    subKelas: undefined
  };

  // Hapus properti subKelas dari objek (opsional, jika sudah di-set undefined)
  delete transformedData.subKelas;
  // console.log(JSON.stringify(transformedData, null,2))
  return transformedData;
};
