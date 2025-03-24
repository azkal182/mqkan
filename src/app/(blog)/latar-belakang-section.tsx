'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

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

const LatarBelakangSection = ({ even }: { even: boolean }) => {
  return (
    <motion.section
      id='latar-belakang'
      className={`flex min-h-[calc(100dvh-52px)] items-center ${even ? 'bg-white' : 'bg-[#f8f6f1]'} py-20`}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className='container mx-auto px-4'>
        <motion.div className='mb-16 text-center' variants={sectionVariants}>
          <h2 className='mb-4 text-4xl font-bold text-gray-800'>
            Latar Belakang
          </h2>
          <div className='mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#0C713D] to-[#2ea66a]' />
        </motion.div>
        <motion.div
          className={`rounded-xl ${even ? 'bg-[#f8f6f1]' : 'bg-white'} p-8 shadow-sm`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className='leading-relaxed text-gray-700'>
            Pesantren merupakan lembaga pendidikan tradisional yang berperan
            penting dalam mencetak sumber daya manusia yang kompeten di bidang
            agama, khususnya dalam memahami kitab kuning. Salah satu inovasi
            dalam pendidikan kitab kuning adalah metode Amtsilati, yang
            dikembangkan oleh KH Taufiqul Hakim, pengasuh Pondok Pesantren Darul
            Falah. Metode ini dirancang untuk mempermudah santri dalam memahami
            dan menghafal kitab kuning secara sistematis dan efektif.
          </p>
          <p className='mt-4 leading-relaxed text-gray-700'>
            Keberhasilan metode Amtsilati terlihat dari banyaknya pesantren yang
            mengadopsinya, menunjukkan bahwa pendekatan ini relevan dengan
            kebutuhan pendidikan modern. Dalam rangka memperingati hari
            kelahiran KH Taufiqul Hakim pada 7 Juni 2025 serta menghargai
            kontribusinya, diusulkan penyelenggaraan MQK Amtsilati se Nusantara.
            Acara ini bertujuan sebagai ajang silaturahmi dan penguatan komitmen
            dalam melestarikan serta mengembangkan metode Amtsilati di
            pesantren-pesantren di Indonesia.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LatarBelakangSection;
