'use client';
import { useState, useEffect } from 'react';
import RegistrationForm from './form-pendaftaran';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const openingDate = new Date('2025-04-01T00:00:00+07:00');
const closingDate = new Date('2025-05-10T23:59:59+07:00');

type TimeLeft =
  | {
      status: 'countdown';
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | { status: 'open' }
  | { status: 'closed' };

const PendaftaranPage = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [formattedOpeningDate, setFormattedOpeningDate] = useState('');
  const [formattedClosingDate, setFormattedClosingDate] = useState('');

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());

    setFormattedOpeningDate(
      openingDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    );

    setFormattedClosingDate(
      closingDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    );

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft(): TimeLeft {
    const now = new Date().getTime();
    if (now < openingDate.getTime()) {
      const difference = openingDate.getTime() - now;
      return {
        status: 'countdown',
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else if (now <= closingDate.getTime()) {
      return { status: 'open' };
    } else {
      return { status: 'closed' };
    }
  }

  if (!isClient || !timeLeft) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4'>
        <div className='animate-pulse text-xl font-medium text-gray-600'>
          Memuat...
        </div>
      </div>
    );
  }

  return (
    <div>
      {timeLeft.status === 'countdown' ? (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4'>
          <div className='w-full max-w-lg rounded-xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl'>
            <div className='animate-fadeIn space-y-6'>
              <h1 className='text-3xl font-bold tracking-tight text-gray-800'>
                Pendaftaran Segera Dibuka!
              </h1>
              <div className='rounded-lg bg-blue-50 p-4'>
                <p className='text-gray-600'>Dibuka pada:</p>
                <h2 className='mt-1 text-xl font-semibold text-blue-700'>
                  {formattedOpeningDate} pukul 00:00 WIB
                </h2>
              </div>
              <p className='text-lg font-medium text-gray-700'>
                Hitung Mundur:
              </p>
              <div className='grid grid-cols-4 gap-4'>
                {[
                  { value: timeLeft.days, label: 'Hari' },
                  { value: timeLeft.hours, label: 'Jam' },
                  { value: timeLeft.minutes, label: 'Menit' },
                  { value: timeLeft.seconds, label: 'Detik' }
                ].map((item) => (
                  <div key={item.label} className='rounded-lg bg-red-50 p-3'>
                    <div className='text-2xl font-bold text-red-600'>
                      {item.value}
                    </div>
                    <div className='text-sm text-gray-600'>{item.label}</div>
                  </div>
                ))}
              </div>
              <Button asChild className='mt-6 w-full'>
                <Link href={'/'}>Kembali</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : timeLeft.status === 'open' ? (
        <div className='py-8'>
          <RegistrationForm />
        </div>
      ) : (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4'>
          <div className='w-full max-w-lg rounded-xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl'>
            <div className='animate-fadeIn space-y-6'>
              <div className='rounded-lg bg-red-50 p-6'>
                <h1 className='text-3xl font-bold tracking-tight text-red-600'>
                  Pendaftaran Telah Ditutup
                </h1>
                <p className='mt-3 text-lg text-gray-600'>Ditutup pada:</p>
                <h2 className='mt-1 text-xl font-semibold text-gray-800'>
                  {formattedClosingDate} pukul 23:59 WIB
                </h2>
              </div>
              <p className='text-center text-gray-600'>
                Terima kasih atas minat Anda. Sampai jumpa di kesempatan
                berikutnya!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendaftaranPage;
