'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createOfficial,
  deleteOfficial,
  updateOfficial,
  type Official
} from '@/actions/official-action';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { OfficialFormData, officialSchema } from '@/schemas/official-schema';
import { useCurrentSession } from '@/hooks/use-current-user';
import { toast } from 'sonner';

type SelectedOfficial = Official & { action?: 'delete' };

interface OfficialTableProps {
  data: Official[];
  regions: {
    name: string;
    id: string;
  }[];
}

const OfficialTable = ({ data, regions }: OfficialTableProps) => {
  const [selected, setSelected] = useState<SelectedOfficial | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const { session } = useCurrentSession();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<OfficialFormData>({
    resolver: zodResolver(officialSchema),
    defaultValues: {
      fullName: '',
      address: '',
      phone: '',
      aggree: false,
      regionId: ''
    }
  });
  const userRegions = session?.user?.regions ?? [];
  const isAggreed = watch('aggree');

  useEffect(() => {
    if ((addModalOpen || editModalOpen) && userRegions.length > 0) {
      // Set regionId default jika user punya region
      setValue('regionId', userRegions[0]);
    }
  }, [addModalOpen, editModalOpen, userRegions, setValue]);
  const openAddModal = () => {
    setSelected(null);
    reset();
    setAddModalOpen(true);
  };

  const openEditModal = (item: Official) => {
    setSelected(item);
    reset({
      fullName: item.fullName,
      phone: item.phone,
      address: item.address,
      aggree: item.aggree ?? false,
      regionId: item.regionId ?? ''
    });
    setEditModalOpen(true);
  };

  const closeModals = () => {
    setSelected(null);
    setAddModalOpen(false);
    setEditModalOpen(false);
    reset();
  };

  const onSubmit = async (data: OfficialFormData) => {
    try {
      if (selected) {
        console.log('Edit:', data);
        await updateOfficial(selected.id, data); // Handler edit
        toast.success('Official berhasil diperbarui!'); // Menampilkan toast sukses
      } else {
        console.log('Add:', data);
        await createOfficial(data); // Handler tambah
        toast.success('Official berhasil ditambahkan!'); // Menampilkan toast sukses
      }
      closeModals();
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan, coba lagi nanti!'); // Menampilkan toast error
    }
  };

  const handleDelete = (item: Official) => {
    setSelected({ ...item, action: 'delete' });
  };

  return (
    <div className='space-y-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Daftar Official</h1>

        <Button onClick={openAddModal}>Tambah Official</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Telp</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Wilayah</TableHead>
            <TableHead>Setuju</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={item.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>
                {regions.find((r) => r.id === item.regionId)?.name ?? '-'}
              </TableCell>
              <TableCell>{item.aggree ? '✅' : '❌'}</TableCell>
              <TableCell>
                <div className='flex space-x-2'>
                  <Button size='sm' onClick={() => openEditModal(item)}>
                    Edit
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(item)}
                  >
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Tambah/Edit Modal */}
      <Dialog open={addModalOpen || editModalOpen} onOpenChange={closeModals}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit' : 'Tambah'} Official</DialogTitle>
            <DialogDescription>
              {selected ? 'Ubah data Official.' : 'Isi data Official baru.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='fullName'>Nama</Label>
              <Input id='fullName' {...register('fullName')} />
              {errors.fullName && (
                <p className='text-sm text-red-500'>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='phone'>Telepon</Label>
              <Input id='phone' {...register('phone')} />
              {errors.phone && (
                <p className='text-sm text-red-500'>{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor='address'>Alamat</Label>
              <Input id='address' {...register('address')} />
              {errors.address && (
                <p className='text-sm text-red-500'>{errors.address.message}</p>
              )}
            </div>

            {userRegions.length === 0 && (
              <div>
                <Label htmlFor='regionId'>Korwil</Label>
                <select
                  id='regionId'
                  {...register('regionId')}
                  className='w-full rounded border px-3 py-2'
                >
                  <option value=''>Pilih wilayah</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && (
                  <p className='text-sm text-red-500'>
                    {errors.regionId.message}
                  </p>
                )}
              </div>
            )}

            <Controller
              control={control}
              name='aggree'
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='aggree'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor='aggree' className='leading-4'>
                    Sanggup bertanggung jawab sepenuhnya terkait peserta yang
                    dikirimkan oleh delegasinya
                  </Label>
                </div>
              )}
            />

            <DialogFooter>
              <Button type='submit' disabled={!isAggreed}>
                {selected ? 'Simpan Perubahan' : 'Tambah'}
              </Button>
              <Button type='button' variant='ghost' onClick={closeModals}>
                Batal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={selected?.action === 'delete'} onOpenChange={closeModals}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Hapus Official</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus Official{' '}
              <strong>{selected?.fullName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='ghost' onClick={closeModals}>
              Batal
            </Button>
            <Button
              variant='destructive'
              onClick={async () => {
                console.log('Hapus:', selected?.id);
                // TODO: panggil handler hapus

                if (selected && selected.id) {
                  closeModals();
                  await deleteOfficial(selected.id);
                  toast.success('Data berhasi dihapus');
                }
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfficialTable;
