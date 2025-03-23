'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

// Variants for animations
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Data hadiah
const prizeCategories = [
  {
    category: 'MQK (ULYA) - OLIMPIADE (ULYA) - DAKWAH (WUSTHO)',
    prizes: [
      {
        color: '#FFD700',
        title: 'Juara 1',
        prize: 'UMRAH',
        benefits: ['Mendali', 'Sertifikat'],
        order: 'md:order-2',
        size: 'w-full md:w-[35%] md:scale-110',
        highlight: true
      },
      {
        color: '#C0C0C0',
        title: 'Juara 2',
        prize: 'Rp 10.000.000',
        benefits: ['Mendali', 'Sertifikat'],
        order: 'md:order-1',
        size: 'w-full md:w-[30%]'
      },
      {
        color: '#CD7F32',
        title: 'Juara 3',
        prize: 'Rp 5.000.000',
        benefits: ['Mendali', 'Sertifikat'],
        order: 'md:order-3',
        size: 'w-full md:w-[30%]'
      }
    ]
  },
  {
    category: 'MQK (WUSTHO) - OLIMPIADE (WUSTHO) - DAKWAH (ULA)',
    prizes: [
      {
        color: '#FFD700',
        title: 'Juara 1',
        prize: 'Rp 15.000.000',
        benefits: ['Mendali', 'Sertifikat'],
        order: 'md:order-2',
        size: 'w-full md:w-[35%] md:scale-110',
        highlight: true
      },
      {
        color: '#C0C0C0',
        title: 'Juara 2',
        prize: 'Rp 10.000.000',
        benefits: ['Mendali', 'Sertifikat'],
        order: 'md:order-1',
        size: 'w-full md:w-[30%]'
      },
      {
        color: '#CD7F32',
        title: 'Juara 3',
        prize: 'Rp 5.000.000',
        benefits: ['Mendali', 'Sertifikat'],
        order: 'md:order-3',
        size: 'w-full md:w-[30%]'
      }
    ]
  }
];

const PrizeSection = ({ even }: { even: boolean }) => {
  return (
    <motion.section
      id='prizes'
      className={`flex min-h-[calc(100dvh-52px)] items-center ${even ? 'bg-white' : 'bg-[#f8f6f1]'} py-20`}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className='container mx-auto px-4'>
        <motion.div className='mb-12 text-center' variants={sectionVariants}>
          <h2 className='mb-4 text-4xl font-bold text-gray-800'>Hadiah</h2>
          <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#0C713D] to-[#2ea66a]' />
        </motion.div>

        {prizeCategories.map((category, catIndex) => (
          <div key={catIndex} className='mb-24'>
            {/* Judul kategori */}
            <h3 className='mb-10 text-center text-2xl font-semibold text-gray-700'>
              {category.category}
            </h3>

            <div className='flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-x-12'>
              {category.prizes.map((prize, index) => (
                <motion.div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl ${even ? 'bg-[#f8f6f1]' : 'bg-white'} ${prize.order} ${prize.size} p-8 text-center transition-all hover:shadow-lg ${prize.highlight ? 'border-primary animate-pulse border-4 shadow-lg md:shadow-xl' : 'border border-gray-300'} `}
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Efek Glow */}
                  {prize.highlight && (
                    <div className='bg-primary absolute inset-0 opacity-10 blur-lg' />
                  )}

                  <div className='absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-[#0C713D]/10' />
                  <Trophy
                    size={32}
                    className={`mx-auto ${prize.highlight ? 'text-primary' : 'text-gray-500'}`}
                  />
                  <h3
                    className={`mb-2 text-[#0C713D] ${prize.highlight ? 'text-3xl font-extrabold' : 'text-2xl font-bold'}`}
                  >
                    {prize.title}
                  </h3>
                  <p
                    className={`mb-4 text-[#0C713D] ${prize.highlight ? 'text-4xl font-extrabold' : 'text-3xl font-bold'}`}
                  >
                    {prize.prize}
                  </p>
                  <ul className='space-y-2 text-gray-600'>
                    {prize.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

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

export default PrizeSection;
