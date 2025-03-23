'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import logoPic from '../../../../public/images/logo.png';
import { AlertCircle, Menu, Search, X } from 'lucide-react';
import { getRegions } from '@/actions/region-action';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const listMenu = [
  { title: 'Home', link: '/#home' },
  { title: 'About', link: '/#about' },
  { title: 'Jadwal Pelaksanaan', link: '/#schedule' },
  { title: 'Pendaftaran', link: '/registration' },
  { title: 'Kontak', link: '/contact' }
];

const formatInternationalNumber = (number: any) => {
  const numStr = number.toString();
  if (numStr.startsWith('62')) {
    return `+62 ${numStr.slice(2, 5)} ${numStr.slice(5, 9)} ${numStr.slice(9)}`;
  } else if (numStr.startsWith('96')) {
    return `+96 ${numStr.slice(2, 5)} ${numStr.slice(5, 9)} ${numStr.slice(9)}`;
  }
  return numStr;
};

const ContactPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [regions, setRegions] = useState<
    {
      name: string;
      id: string;
      coordinator: string;
      phone: string;
      coverage: string[];
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Variants untuk animasi header dan mobile menu
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };
  const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: {
      x: '100%',
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  useEffect(() => {
    const fetchRegion = async () => {
      const result = await getRegions();
      setRegions(result);
    };
    fetchRegion();
  }, []);

  const filteredRegions = regions.filter((region) =>
    [region.name, region.coordinator, region.coverage.join(', ')].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <ScrollArea className='h-dvh'>
      <motion.header
        className='bg-primary fixed z-50 w-full shadow-sm'
        initial='hidden'
        animate='visible'
        variants={headerVariants}
      >
        <div className='container mx-auto px-4'>
          <nav className='flex h-20 items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Image src={logoPic} alt='Picture of the logo' height={42} />
            </div>
            <div className='hidden items-center gap-8 lg:flex'>
              {listMenu.map((item) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  className='text-[#d7bd9c] hover:border-b'
                  whileHover={{ scale: 1.1, color: '#0C713D' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </motion.a>
              ))}
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-[#d7bd9c] lg:hidden'
            >
              <Menu />
            </button>
          </nav>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id='mobile-menu'
              className='fixed inset-0 z-50 bg-white lg:hidden'
              initial='hidden'
              animate='visible'
              exit='exit'
              variants={menuVariants}
            >
              <div className='flex h-full flex-col items-center justify-center space-y-6 text-lg'>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className='absolute top-5 right-5 text-2xl text-[#0C713D]'
                >
                  <X />
                </button>
                {listMenu.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.link}
                    className='text-gray-600 hover:text-[#0C713D]'
                    whileHover={{ scale: 1.1, color: '#0C713D' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Input Pencarian */}
      <section className='container mt-24 space-y-4 pb-6'>
        <div className='relative w-full'>
          <Search
            className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400'
            size={20}
          />
          <Input
            type='text'
            placeholder='Cari berdasarkan nama, koordinator, atau area...'
            className='pl-10' // Memberi padding agar teks tidak menutupi ikon
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Penting</AlertTitle>
          <AlertDescription>
            Jika tidak menemukan area yang tercantum maka pilih area terdekat
            koordinator wilayah setempat.
          </AlertDescription>
        </Alert>
      </section>

      {/* Daftar Wilayah */}
      <section className='container pb-12'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region) => (
              <Card key={region.id} className='p-4'>
                <div className='grid grid-cols-3 gap-x-2'>
                  <div className='font-semibold'>Korwil</div>
                  <div className='col-span-2 text-gray-800'>
                    : {region.name}
                  </div>

                  <div className='font-semibold'>Nama:</div>
                  <div className='col-span-2 text-gray-800'>
                    : {region.coordinator}
                  </div>

                  <div className='font-semibold'>No Telp</div>
                  <Link
                    href={`https://wa.me/${region.phone}`}
                    target='_blank'
                    className='col-span-2 text-gray-800'
                  >
                    : {formatInternationalNumber(region.phone)}
                  </Link>

                  <div className='font-semibold'>Area</div>
                  <div className='col-span-2 break-words text-gray-600'>
                    : {region?.coverage.join(', ') || '-'}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className='col-span-full text-center text-gray-500'>
              Data tidak ditemukan
            </p>
          )}
        </div>
      </section>
    </ScrollArea>
  );
};

export default ContactPage;
