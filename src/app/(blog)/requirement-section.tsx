'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, User, FileText } from 'lucide-react';

// Variants for section animations
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const RequirementsSection = ({ even }: { even: boolean }) => {
  return (
    <motion.section
      id='requirements'
      className={`flex min-h-[calc(100dvh-52px)] items-center ${even ? 'bg-white' : 'bg-[#f8f6f1]'} py-20`}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className='container mx-auto px-4'>
        <motion.div className='mb-16 text-center' variants={sectionVariants}>
          <h2 className='mb-4 text-4xl font-bold text-gray-800'>
            Persyaratan Peserta
          </h2>
          <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#0C713D] to-[#2ea66a]' />
        </motion.div>
        <div className='grid gap-8 md:grid-cols-3'>
          {['Syarat Umum', 'Kategori Usia', 'Dokumen Pendaftaran'].map(
            (title, index) => (
              <motion.div
                key={index}
                className={`rounded-xl ${even ? 'bg-[#f8f6f1]' : 'bg-white'} p-8 shadow-sm`}
                initial={{
                  opacity: 0,
                  x: index === 0 ? -50 : index === 2 ? 50 : 0
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h3 className='mb-6 text-xl font-semibold'>{title}</h3>
                <div className='space-y-4'>
                  {index === 0 &&
                    [
                      'Santri aktif di pesantren pengguna metode Amtsilati',
                      'Usia sesuai dengan kategori marhalah',
                      'Telah mukim di pesantren minimal 6 bulan'
                    ].map((req, idx) => (
                      <motion.div
                        key={idx}
                        className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                      >
                        <Check
                          className='flex-shrink-0 text-[#0C713D]'
                          size={24}
                        />
                        <p className='flex-grow text-sm text-gray-600'>{req}</p>
                      </motion.div>
                    ))}
                  {index === 1 &&
                    [
                      {
                        title: 'Marhalah Ula',
                        age: 'Di bawah 15 tahun per 20 Mei 2025'
                      },
                      {
                        title: 'Marhalah Wustho',
                        age: 'Di bawah 18 tahun per 20 Mei 2025'
                      },
                      {
                        title: 'Marhalah Ulya',
                        age: 'Di bawah 21 tahun per 20 Mei 2025'
                      }
                    ].map((marhalah, idx) => (
                      <motion.div
                        key={idx}
                        className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                      >
                        <User
                          className='flex-shrink-0 text-[#0C713D]'
                          size={24}
                        />
                        <div className='flex-grow'>
                          <h4 className='font-semibold'>{marhalah.title}</h4>
                          <p className='text-sm text-gray-600'>
                            {marhalah.age}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  {index === 2 &&
                    [
                      {
                        title: 'Surat Keterangan Santri Mukim',
                        desc: 'Dari pimpinan pesantren'
                      },
                      {
                        title: 'KK'
                      },
                      {
                        title: 'Ijazah Terakhir'
                      },
                      {
                        title: 'Pas Foto',
                        desc: 'Latar merah, Kopiyah hitam (laki-laki), Jilbab putih (perempuan)'
                      }
                    ].map((doc, idx) => (
                      <motion.div
                        key={idx}
                        className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                      >
                        <FileText
                          className='flex-shrink-0 text-[#0C713D]'
                          size={24}
                        />
                        <div className='flex-grow'>
                          <h4 className='font-semibold'>{doc.title}</h4>
                          <p className='text-sm text-gray-600'>
                            {doc?.desc ? doc?.desc : ''}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )
          )}
        </div>

        <div className='mt-16 flex items-center justify-center'>
          <motion.a
            href='/registration'
            className='bg-primary text-primary-foreground rounded-lg px-16 py-4 text-center font-semibold hover:bg-[#0C713D]/90'
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Daftar Sekarang
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
};

export default RequirementsSection;
