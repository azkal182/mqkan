import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.region.createMany({
    data: [
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
    ]
  });

  console.log('Regions have been seeded successfully');

  // Create roles first
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin'
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'user'
    }
  });

  // Create the permissions for the roles
  const adminPermission = await prisma.permission.create({
    data: {
      name: 'admin_permissions',
      label: 'admin',
      description: 'Permissions for admin users'
    }
  });

  const userPermission = await prisma.permission.create({
    data: {
      name: 'create:member',
      label: 'member',
      description: 'Permissions for region-based users'
    }
  });

  // Create RolePermissions for admin and user roles
  await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      permissionId: adminPermission.id
    }
  });

  await prisma.rolePermission.create({
    data: {
      roleId: userRole.id,
      permissionId: userPermission.id
    }
  });

  // Create Admin User (admin users do not need regions)
  const adminUser = await prisma.user.create({
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

  // Create Region-Based Users (assigned to specific regions)
  const regionUser = await prisma.user.create({
    data: {
      name: 'Region User 1',
      username: 'jatim1',
      password: hashSync('jatim1'),
      roles: {
        create: {
          roleId: userRole.id
        }
      },
      regions: {
        create: [
          {
            regionId: '5b626edc-7d21-4f1f-bb0c-01bc7cf86238' // Replace with an actual region ID
          }
        ]
      }
    }
  });

  // You can add more users and assign them to different regions
  const anotherRegionUser = await prisma.user.create({
    data: {
      name: 'jatim 2',
      username: 'jatim2',
      password: 'jatim2',
      roles: {
        create: {
          roleId: userRole.id
        }
      },
      regions: {
        create: [
          {
            regionId: '1dbe64c2-5c71-4499-afda-9a7bcfd9b1b4'
          }
        ]
      }
    }
  });

  console.log('Admin and Region-based users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
