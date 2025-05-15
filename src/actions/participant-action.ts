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
  photo?: String;
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
      orderBy: [
        {
          statusRegion: 'asc'
        },
        { createdAt: 'desc' }
      ]
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

// export const getTotalParticipantsCount = async () => {
//   const participants = await prisma.participant.findMany({
//     select: {
//       gender: true,
//       statusRegion: true
//     }
//   });

//   let putra = 0;
//   let putri = 0;
//   let validation = 0;
//   let invalidation = 0;

//   for (const p of participants) {
//     if (p.gender === 'PUTRA') putra++;
//     if (p.gender === 'PUTRI') putri++;
//     if (p.statusRegion === true) validation++;
//     if (p.statusRegion === false) invalidation++;
//   }

//   return {
//     total: putra + putri,
//     putra,
//     putri,
//     validationCount: validation,
//     invalidationCount: invalidation
//   };
// };

export const getTotalParticipantsCount = async () => {
  const participants = await prisma.participant.findMany({
    select: {
      gender: true,
      statusRegion: true
    }
  });

  let count = {
    total: 0,
    putra: 0,
    putri: 0,
    validationCount: 0,
    invalidationCount: 0,
    putraValidation: 0,
    putraInvalidation: 0,
    putriValidation: 0,
    putriInvalidation: 0
  };

  for (const p of participants) {
    count.total++;

    if (p.gender === 'PUTRA') {
      count.putra++;
      if (p.statusRegion === true) count.putraValidation++;
      if (p.statusRegion === false) count.putraInvalidation++;
    }

    if (p.gender === 'PUTRI') {
      count.putri++;
      if (p.statusRegion === true) count.putriValidation++;
      if (p.statusRegion === false) count.putriInvalidation++;
    }

    if (p.statusRegion === true) count.validationCount++;
    if (p.statusRegion === false) count.invalidationCount++;
  }

  return count;
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
    where: {
      participant: {
        some: {
          statusRegion: true
        }
      }
    },
    select: {
      name: true,
      kelas: {
        select: { name: true }
      },
      participant: {
        where: {
          statusRegion: true
        },
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

export type ParticipantResponseActive = ParticipantResponse & {
  checkIn: boolean;
  motherName: string;
  fatherName: string;
  parentPhone: string;
  address: string | null;
};
export const getParticipantsActive = async (): Promise<
  ParticipantResponseActive[]
> => {
  const participant = await prisma.participant.findMany({
    where: {
      statusRegion: true
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

  const result = participant.map((p) => {
    return {
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
      statusRegion: p.statusRegion,
      photo: p.photoUrl,
      checkIn: p.checkIn,
      fatherName: p.fatherName,
      motherName: p.motherName,
      parentPhone: p.parentPhone,
      address: p.address
    };
  });

  return result;
};

export const checkInParticipant = async (id: string) => {
  try {
    const participant = await prisma.participant.findUnique({ where: { id } });
    // Validasi: Jika peserta tidak ditemukan
    if (!participant) {
      throw new Error(`Peserta tidak ditemukan`);
    }

    // Validasi: Jika peserta sudah check-in (opsional, tergantung kebutuhan)
    if (participant.checkIn) {
      throw new Error(
        `Peserta ${participant.fullName} sudah melakukan registrasi!`
      );
    }

    const updatedParticipant = await prisma.participant.update({
      where: { id },
      data: {
        checkIn: true
      }
    });

    // Kembalikan data peserta yang sudah check-in
    return {
      success: true,
      message: `Check-in berhasil untuk ${updatedParticipant.fullName}`,
      data: updatedParticipant
    };
  } catch (error: any) {
    // return {
    //   success: false,
    //   message: error.message || 'Gagal melakukan check-in'
    // };
    throw new Error(error.message || 'Gagal melakukan check-in');
  }
};

// export const getCecap = async () => {
//   const [countCheckin, countNotCheckin] = await Promise.all([
//     prisma.participant.count({
//       where: {
//         statusRegion: true,
//         checkIn: true
//       }
//     }),
//     prisma.participant.count({
//       where: {
//         statusRegion: true,
//         checkIn: false
//       }
//     })
//   ]);

//   return {
//     countCheckin,
//     countNotCheckin
//   };
// };

export type TRecapResponse = {
  global: {
    totalCheckin: number;
    totalNotCheckin: number;
    total: number;
  };
  grouped: {
    checkin: {
      count: number;
      data: Record<
        string,
        {
          count: number;
          data: Record<
            string,
            {
              count: number;
              data: Record<'PUTRA' | 'PUTRI' | 'total', number>;
            }
          >;
        }
      >;
    };
    notCheckIn: {
      count: number;
      data: Record<
        string,
        {
          count: number;
          data: Record<
            string,
            {
              count: number;
              data: Record<'PUTRA' | 'PUTRI' | 'total', number>;
            }
          >;
        }
      >;
    };
  };
};
export const getRecap = async () => {
  const allSubKelas = await prisma.subKelas.findMany({
    include: {
      kelas: true
    }
  });

  const participants = await prisma.participant.findMany({
    where: {
      statusRegion: true
    },
    include: {
      subKelas: {
        include: {
          kelas: true
        }
      }
    }
  });

  const result = {
    global: {
      totalCheckin: 0,
      totalNotCheckin: 0,
      total: 0
    },
    grouped: {
      checkin: {
        count: 0,
        data: {}
      },
      notCheckIn: {
        count: 0,
        data: {}
      }
    }
  } as TRecapResponse;

  // Inisialisasi struktur per kelas dan subkelas
  for (const sub of allSubKelas) {
    const kelasName = sub.kelas.name;
    const subKelasName = sub.name;

    for (const type of ['checkin', 'notCheckIn'] as const) {
      const typeData = result.grouped[type];

      if (!typeData.data[kelasName]) {
        typeData.data[kelasName] = {
          count: 0,
          data: {}
        };
      }

      if (!typeData.data[kelasName].data[subKelasName]) {
        typeData.data[kelasName].data[subKelasName] = {
          count: 0,
          data: {
            PUTRA: 0,
            PUTRI: 0,
            total: 0
          }
        };
      }
    }
  }

  // Mengisi data peserta
  for (const p of participants) {
    const kelasName = p.subKelas?.kelas?.name;
    const subKelasName = p.subKelas?.name;
    const gender = p.gender;
    const checkType = p.checkIn ? 'checkin' : 'notCheckIn';

    if (
      kelasName &&
      subKelasName &&
      (gender === 'PUTRA' || gender === 'PUTRI')
    ) {
      const typeData = result.grouped[checkType];

      typeData.count++;
      typeData.data[kelasName].count++;
      typeData.data[kelasName].data[subKelasName].count++;
      typeData.data[kelasName].data[subKelasName].data[gender]++;
      typeData.data[kelasName].data[subKelasName].data.total++;

      // Update global
      if (checkType === 'checkin') {
        result.global.totalCheckin++;
      } else {
        result.global.totalNotCheckin++;
      }
      result.global.total++;
    }
  }

  return result;
};
