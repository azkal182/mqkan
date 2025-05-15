'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface SubKelasData {
  PUTRA: number;
  PUTRI: number;
  total: number;
}

const SubKelasCard = React.memo(
  ({ subName, data }: { subName: string; data: SubKelasData }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className='h-full rounded-xl p-4 transition-shadow hover:shadow-md'
      role='region'
      aria-label={`SubKelas ${subName}`}
    >
      <h4 className='mb-2 text-sm font-semibold text-gray-700'>{subName}</h4>
      <div className='space-y-1 text-sm text-gray-600'>
        <p>PUTRA: {data.PUTRA}</p>
        <p>PUTRI: {data.PUTRI}</p>
        <p className='font-semibold text-gray-900'>Total: {data.total}</p>
      </div>
    </motion.div>
  )
);

SubKelasCard.displayName = 'SubKelasCard';

export default SubKelasCard;
