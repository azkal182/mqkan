'use client';

import { motion } from 'framer-motion';
import React from 'react';

const SummaryCard = React.memo(
  ({
    title,
    value,
    color
  }: {
    title: string;
    value: number;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border-l-4 bg-white p-6 shadow-lg ${color}`}
      role='region'
      aria-label={title}
    >
      <h2 className='text-sm font-medium text-gray-500'>{title}</h2>
      <p className='mt-2 text-2xl font-bold text-gray-900'>{value}</p>
    </motion.div>
  )
);

SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;
