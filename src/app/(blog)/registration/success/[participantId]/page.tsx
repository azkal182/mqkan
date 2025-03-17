import { Suspense } from 'react';
import { DateTime } from 'luxon';
import PageContainer from '@/components/layout/page-container';
import { getParticipantById } from '@/actions/participant-action';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const metadata = {
  title: 'Dashboard : Pendaftaran Sukses'
};

type PageProps = { params: Promise<{ participantId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  const data = await getParticipantById(params.participantId);

  // Format tanggal lahir menggunakan Luxon
  const formattedBirthDate = data?.birthDate
    ? DateTime.fromJSDate(new Date(data.birthDate)).toFormat('dd-MM-yyyy')
    : 'Tanggal tidak tersedia';

  return (
    <ScrollArea className='flex h-dvh flex-1 px-4 md:px-6'>
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6'>
        <Card className='w-full max-w-lg p-6'>
          <h1 className='text-primary mb-4 text-center text-2xl font-bold'>
            Pendaftaran Berhasil!
          </h1>
          <p className='text-center text-gray-700'>
            Terima kasih,{' '}
            <strong className={'capitalize'}>{data?.fullName}</strong>, telah
            mendaftar MQKAN.
          </p>
          <p className='mb-4 text-center text-gray-600'>
            Nomor Registrasi: <strong>{data?.noRegistration}</strong>
          </p>

          {/* Informasi Peserta */}
          <div className='mb-4 rounded-md bg-gray-100 p-4'>
            <h2 className='mb-2 text-lg font-semibold text-gray-800'>
              Informasi Peserta
            </h2>
            <div className='grid grid-cols-2 gap-y-2'>
              <p className='font-semibold text-gray-700'>NIK</p>
              <p className='text-gray-700'>:{data?.nik}</p>

              <p className='font-semibold text-gray-700'>
                Tempat/Tanggal Lahir
              </p>
              <p className='text-gray-700 capitalize'>
                :{data?.birthPlace}, {formattedBirthDate}
              </p>

              <p className='font-semibold text-gray-700'>Jenis Kelamin</p>
              <p className='text-gray-700'>:{data?.gender}</p>
            </div>
          </div>

          {/* Kategori & Jenjang */}
          <div className='mb-4 rounded-md bg-blue-100 p-4'>
            <h2 className='text-lg font-semibold text-blue-700'>
              Kategori & Jenjang
            </h2>
            <p className='text-gray-700'>
              {data?.category.name} - {data?.subcategory.name}
            </p>
          </div>

          {/* Instruksi Pembayaran */}
          <div className='mb-4 rounded-md bg-yellow-100 p-4'>
            <h2 className='text-lg font-semibold text-yellow-700'>
              Instruksi Pembayaran
            </h2>
            <p className='text-gray-700'>
              Silakan segera melakukan pembayaran ke rekening pondok berikut:
            </p>
            <p className='text-lg font-bold text-gray-900'>
              BRI: 8789 7986 7834 5345
            </p>
            <p className='text-sm text-gray-600'>
              Harap mencantumkan nomor registrasi saat melakukan transfer.
            </p>
          </div>

          <Alert variant='destructive' className={'mb-4'}>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Penting</AlertTitle>
            <AlertDescription>
              Apabila ada kesalahan data, harap segera konfirmasi ke admin.
            </AlertDescription>
          </Alert>

          <Button asChild>
            <Link href={'/'}>Kembali ke Beranda</Link>
          </Button>
        </Card>
      </div>
    </ScrollArea>
  );
}
