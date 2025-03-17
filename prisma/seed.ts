import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import Provinces from './json/provinsi.json';
import Regencies from './json/kabupaten.json';
import Districts from './json/kecamatan.json';
import Villages from './json/kelurahan.json';

const prisma = new PrismaClient();

type village = {
  id: number;
  name: string;
  code: string;
  full_code: string;
  pos_code: string;
  kecamatan_id: number;
};

async function main() {
  const formattedProvinces = Provinces.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code
  }));
  await prisma.province.createMany({
    data: formattedProvinces
  });
  console.log('province done');

  console.log('insert regencies ...');
  const formattedRegencies = Regencies.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    label: `${item.type === 'Kota' ? 'Kota.' : 'Kab.'} ${item.name}`,
    type: item.type,
    fullCode: item.full_code,
    provinceId: item.provinsi_id
  }));

  await prisma.regency.createMany({
    data: formattedRegencies
  });

  console.log('regencies done');

  console.log('insert districts ...');

  const formattedDistricts = Districts.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    fullCode: item.full_code,
    regencyId: item.kabupaten_id
  }));

  await prisma.district.createMany({
    data: formattedDistricts
  });
  console.log('districts done');

  const formattedVillages = (Villages as village[]).map((item, index) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    fullCode: item.full_code,
    postalCode: item.pos_code,
    districtId: item.kecamatan_id
  }));

  await prisma.village.createMany({
    data: formattedVillages,
    skipDuplicates: true
  });

  console.log('village done');

  await prisma.permission.createMany({
    data: [
      {
        name: 'member:view',
        label: 'member'
      },
      {
        name: 'member:create',
        label: 'member'
      },
      {
        name: 'member:edit',
        label: 'member'
      },
      {
        name: 'member:delete',
        label: 'member'
      },
      {
        name: 'user:view',
        label: 'user'
      },
      {
        name: 'user:edit',
        label: 'user'
      },
      {
        name: 'user:delete',
        label: 'user'
      },
      {
        name: 'user:reset-password',
        label: 'user'
      }
    ]
  });
  // 1. Insert Regions
  const regionsData = [
    {
      name: 'Jatim 1',
      coverage: [
        'Bojonegoro',
        'Mojokerto',
        'Jombang',
        'Nganjuk',
        'Kediri',
        'Ngawi'
      ]
    },
    {
      name: 'Jatim 2',
      coverage: ['Seluruh daerah Madura']
    },
    {
      name: 'Jatim 3',
      coverage: [
        'Banyuwangi',
        'Bondowoso',
        'Jember',
        'Lumajang',
        'Malang',
        'Probolinggo',
        'Pasuruan',
        'Situbondo'
      ]
    },
    {
      name: 'Jatim 4',
      coverage: [
        'Madiun',
        'Ponorogo',
        'Trenggalek',
        'Tulung Agung',
        'Pacitan',
        'Magetan',
        'Blitar'
      ]
    },
    {
      name: 'Jatim 5',
      coverage: ['Tuban', 'Lamongan', 'Gresik', 'Sidoarjo', 'Surabaya']
    },
    {
      name: 'Jateng 1',
      coverage: [
        'Rembang',
        'Blora',
        'Pati',
        'Grobogan',
        'Kudus',
        'Demak',
        'Semarang',
        'Kendal',
        'Sragen'
      ]
    },
    {
      name: 'Jateng 2',
      coverage: [
        'Magelang',
        'Temanggung',
        'Wonosobo',
        'Purworejo',
        'Banjarnegara',
        'Kebumen'
      ]
    },
    {
      name: 'Jateng 3',
      coverage: [
        'Batang',
        'Pekalongan',
        'Pemalang',
        'Tegal',
        'Brebes',
        'Purbalingga',
        'Banyumas',
        'Cilacap'
      ]
    },
    {
      name: 'Jateng 4',
      coverage: [
        'Karanganyar',
        'Wonogiri',
        'Sukoharjo',
        'Surakarta',
        'Boyolali',
        'Klaten'
      ]
    },
    {
      name: 'Jabar 1',
      coverage: [
        'Subang',
        'Sukabumi',
        'Cianjur',
        'Cimahi',
        'Bandung',
        'Garut',
        'Purwakarta',
        'Karawang'
      ]
    },
    {
      name: 'Jabar 2',
      coverage: [
        'Indramayu',
        'Cirebon',
        'Sumedang',
        'Majalengka',
        'Kuningan',
        'Ciamis',
        'Tasikmalaya',
        'Kota Banjar',
        'Kab. Pangandaran'
      ]
    },
    {
      name: 'Jabar 3',
      coverage: [
        'Kab. Bekasi',
        'Kota Bekasi',
        'Kab. Depok',
        'Kota Depok',
        'Kab. Bogor',
        'Kota Bogor'
      ]
    },
    {
      name: 'DKI Jakarta',
      coverage: ['Kota Tanggerang', 'Tanggerang Selatan', 'Prov. Jakarta']
    },
    {
      name: 'Banten',
      coverage: [
        'Kota Banten',
        'Kab. Cilegon',
        'Kab. Serang',
        'Kota Lebak',
        'Kota Serang'
      ]
    },
    {
      name: 'Yogyakarta',
      coverage: ['Yogyakarta']
    },
    {
      name: 'Kalsel',
      coverage: ['Kalimantan Selatan']
    },
    {
      name: 'Kaltim',
      coverage: ['Seluruh Daerah Kalimantan Barat']
    },
    {
      name: 'Bali',
      coverage: ['Bali']
    },
    {
      name: 'Lombok',
      coverage: ['NTB']
    },
    {
      name: 'Lampung',
      coverage: ['Lampung']
    },
    {
      name: 'Riau',
      coverage: ['Riau']
    },
    {
      name: 'Jambi',
      coverage: ['Jambi']
    },
    {
      name: 'Sumbar',
      coverage: ['Sumatra Barat']
    },
    {
      name: 'Batam',
      coverage: ['Batam']
    },
    {
      name: 'Sumsel',
      coverage: ['Sumatra Selatan']
    },
    {
      name: 'D.I Jepara',
      coverage: ['Jepara']
    },
    {
      name: 'Sulawesi',
      coverage: ['Sulawesi']
    }
  ];

  await prisma.region.createMany({ data: regionsData });
  console.log('Regions have been seeded successfully');

  // 2. Retrieve Region IDs
  const regions = await prisma.region.findMany();
  const allPermissions = await prisma.permission.findMany();

  // 3. Create Roles
  const [adminRole, userRole] = await Promise.all([
    prisma.role.create({
      data: {
        name: 'admin',
        // Connect admin role to user-related permissions
        permissions: {
          create: allPermissions
            .filter(
              (p) => p.name.startsWith('user:') || p.name.startsWith('member:')
            )
            .map((p) => ({
              permissionId: p.id
            }))
        }
      }
    }),
    prisma.role.create({ data: { name: 'user' } })
  ]);

  await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      password: hashSync('admin'), // Make sure to hash this password in real-world scenarios
      roles: {
        create: {
          roleId: adminRole.id
        }
      }
    }
  });

  // 4. Create Users based on Regions
  for (const region of regions) {
    await prisma.user.create({
      data: {
        name: `User ${region.name}`,
        username: region.name.toLowerCase().replace(/\s+/g, ''), // Convert to lowercase and remove spaces
        password: hashSync('password123'), // Hash the password
        roles: { create: { roleId: userRole.id } },
        regions: { create: { regionId: region.id } }
      }
    });
  }

  console.log('Users have been seeded successfully');

  // Ambil contoh data wilayah pertama untuk participant
  const province = await prisma.province.findFirstOrThrow();
  const regency = await prisma.regency.findFirstOrThrow();
  const district = await prisma.district.findFirstOrThrow();
  const village = await prisma.village.findFirstOrThrow();

  // Buat kategori utama

  const mqk = await prisma.category.create({ data: { name: 'MQK' } });
  const olimpiade = await prisma.category.create({
    data: { name: 'Olimpiade' }
  });
  const dakwah = await prisma.category.create({ data: { name: 'Dakwah' } });

  const ula = await prisma.category.create({ data: { name: 'Ula' } });
  const wustho = await prisma.category.create({ data: { name: 'Wustho' } });
  const ulya = await prisma.category.create({ data: { name: 'Ulya' } });

  // Buat relasi subkategori dengan benar
  await prisma.categoryToSubcategory.createMany({
    data: [
      { categoryId: mqk.id, subcategoryId: wustho.id }, // MQK -> Wustho
      { categoryId: mqk.id, subcategoryId: ulya.id }, // MQK -> Ulya
      { categoryId: olimpiade.id, subcategoryId: wustho.id }, // Olimpiade -> Wustho
      { categoryId: olimpiade.id, subcategoryId: ulya.id }, //y Olimpiade -> Ulya
      { categoryId: dakwah.id, subcategoryId: ula.id }, // Dakwah -> Ula
      { categoryId: dakwah.id, subcategoryId: wustho.id } // Dakwah -> Wustho
    ]
  });

  // Ali mengikuti MQK dengan subkategori Ulya
  await prisma.participant.create({
    data: {
      noRegistration: 'REG12345',
      fullName: 'Ali',
      nik: '1212121212121212',
      password: hashSync('ali_password'),
      birthPlace: 'Semarang',
      birthDate: new Date('2005-06-15'),
      gender: 'PUTRA',
      fatherName: 'Ahmad',
      motherName: 'Aisyah',
      parentPhone: '08123456789',
      provinceId: province.id,
      regencyId: regency.id,
      districtId: district.id, // Perbaikan typo disini
      villageId: village.id,
      kkUrl: 'https://example.com/kk.jpg',
      ijazahUrl: 'https://example.com/ijazah.jpg',
      photoUrl: 'https://example.com/photo.jpg',
      institutionName: 'Pesantren XYZ',
      institutionAddress: 'Jl. Pesantren No. 1',
      regionId: regions[0].id,
      subcategoryId: ulya.id // Pakai ID subkategori yang benar
    }
  });

  // Budi mengikuti Olimpiade dengan subkategori Wustho
  // const budi = await prisma.participant.create({
  //     data: { fullName: 'Budi', subcategoryId: subcategories[2].id }, // Olimpiade → Wustho
  // });

  console.log('category done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
