'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getParticipantCount } from '@/actions/participant-action';

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

// Fungsi untuk animasi counter
const animateCounter = (
  target: number,
  setDisplay: (value: number) => void
) => {
  const duration = 1500;
  const steps = 60; // Jumlah frame
  const increment = target / steps;
  let currentCount = 0;

  const counter = setInterval(() => {
    currentCount += increment;
    if (currentCount >= target) {
      setDisplay(target);
      clearInterval(counter);
    } else {
      setDisplay(Math.round(currentCount));
    }
  }, duration / steps);

  return () => clearInterval(counter);
};

const AboutSection = ({ even }: { even: boolean }) => {
  // State untuk masing-masing nilai yang akan dianimasikan
  const [contingentsCount, setContingentsCount] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  // State untuk nilai yang ditampilkan
  const [displayContingents, setDisplayContingents] = useState(0);
  const [displayParticipants, setDisplayParticipants] = useState(0);
  const [displayCategories, setDisplayCategories] = useState(0);

  // Ambil data dari API dan set nilai target
  useEffect(() => {
    const getCount = async () => {
      const result = await getParticipantCount();
      setParticipantsCount(result);
      setContingentsCount(29);
      setCategoriesCount(6);
    };
    getCount();
  }, []);

  // Animasi untuk setiap counter
  useEffect(() => {
    if (contingentsCount > 0) {
      return animateCounter(contingentsCount, setDisplayContingents);
    }
  }, [contingentsCount]);

  useEffect(() => {
    if (participantsCount > 0) {
      return animateCounter(participantsCount, setDisplayParticipants);
    }
  }, [participantsCount]);

  useEffect(() => {
    if (categoriesCount > 0) {
      return animateCounter(categoriesCount, setDisplayCategories);
    }
  }, [categoriesCount]);

  return (
    <motion.section
      id='about'
      className={`flex min-h-[calc(100dvh-52px)] items-center ${even ? 'bg-white' : 'bg-[#f8f6f1]'} py-20`}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className='container mx-auto px-4'>
        <motion.div className='mb-16 text-center' variants={sectionVariants}>
          <h2 className='mb-4 text-3xl font-bold text-gray-800'>
            Tentang Event Musabaqah Qira&apos;atul Kutub
          </h2>
          <p className='mx-auto max-w-2xl text-gray-600'>
            Musabaqah Qira&apos;atul Kutub adalah kompetisi bergengsi yang
            merayakan penguasaan teks-teks Islam klasik, membina beasiswa dan
            melestarikan warisan intelektual kita yang kaya.
          </p>
        </motion.div>
        <div className='mb-16 grid gap-8 md:grid-cols-3'>
          {[
            {
              icon: 'fa-users-between-lines',
              number: displayContingents,
              text: 'Total Contingents'
            },
            {
              icon: 'fa-user-graduate',
              number: displayParticipants,
              text: 'Total Participants'
            },
            {
              icon: 'fa-book',
              number: displayCategories,
              text: 'Kelas kategori'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-xl ${even ? 'bg-[#f8f6f1]' : 'bg-white'} p-8 text-center`}
              variants={itemVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <i
                className={`fa-solid ${item.icon} mb-4 text-4xl text-[#0C713D]`}
              />
              <h3 className='mb-2 text-4xl font-bold text-gray-800'>
                {item.number}
              </h3>
              <p className='text-gray-600'>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
