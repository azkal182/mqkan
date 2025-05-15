// import { getRecap } from '@/actions/participant-action';
// import React from 'react';

// const Card = ({
//   title,
//   children
// }: {
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <div className='w-full rounded-2xl bg-white p-4 shadow-md'>
//     <h2 className='mb-2 text-lg font-semibold'>{title}</h2>
//     {children}
//   </div>
// );

// export default async function CheckinDashboard() {
//   const data = await getRecap();
//   return (
//     <div className='space-y-6 p-4'>
//       {/* Global Summary */}
//       <div className='grid grid-cols-3 gap-4'>
//         <Card title='Total CheckIn'>{data.global.totalCheckin}</Card>
//         <Card title='Total Belum CheckIn'>{data.global.totalNotCheckin}</Card>
//         <Card title='Total Peserta'>{data.global.total}</Card>
//       </div>

//       {/* Grouped Checkin */}
//       {['checkin', 'notCheckIn'].map((status) => (
//         <div key={status} className='space-y-4'>
//           <h3 className='text-xl font-bold'>
//             {status === 'checkin' ? '✅ CheckIn' : '❌ Belum CheckIn'}
//           </h3>

//           {Object.entries(data.grouped[status].data).map(
//             ([kelasName, subKelas]) => (
//               <Card key={kelasName} title={`Kelas: ${kelasName}`}>
//                 <div className='grid grid-cols-2 gap-4'>
//                   {Object.entries(subKelas.data).map(
//                     ([subName, subData]: any) => (
//                       <div
//                         key={subName}
//                         className='flex flex-col gap-1 rounded-xl bg-gray-100 p-3'
//                       >
//                         <h4 className='text-md font-medium'>
//                           SubKelas: {subName}
//                         </h4>
//                         <div className='text-sm'>
//                           PUTRA: {subData.data.PUTRA}
//                         </div>
//                         <div className='text-sm'>
//                           PUTRI: {subData.data.PUTRI}
//                         </div>
//                         <div className='text-sm font-semibold'>
//                           Total: {subData.data.total}
//                         </div>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </Card>
//             )
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

import { getRecap } from '@/actions/participant-action';
import CheckinDashboard from './components/CheckinDashboard';

export default async function DashboardPage() {
  const data = await getRecap();

  return <CheckinDashboard data={data} />;
}
