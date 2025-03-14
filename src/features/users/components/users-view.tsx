'use client';
import React, { useState, useTransition } from 'react';
import {
  deleteUser,
  changePassword,
  UserWithRolesAndRegions
} from '@/actions/user-action';
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
import { toast } from 'sonner';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { MoreVertical, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useHasPermission } from '@/hooks/use-has-permission';

interface UsersViewProps {
  users: UserWithRolesAndRegions[];
}

const UsersView = ({ users }: UsersViewProps) => {
  const { session } = useAuth();
  const canEdit = useHasPermission('user:edit');
  const canDelete = useHasPermission('user:delete');
  const canReset = useHasPermission('user:reset-password');
  const showActions = session && (canEdit || canDelete || canReset);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // State untuk Ganti Password
  const [resetUser, setResetUser] = useState<{
    id: string;
    name: string;
    username: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const confirmDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deletingId || !deletingName) return;
    startTransition(async () => {
      const result = await deleteUser(deletingId);
      if (result.success) {
        toast.success(`User "${deletingName}" berhasil dihapus!`);
        setDeletingId(null);
        setDeletingName(null);
        setIsDialogOpen(false);
      } else {
        toast.error(result.error.message);
      }
    });
  };

  const openResetPasswordModal = (user: {
    id: string;
    name: string;
    username: string;
  }) => {
    setResetUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const handleChangePassword = () => {
    if (!resetUser) return;
    if (!newPassword) {
      setPasswordError('Password baru harus di isi!');
      return;
    }
    startTransition(async () => {
      const result = await changePassword(resetUser.id, newPassword);
      if (result.success) {
        toast.success('Password berhasil diubah!');
        setIsPasswordModalOpen(false);
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
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Permissions</TableHead>
            {showActions && <TableHead>Aksi</TableHead>}
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
              {showActions && (
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-5 w-5' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {canReset && (
                        <DropdownMenuItem
                          onClick={() =>
                            openResetPasswordModal({
                              id: user.id,
                              name: user.name,
                              username: user.username
                            })
                          }
                        >
                          Ganti Password
                        </DropdownMenuItem>
                      )}
                      {canEdit && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/users/${user.id}`}>Edit</Link>
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <DropdownMenuItem
                          onClick={() => confirmDelete(user.id, user.name)}
                          className='text-red-600'
                        >
                          Hapus
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Alert Dialog Hapus */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus User &quot;{deletingName}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Ganti Password */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Password</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Label>Nama</Label>
              <Input readOnly value={resetUser?.name} disabled />
            </div>
            <div>
              <Label>Username</Label>
              <Input readOnly value={resetUser?.username} disabled />
            </div>
            <div>
              <Label>Password Baru</Label>
              <div className='flex items-center gap-2'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Masukkan password baru'
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPassword.length > 0 && passwordError !== null) {
                      setPasswordError(null);
                    }
                  }}
                  className={passwordError ? 'border-destructive border' : ''}
                />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </Button>
              </div>
              {passwordError && (
                <p className='text-destructive text-sm'>
                  Password Baru Harus diisi
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Batal
            </Button>
            <Button onClick={handleChangePassword} disabled={isPending}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersView;
