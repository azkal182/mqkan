'use client';

import {
  checkInParticipant,
  ParticipantResponseActive
} from '@/actions/participant-action';
import UserAutoSelect from '@/components/participannt-auto-complete';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface PageClientProps {
  participant: ParticipantResponseActive[];
}

const formatDate = (date: Date) => {
  return date
    ? DateTime.fromJSDate(new Date(date))
        .setZone('Asia/Jakarta')
        .toFormat('dd-MMMM-yyyy')
    : 'Tanggal tidak tersedia';
};

export default function PageClient({ participant }: PageClientProps) {
  const [selectedParticipan, setSelectedParticipant] =
    useState<ParticipantResponseActive | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleUserSelect = (participant: ParticipantResponseActive) => {
    if (!participant.checkIn) {
      setSelectedParticipant(participant);
    } else {
      toast.error(`Peserta ${participant.fullName} sudah melakukan registrasi`);
      window.open(`/print?id=${participant!.id}`, '_blank');
      setSelectedParticipant(null);
    }
  };

  // Format tanggal cetak untuk header
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handleCheckIn = async () => {
    if (selectedParticipan) {
      toast.promise(checkInParticipant(selectedParticipan?.id), {
        loading: 'Loading...',
        success: (data) => {
          setSelectedParticipant(null);
          setOpen(false);
          router.refresh();
          window.open(`/print?id=${data.data.id}`, '_blank');
          return data.message;
        },
        error: (data) => {
          return data.message;
        }
      });
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6 font-serif'>
      <div className='mx-auto max-w-6xl'>
        {/* Selektor Peserta */}
        <div className='mb-6'>
          <h1 className='mb-4 text-center text-xl font-bold'>
            Registrasi Peserta
          </h1>

          <Label>Cari Peserta</Label>
          <UserAutoSelect
            users={participant}
            onSelect={handleUserSelect}
            placeholder='Pilih Peserta...'
          />
        </div>

        {/* Detail Peserta */}
        {selectedParticipan ? (
          <div className='rounded-lg border border-gray-200 bg-white shadow-md'>
            {/* Header */}
            <div className='bg-gray-800 p-6 text-center text-white'>
              <h1 className='text-2xl font-bold'>Detail Peserta</h1>
              <p className='text-sm'>Olimpiade Amtsilati</p>
              <p className='mt-2 text-xs'>Dicetak pada: {printDate}</p>
            </div>

            {/* Informasi Utama */}
            <div className='p-8'>
              <div className='mb-6 flex justify-between border-b border-gray-200 pb-3'>
                <div className='pb-4'>
                  <h2 className='text-xl font-semibold text-gray-800 uppercase'>
                    {selectedParticipan.fullName}
                  </h2>
                  <p className='text-sm text-gray-600'>
                    Nomor Registrasi: {selectedParticipan.noRegistration}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Korwil: {selectedParticipan.region.name}
                  </p>
                </div>
                <div className='w-32'>
                  <img src={selectedParticipan.photo as string} alt='photo' />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                {/* Informasi Pribadi */}
                <div>
                  <h3 className='mb-3 text-lg font-semibold text-gray-700'>
                    Informasi Pribadi
                  </h3>
                  <dl className='space-y-2'>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Nomor Induk Kependudukan
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.nik}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Tempat Lahir
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.birthPlace}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Tanggal Lahir
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {formatDate(selectedParticipan.birthDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Jenis Kelamin
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.gender}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Informasi Wali Santri */}
                <div>
                  <h3 className='mb-3 text-lg font-bold text-gray-700'>
                    Informasi Wali Santri
                  </h3>
                  <dl className='space-y-2'>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Nama Bapak
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.fatherName}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-bold text-gray-600'>
                        Alamat Ibu
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.motherName}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-bold text-gray-600'>
                        Nomor Telepon Wali
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.parentPhone}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Informasi Wilayah */}
                <div>
                  <h3 className='mb-3 text-lg font-semibold text-gray-700'>
                    Informasi Alamat
                  </h3>
                  <dl className='space-y-2'>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Provinsi
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.province.name}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Kabupaten/Kota
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.regency.name}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Kecamatan
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.district.name}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Desa/Kelurahan
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.village.name}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Alamat Lengkap
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.address}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Informasi Institusi */}
                <div>
                  <h3 className='mb-3 text-lg font-bold text-gray-700'>
                    Informasi Lembaga
                  </h3>
                  <dl className='space-y-2'>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Nama Lembaga
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.institutionName}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-bold text-gray-600'>
                        Alamat Lembaga
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.institutionAddress}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Informasi Kelas */}
                <div>
                  <h3 className='mb-3 text-lg font-semibold text-gray-700'>
                    Informasi Kelas
                  </h3>
                  <dl className='space-y-2'>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Kelas
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.kelas}
                      </dd>
                    </div>
                    <div>
                      <dt className='text-sm font-medium text-gray-600'>
                        Sub Kelas
                      </dt>
                      <dd className='text-sm font-bold text-gray-900'>
                        {selectedParticipan.subKelas}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className='mt-2 flex justify-end'>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>Registrasi</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Konfirmasi Registrasi</DialogTitle>
                      <DialogDescription>
                        Anda akan mencatat registrasi ulang{' '}
                        <span className='font-bold uppercase'>
                          {selectedParticipan.fullName}
                        </span>{' '}
                        dari korwil{' '}
                        <span className='font-bold uppercase'>
                          {selectedParticipan.region.name}
                        </span>{' '}
                        No Registrasi{' '}
                        <span className='font-bold uppercase'>
                          {selectedParticipan.noRegistration}
                        </span>{' '}
                        untuk lomba MQK dengan biaya Rp50.000. Lanjutkan?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant='outline' onClick={() => setOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleCheckIn}>Lanjutkan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center pt-32 text-xl text-gray-500'>
            <p> Silahkan Pilih peserta untuk registrasi ulang</p>{' '}
          </div>
        )}
      </div>
    </div>
  );
}
