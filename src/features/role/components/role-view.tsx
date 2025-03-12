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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

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
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const confirmDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingId || !deletingName) return; // Pastikan keduanya ada
    startTransition(async () => {
      const result = await deleteRole(deletingId);
      if (result.success) {
        toast.success(`Role "${deletingName}" berhasil dihapus!`);
        setDeletingId(null);
        setDeletingName(null);
        setIsDialogOpen(false);
      } else {
        toast.error(result.error.message);
      }
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
                <Button variant='outline' size='sm' asChild>
                  <Link href={`/dashboard/roles/${role.id}`}>Edit</Link>
                </Button>

                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => confirmDelete(role.id, role.name)}
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

      {/* Alert Dialog di luar loop */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus Role &quot;{deletingName}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus role ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
