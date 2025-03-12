'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Medal, Mic } from 'lucide-react'; // Icons from lucide-react

// Variants for section animations
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

// Data for competition branches with icons
const competitionBranches = [
  {
    category: 'MQK',
    icon: <BookOpen className='h-8 w-8' />,
    branches: [
      {
        marhalah: 'Marhalah Wustho',
        details:
          'Fathul Ajib min Fathul Qorib Al Mujib (Muqodimah dan Thoharoh)'
      },
      {
        marhalah: 'Marhalah Ulya',
        details:
          'Fathul Ajib min Fathul Qorib Al Mujib (Muqodimah, Thoharoh, dan Ubudiyah)'
      }
    ]
  },
  {
    category: 'Olimpiade',
    icon: <Medal className='h-8 w-8' />,
    branches: [
      { marhalah: 'Marhalah Wustho', details: 'Amtsilati' },
      { marhalah: 'Marhalah Ulya', details: "Amtsilati & Mausu'ati" }
    ]
  },
  {
    category: 'Dakwah',
    icon: <Mic className='h-8 w-8' />,
    branches: [
      { marhalah: 'Marhalah Wustho', details: 'Amtsilati' },
      { marhalah: 'Marhalah Ulya', details: "Amtsilati & Mausu'ati" }
    ]
  }
];

const CompetitionSection = () => {
  return (
    <motion.section
      id='competition-branches'
      className='flex min-h-[calc(100dvh-52px)] items-center bg-[#f8f6f1] py-20'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className='container mx-auto px-4'>
        {/* Enhanced Header */}
        <motion.div className='mb-16 text-center' variants={sectionVariants}>
          <h2 className='mb-4 text-4xl font-bold text-gray-800'>
            Cabang Lomba
          </h2>
          <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#0C713D] to-[#2ea66a]' />
          <p className='mx-auto mt-4 max-w-2xl text-gray-600'>
            Beragam kategori lomba yang menantang dan mengasah kemampuan
            peserta.
          </p>
        </motion.div>

        {/* Competition Cards */}
        <div className='grid gap-8 md:grid-cols-3'>
          {competitionBranches.map((branch, index) => (
            <motion.div
              key={index}
              className='group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-shadow duration-300 hover:shadow-xl'
              variants={itemVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Subtle Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-br from-[#0C713D]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

              {/* Icon and Category */}
              <div className='relative z-10 mb-6 flex items-center'>
                <span className='mr-3 text-[#0C713D]'>{branch.icon}</span>
                <h3 className='text-xl font-semibold text-[#0C713D]'>
                  {branch.category}
                </h3>
              </div>

              {/* Branches List */}
              <ul className='relative z-10 space-y-4'>
                {branch.branches.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className='flex items-start gap-2 text-gray-700'
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className='mt-1 text-[#0C713D]'>•</span>
                    <div>
                      <span className='font-medium'>{item.marhalah}:</span>{' '}
                      <span className='text-gray-600'>{item.details}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CompetitionSection;
