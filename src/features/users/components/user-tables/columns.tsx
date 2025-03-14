'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { UserWithRolesAndRegions } from '@/actions/user-action';

export const columns: ColumnDef<UserWithRolesAndRegions>[] = [
  //   {
  //     accessorKey: 'id',
  //     header: 'Id',
  //     cell: ({ row }) => {
  //       return (
  //         <div className='relative aspect-square'>

  //         </div>
  //       );
  //     }
  //   },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    id: 'role',
    header: 'ROLE',
    cell: ({ row }) => {
      const role = row.original.roles.map((r) => r.role.name).join(', ');
      return <div>{role}</div>;
    }
  },
  {
    id: 'regions',
    header: 'Wilayah',
    cell: ({ row }) => {
      const regions = row.original.regions.length
        ? row.original.regions.map((r) => r.region.name).join(', ')
        : 'all';
      return <div>{regions}</div>;
    }
  },
  //   {
  //     id: 'permission',
  //     header: 'IZIN',
  //     cell: ({ row }) => {
  //       const permissin = row.original.roles
  //         .flatMap((r) => r.role.permissions.map((p) => p.permission.name))
  //         .join(', ');
  //       return <div>{permissin}</div>;
  //     }
  //   },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction user={row.original} />
  }
];
