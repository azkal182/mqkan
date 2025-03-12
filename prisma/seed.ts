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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
