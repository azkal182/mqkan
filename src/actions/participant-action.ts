'use server';
import { prisma } from '@/lib/prisma';

interface GetParticipantsParams {
  page?: number;
  limit?: number;
  filters?: {
    regionId?: number;
    categoryId?: number; // Filter by main category (MQK/Olimpiade/Dakwah)
    subCategoryId?: number; // Filter by subcategory (Ula/Wustho/Ulya)
    search?: string;
  };
}

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

export async function getParticipants({
  page = 1,
  limit = 10,
  filters
}: GetParticipantsParams): Promise<ParticipantsResponse> {
  const skip = (page - 1) * limit;

  const whereCondition: any = {};

  if (filters) {
    // Filter by region
    if (filters.regionId) {
      whereCondition.regionId = filters.regionId;
    }

    // Filter by main category (through subcategory relation)
    if (filters.categoryId) {
      whereCondition.subcategory = {
        ...whereCondition.subcategory,
        categoryId: filters.categoryId
      };
    }

    // Filter by subcategory (through subcategory relation)
    if (filters.subCategoryId) {
      whereCondition.subcategory = {
        ...whereCondition.subcategory,
        subcategoryId: filters.subCategoryId
      };
    }

    // Search filter
    if (filters.search) {
      whereCondition.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { noRegistration: { contains: filters.search, mode: 'insensitive' } },
        { institutionName: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
  }

  const [participants, total] = await Promise.all([
    prisma.participant.findMany({
      skip,
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
    subKelas: p.subKelas?.name as string
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
      subKelas: participant.subKelas?.name as string
    };
  } else {
    return null;
  }
};

export const getParticipantCount = async () => {
  return await prisma.participant.count();
};
