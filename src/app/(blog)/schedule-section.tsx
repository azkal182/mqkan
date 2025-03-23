'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Variants for section animations
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const ScheduleSection = ({ even }: { even: boolean }) => {
  return (
    <motion.section
      id='schedule'
      className={`flex min-h-[calc(100dvh-52px)] items-center ${even ? 'bg-white' : 'bg-[#f8f6f1]'} py-20`}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className='container mx-auto px-4'>
        <motion.div className='mb-16 text-center' variants={sectionVariants}>
          <h2 className='mb-4 text-4xl font-bold text-gray-800'>
            Jadwal Pelaksanaan
          </h2>
          <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#0C713D] to-[#2ea66a]' />
        </motion.div>
        <div className='grid gap-8 md:grid-cols-2'>
          <motion.div
            className='rounded-xl bg-[#f8f6f1] p-8 shadow-sm'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h3 className='mb-6 text-xl font-semibold'>Kategori</h3>

            <div className='space-y-4'>
              {[
                { title: 'MQK', desc: 'Wustho-Ulya' },
                { title: 'Olimpiade Amtsilati', desc: 'Wustho-Ulya' },
                { title: 'Dakwah Kontemporer', desc: 'Ula-Wustho' }
              ].map((cat, index) => (
                <motion.div
                  key={index}
                  className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <i className='fa-solid fa-star text-[#0C713D]' />
                  <div>
                    <h4 className='font-semibold'>{cat.title}</h4>
                    <p className='text-sm text-gray-600'>{cat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className={`rounded-xl ${even ? 'bg-[#f8f6f1]' : 'bg-white'} p-8 shadow-sm`}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h3 className='mb-6 text-xl font-semibold'>Tanggal Penting</h3>
            <div className='space-y-4'>
              {[
                { title: 'Pembukaan Pendaftaran', date: '1 April, 2025' },
                { title: 'Penutupan Pendaftaran', date: '30 April, 2025' },
                { title: 'Pelaksanaan', date: '19-22 Mei, 2025' }
              ].map((event, index) => (
                <motion.div
                  key={index}
                  className='flex items-center gap-4 rounded-lg border border-gray-300 p-4'
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <i className='fa-regular fa-calendar text-[#0C713D]' />
                  <div>
                    <h4 className='font-semibold'>{event.title}</h4>
                    <p className='text-sm text-gray-600'>{event.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ScheduleSection;
