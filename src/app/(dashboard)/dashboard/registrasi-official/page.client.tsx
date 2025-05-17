'use client';
import { AllOfficials, checkInOfficial } from '@/actions/official-action';
import OfficialAutoSelect from '@/components/official-auto-complete';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
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
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const PageClient = ({ users }: { users: AllOfficials[] }) => {
  const [selectedOfficial, setSelectedOfficial] = useState<AllOfficials | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleRegistrasi = () => {
    // setOpen(false);
    // setSelectedOfficial(null);
    // toast.success('Registrasi Official berhasil!');
    if (selectedOfficial) {
      toast.promise(checkInOfficial(selectedOfficial?.id), {
        loading: 'Loading...',
        success: (data) => {
          setSelectedOfficial(null);
          setOpen(false);
          router.refresh();
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
      <div className='mx-auto w-full max-w-2xl'>
        <div className='mb-6'>
          <h1 className='mb-4 text-center text-xl font-bold'>
            Registrasi Official
          </h1>

          <Label>Cari Peserta</Label>
          <OfficialAutoSelect
            users={users}
            onSelect={(data) => {
              setSelectedOfficial(null);
              setSelectedOfficial(data);
            }}
            placeholder='Pilih Official...'
          />
        </div>
        {selectedOfficial ? (
          <div>
            <Card className='max-w-2x mx-auto mt-8'>
              <CardHeader className='bg-gray-500 text-center text-lg font-bold text-white'>
                Regitrasi Official
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='flex items-center justify-center'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={'gambar'}
                    src={selectedOfficial.photo ?? ''}
                    className='w-60'
                  />
                </div>
                <div className='grid grid-cols-2 pt-4'>
                  <div>Nama</div>
                  <div>:{selectedOfficial.fullName}</div>
                  <div>Alamat</div>
                  <div>:{selectedOfficial.address}</div>
                  <div>Korwil</div>
                  <div>:{selectedOfficial.region.name}</div>
                </div>
              </CardContent>
              <CardFooter>
                <div className='flex w-full justify-end'>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button>Registrasi</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Konfirmasi Registrasi</DialogTitle>
                        <DialogDescription>
                          Anda akan mencatat registrasi{' '}
                          <span className='font-bold uppercase'>
                            {selectedOfficial.fullName}
                          </span>{' '}
                          dari korwil{' '}
                          <span className='font-bold uppercase'>
                            {selectedOfficial.region.name}
                          </span>{' '}
                          untuk Official MQKAN. Lanjutkan?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button onClick={handleRegistrasi}>Lanjutkan</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className='flex items-center justify-center pt-32 text-xl text-gray-500'>
            <p> Silahkan Pilih Official untuk registrasi </p>{' '}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageClient;
