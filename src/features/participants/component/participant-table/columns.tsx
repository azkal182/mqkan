'use client';
import { ParticipantResponse } from '@/actions/participant-action';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const columns: ColumnDef<ParticipantResponse>[] = [
  {
    accessorKey: 'noRegistration',
    header: 'No. Registrasi',
    size: 180
  },
  {
    accessorKey: 'fullName',
    header: 'Nama Lengkap',
    size: 200
  },
  {
    accessorKey: 'nik',
    header: 'NIK',
    size: 200,
    cell: ({ row }) =>
      '*'.repeat(row.original.nik.length - 10) + row.original.nik.slice(-10)
  },
  {
    accessorKey: 'birthPlace',
    header: 'Tempat Lahir',
    size: 150
  },
  {
    accessorKey: 'birthDate',
    header: 'Tanggal Lahir',
    cell: ({ row }) =>
      new Date(row.original.birthDate).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
    size: 300
  },
  {
    accessorKey: 'gender',
    header: 'Jenis Kelamin',
    cell: ({ row }) => {
      const gender = row.original.gender.toLowerCase();
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    },
    size: 120
  },
  {
    accessorKey: 'province',
    header: 'Provinsi',
    cell: ({ row }) => row.original.province?.name,
    size: 180
  },
  {
    accessorKey: 'regency',
    header: 'Kabupaten',
    cell: ({ row }) => row.original.regency?.name,
    size: 180
  },
  {
    accessorKey: 'district',
    header: 'Kecamatan',
    cell: ({ row }) => row.original.district?.name,
    size: 180
  },
  {
    accessorKey: 'village',
    header: 'Kelurahan',
    cell: ({ row }) => row.original.village?.name,
    size: 180
  },
  {
    accessorKey: 'region',
    header: 'Region',
    cell: ({ row }) => row.original.region?.name,
    size: 150
  },
  {
    accessorKey: 'kelas',
    header: 'Kategori',
    cell: ({ row }) => row.original?.kelas,
    size: 150
  },
  {
    accessorKey: 'Kelas',
    header: 'Jenjang',
    cell: ({ row }) => row.original.subKelas,
    size: 150
  },
  {
    accessorKey: 'institutionName',
    header: 'Lembaga',
    size: 250
  },
  {
    id: 'umur',
    header: 'Umur',
    cell: ({ row }) => {
      const age = calculateAge(row.original.birthDate);
      return `${age} Tahun`;
    },
    size: 100,
    // Optional: enable sorting by actual birth date
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.birthDate).getTime();
      const dateB = new Date(rowB.original.birthDate).getTime();
      return dateA - dateB;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction />
  }
];
