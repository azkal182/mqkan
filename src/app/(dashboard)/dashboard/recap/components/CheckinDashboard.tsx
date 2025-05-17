'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { Suspense } from 'react';
import SummaryCard from './SummaryCard';
import SubKelasCard from './SubKelasCard';
import SkeletonCard from './SkeletonCard';
import { TRecapResponse } from '@/actions/participant-action';

interface CheckinDashboardProps {
  data: TRecapResponse;
}

export default function CheckinDashboard({ data }: CheckinDashboardProps) {
  return (
    <Suspense
      fallback={
        <div className='space-y-6 p-4'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      }
    >
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='mb-4 text-lg font-bold'>Total Dana</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border-l-4 border-green-500 bg-white p-6 shadow-lg`}
            role='region'
          >
            <h2 className='text-sm font-medium text-gray-500'>
              Total Dana Peserta
            </h2>
            <p className='mt-2 text-2xl font-bold text-gray-900'>
              Rp.{' '}
              {new Intl.NumberFormat('id-ID').format(
                data.global.totalCheckin * 50000
              )}
            </p>
          </motion.div>
        </motion.div>
        {/* Global Summary */}
        <div className='mb-4 text-lg font-bold'>Peserta</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
        >
          <SummaryCard
            title='Total Peserta Sudah Registrasi'
            value={data.global.totalCheckin}
            color='border-green-500'
          />
          <SummaryCard
            title='Total Peserta Belum Registrasi'
            value={data.global.totalNotCheckin}
            color='border-red-500'
          />
          <SummaryCard
            title='Total Peserta'
            value={data.global.total}
            color='border-blue-500'
          />
        </motion.div>
        <div className='mb-4 text-lg font-bold'>Official</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
        >
          <SummaryCard
            title='Total Official sudah registrasi'
            value={data.global.officialCheckIn}
            color='border-green-500'
          />
          <SummaryCard
            title='Total Official belum registrasi'
            value={data.global.officialNotCheckIn}
            color='border-red-500'
          />
          <SummaryCard
            title='Total Official'
            value={data.global.totalOfficial}
            color='border-blue-500'
          />
        </motion.div>

        {/* Grouped Checkin */}
        {['checkin', 'notCheckIn'].map((status) => (
          <div key={status} className='mb-8'>
            <div className='mb-4 flex items-center gap-2'>
              {status === 'checkin' ? (
                <CheckCircle className='h-6 w-6 text-green-500' />
              ) : (
                <XCircle className='h-6 w-6 text-red-500' />
              )}
              <h3 className='text-lg font-semibold text-gray-800'>
                {status === 'checkin' ? 'Sudah Registrasi' : 'Belum Registrasi'}
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-4 space-y-4 sm:grid-cols-2 md:grid-cols-3'>
              {/* @ts-ignore */}
              {Object.entries(data.grouped[status].data).map(
                ([kelasName, subKelas]) => (
                  <motion.div
                    key={kelasName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'
                    role='region'
                    aria-label={`Kelas ${kelasName}`}
                  >
                    <h2 className='mb-4 text-base font-semibold text-gray-700'>
                      {/* @ts-ignore */}
                      Kelas: {kelasName} - Total {subKelas.count}
                    </h2>
                    <div className='grid grid-cols-2'>
                      {/* @ts-ignore */}
                      {Object.entries(subKelas.data).map(
                        ([subName, subData]: any) => (
                          <div key={subName} className='min-w-0 flex-1'>
                            <SubKelasCard
                              subName={subName}
                              data={subData.data}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </Suspense>
  );
}
