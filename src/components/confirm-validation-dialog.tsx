'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; // atau gunakan toast ShadCN jika tersedia

interface ConfirmValidationDialogProps {
  pesertaId: string;
  division?: string;
  onSuccess?: () => void;
}

export default function ConfirmValidationDialog({
  pesertaId,
  onSuccess,
  division = 'korwil'
}: ConfirmValidationDialogProps) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/peserta/validasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pesertaId, division })
      });

      if (!res.ok) throw new Error('Gagal memvalidasi peserta');

      toast.success('Peserta berhasil divalidasi');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Terjadi kesalahan saat memvalidasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Validasi Peserta</Button>
      </DialogTrigger>

      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Konfirmasi Validasi</DialogTitle>
          <DialogDescription>
            Anda akan melakukan validasi data peserta MQKAN. Setelah data
            divalidasi, perubahan tidak akan bisa dilakukan lagi.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 flex items-start space-x-2'>
          <Checkbox
            id='confirm'
            checked={checked}
            onCheckedChange={(v) => setChecked(!!v)}
          />
          <Label htmlFor='confirm' className='text-sm leading-snug'>
            Saya sudah membaca dan memahami bahwa data yang sudah divalidasi
            tidak dapat diubah kembali.
          </Label>
        </div>

        <DialogFooter className='mt-6'>
          <Button variant='outline'>Batal</Button>
          <Button disabled={!checked || loading} onClick={handleConfirm}>
            Validasi Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
