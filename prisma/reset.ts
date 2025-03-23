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
  try {
    console.log('🔄 Resetting database...');

    await prisma.participant.deleteMany({});
    await prisma.subKelas.deleteMany({});
    await prisma.kelas.deleteMany({});
    await prisma.categoryToSubcategory.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.penilaian.deleteMany({});
    await prisma.userRegion.deleteMany({});
    await prisma.region.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.rolePermission.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.village.deleteMany({});
    await prisma.district.deleteMany({});
    await prisma.regency.deleteMany({});
    await prisma.province.deleteMany({});

    console.log('✅ Database has been reset.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }

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
      },
      {
        name: 'participant:acc-corwil',
        label: 'participant'
      },
      {
        name: 'participant:acc-pusat',
        label: 'participant'
      }
    ]
  });
  // 1. Insert Regions
  const regionsData = [
    {
      name: 'Pusat',
      coordinator: 'Misbahul Cholisin',
      phone: '6285713055532',
      coverage: ['Semua Area']
    },
    {
      name: 'Jatim 1',
      coordinator: 'Abdul Wahid Eko Prasetyo',
      phone: '6282389471777',
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
      coordinator: 'Moh. Badrun Al Qomari',
      phone: '6282337035972',
      coverage: ['Seluruh daerah Madura']
    },
    {
      name: 'Jatim 3',
      coordinator: 'Acmad Kamaluddin',
      phone: '6285334647911',
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
      coordinator: 'Umarudin',
      phone: '6282301941277',
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
      coordinator: 'Mas Agus Azro Chalim',
      phone: '967735660708',
      coverage: ['Tuban', 'Lamongan', 'Gresik', 'Sidoarjo', 'Surabaya']
    },
    {
      name: 'Jateng 1',
      coordinator: 'Kholilur Rahman',
      phone: '6285232195757',
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
      coordinator: 'M. Hamam Rozin',
      phone: '6285640163313',
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
      coordinator: 'M. Imam Muhajir',
      phone: '6285726977515',
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
      coordinator: 'Ahmad Mifttahul Choir',
      phone: '6281225955228',
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
      coordinator: 'Fatih Ar Ridhwan',
      phone: '6282321282005',
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
      coordinator: 'Fahmi Zakaria Al-Ansor',
      phone: '6282329966400',
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
      coordinator: 'Fauzi Azimansyah',
      phone: '6289647989945',
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
      coordinator: 'hmad Musthofa Warka',
      phone: '6285774970727',
      coverage: ['Kota Tanggerang', 'Tanggerang Selatan', 'Prov. Jakarta']
    },
    {
      name: 'Banten',
      coordinator: 'Rahmat Maulana Wibowo',
      phone: '6287887568373',
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
      coordinator: 'Muqronul Faiz',
      phone: '628978764624',
      coverage: ['Yogyakarta']
    },
    {
      name: 'Kalsel',
      coordinator: 'Ahmad Rido’i, S.Pd',
      phone: '6282358141645',
      coverage: ['Kalimantan Selatan']
    },
    {
      name: 'Kalbar',
      coordinator: 'Suhedi',
      phone: '6285849772221',
      coverage: ['Seluruh Daerah Kalimantan Barat']
    },
    {
      name: 'Kaltim',
      coordinator: 'Imron Ghozali',
      phone: '6282220947247',
      coverage: ['Seluruh Daerah Kalimantan Timur']
    },
    {
      name: 'Bali',
      coordinator: 'Abdul Malik Rai',
      phone: '628983182204',
      coverage: ['Bali']
    },
    {
      name: 'Lombok',
      coordinator: 'Marzuki',
      phone: '6285338688696',
      coverage: ['NTB']
    },
    {
      name: 'Lampung',
      coordinator: 'Muhammad Husni Mubarok',
      phone: '6282313620077',
      coverage: ['Lampung']
    },
    {
      name: 'Riau',
      coordinator: 'Fatchur Rohman',
      phone: '6281325706008',
      coverage: ['Riau']
    },
    {
      name: 'Jambi',
      coordinator: 'Zainurridla',
      phone: '6282268886779',
      coverage: ['Jambi']
    },
    {
      name: 'Sumbar',
      coordinator: 'Akmal Aziz',
      phone: '6281390890900',
      coverage: ['Sumatra Barat']
    },
    {
      name: 'Batam',
      coordinator: 'Andi Khoirul Hadi',
      phone: '6285272749298 ',
      coverage: ['Batam']
    },
    {
      name: 'Sumsel',
      coordinator: 'M. Khavid Wafi Abdullah',
      phone: '6285806852713',
      coverage: ['Sumatra Selatan']
    },
    {
      name: 'Bangka Belitung',
      coordinator: 'Burhan Choirul Adib',
      phone: '6281254150002',
      coverage: ['Bangka Belitung']
    },
    {
      name: 'D.I Jepara',
      coordinator: 'Ahmad Robik Atqo',
      phone: '6285799886446',
      coverage: ['Jepara']
    },
    {
      name: 'Sulawesi',
      coordinator: 'Ahmad Fahmi Nur Fuad, S.E',
      phone: '6285796909735',
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
              (p) =>
                p.name.startsWith('user:') ||
                p.name.startsWith('member:') ||
                p.name.startsWith('participant:')
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
      password: hashSync('Azkal182'), // Make sure to hash this password in real-world scenarios
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

  // 🏫 Tambahkan Kelas

  const mqk = await prisma.kelas.create({
    data: { name: 'MQK' }
  });

  const dakwah = await prisma.kelas.create({
    data: { name: 'Dakwah Kontemporer' }
  });

  const olimpiade = await prisma.kelas.create({
    data: { name: 'Olimpiade Amtsilati' }
  });

  // 📚 Tambahkan Sub-Kelas
  // MQK -> Wustho
  const MQKWustho = await prisma.subKelas.create({
    data: { name: 'Wustho', kelasId: mqk.id }
  });

  // MQK -> Ulya
  const MQKUlya = await prisma.subKelas.create({
    data: { name: 'Ulya', kelasId: mqk.id }
  });

  //Olimpiade -> Wustho
  const OlimpiadeWustho = await prisma.subKelas.create({
    data: { name: 'Wustho', kelasId: olimpiade.id }
  });

  //Olimpiade -> Ulya
  const OlimpiadeUlya = await prisma.subKelas.create({
    data: { name: 'Ulya', kelasId: olimpiade.id }
  });

  // Dakwah -> Ula
  const DakwahUla = await prisma.subKelas.create({
    data: { name: 'Ula', kelasId: dakwah.id }
  });

  // Dakwah -> Wustho
  const DakwahWustho = await prisma.subKelas.create({
    data: { name: 'Wustho', kelasId: dakwah.id }
  });

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
