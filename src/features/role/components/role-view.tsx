'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Link from 'next/link';
import { deleteRole } from '@/actions/role-action';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

interface Role {
  id: string;
  name: string;
  permissions: { permission: { id: string; name: string } }[];
}

interface RoleViewProps {
  roles: Role[];
}

export default function RoleView({ roles }: RoleViewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      await deleteRole(id);
      toast.success('Role berhasil dihapus!');
      setDeletingId(null);
    });
  };

  return (
    <Card className='p-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                {role.permissions.map((p) => p.permission.name).join(', ')}
              </TableCell>
              <TableCell className='flex gap-2'>
                <Button variant={'outline'} size={'sm'} asChild>
                  <Link href={`/dashboard/roles/${role.id}`}>Edit</Link>
                </Button>

                <Button
                  variant='destructive'
                  size={'sm'}
                  onClick={() => handleDelete(role.id)}
                  disabled={isPending && deletingId === role.id}
                >
                  {isPending && deletingId === role.id
                    ? 'Menghapus...'
                    : 'Hapus'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
