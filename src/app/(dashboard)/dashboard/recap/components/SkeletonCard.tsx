'use client';

const SkeletonCard = () => (
  <div className='animate-pulse rounded-2xl bg-gray-100 p-6'>
    <div className='mb-2 h-4 w-1/3 rounded bg-gray-200'></div>
    <div className='h-8 w-1/2 rounded bg-gray-200'></div>
  </div>
);

export default SkeletonCard;
