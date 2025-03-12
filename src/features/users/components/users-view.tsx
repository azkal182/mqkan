import React from 'react';
import { UserWithRolesAndRegions } from '@/actions/user-action';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UsersViewProps {
  users: UserWithRolesAndRegions[];
}
const UsersView = ({ users }: UsersViewProps) => {
  return (
    <Card className={'p-4'}>
      {/*<CardTitle className='text-left text-2xl font-bold'>*/}
      {/*  User Management*/}
      {/*</CardTitle>*/}
      {/*<Link href='/dashboard/users/new'>*/}
      {/*  <Button className='mb-4'>Tambah User</Button>*/}
      {/*</Link>*/}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, i) => (
            <TableRow key={user.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                {user.roles.map((r) => r.role.name).join(', ')}
              </TableCell>
              <TableCell>
                {user.regions.length
                  ? user.regions.map((r) => r.region.name).join(', ')
                  : 'all'}
              </TableCell>
              <TableCell>
                {user.roles
                  .flatMap((r) =>
                    r.role.permissions.map((p) => p.permission.name)
                  )
                  .join(', ')}
              </TableCell>
              <TableCell className='flex gap-2'>
                <Button variant={'outline'} size={'sm'} asChild>
                  <Link href={`/dashboard/users/${user.id}`}>Edit</Link>
                </Button>

                <Button variant='destructive' size={'sm'}>
                  hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UsersView;
