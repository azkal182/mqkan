'use client';

import {
  changePassword,
  deleteUser,
  UserWithRolesAndRegions
} from '@/actions/user-action';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useHasPermission } from '@/hooks/use-has-permission';
import {
  CircleAlert,
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AlertDialogConfirm from '@/components/alert-dialog-confirm';

interface CellActionProps {
  user: UserWithRolesAndRegions;
}

export const CellAction: React.FC<CellActionProps> = ({ user }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canEdit = useHasPermission('user:edit');
  const canDelete = useHasPermission('user:delete');
  const canReset = useHasPermission('user:reset-password');
  const showActions = canEdit || canDelete || canReset;

  // State untuk Ganti Password
  const [resetUser, setResetUser] = useState<{
    id: string;
    name: string;
    username: string;
  } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  if (!showActions) return null;
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

  const openResetPasswordModal = (user: {
    id: string;
    name: string;
    username: string;
  }) => {
    setResetUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const confirmDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
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

  return (
    <>
      {deletingId && deletingName && (
        <AlertDialogConfirm
          id={deletingId}
          context='User'
          name={deletingName}
          isOpen={isDialogOpen}
          onClose={setIsDialogOpen}
          onDelete={handleDelete}
        />
      )}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {canEdit && (
            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/users/${user.id}`)}
            >
              <Edit className='mr-2 h-4 w-4' /> Edit
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem onClick={() => confirmDelete(user.id, user.name)}>
              <Trash className='mr-2 h-4 w-4' /> Delete
            </DropdownMenuItem>
          )}
          {canReset && (
            <DropdownMenuItem onClick={() => openResetPasswordModal(user)}>
              <CircleAlert className='mr-2 h-4 w-4' /> Reset Password
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
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
    </>
  );
};
