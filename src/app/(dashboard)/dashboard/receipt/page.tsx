// 'use client';

// import { useEffect, useRef } from 'react';

// export default function Receipt() {
//   const printRef = useRef<HTMLDivElement>(null);

//   const transaction = {
//     id: 'TXN20240511',
//     name: 'Ahmad Fauzi',
//     competition: 'MQK',
//     date: '2025-05-11 09:32',
//     amount: 50000
//   };

//   const handlePrint = () => {
//     if (printRef.current) {
//       window.print();
//     }
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       window.print();
//     }, 300); // beri jeda agar DOM siap
//   }, []);

//   return (
//     <div className='flex flex-col items-center p-4'>
//       <div className='mb-4'>
//         <button
//           onClick={handlePrint}
//           className='rounded bg-blue-600 px-4 py-2 text-sm text-white'
//         >
//           Cetak Struk
//         </button>
//       </div>

//       <div
//         ref={printRef}
//         className='receipt w-[240px] bg-white p-2 font-mono text-xs text-black'
//       >
//         <div className='mb-2 text-center'>
//           <h1 className='text-sm leading-snug font-bold uppercase'>
//             Pondok Pesantren Darul Falah Amtsilati
//           </h1>
//           <p className='text-[10px] leading-tight'>
//             Dk, Gg. Kenanga II, RT.03/RW.12, Krsak, Sidorejo,
//             <br />
//             Bangsri, Jepara, Jawa Tengah 59453
//           </p>
//           <p className='my-1 text-[10px]'>==============================</p>
//           <p className='font-bold uppercase'>Bukti Pembayaran Lomba</p>
//           <p className='text-[10px]'>==============================</p>
//         </div>

//         <div className='mb-2 leading-tight'>
//           <p>ID Transaksi: {transaction.id}</p>
//           <p>Nama: {transaction.name}</p>
//           <p>Lomba: {transaction.competition}</p>
//           <p>Tanggal: {transaction.date}</p>
//           <p className='mt-1 font-bold'>
//             Total: Rp {transaction.amount.toLocaleString()}
//           </p>
//         </div>

//         <div className='mt-4 text-center'>
//           <p className='text-[10px]'>Terima kasih</p>
//           <p className='text-[10px] italic'>Semoga sukses dalam perlombaan!</p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { Button } from '@/components/ui/button';
import React from 'react';

const page = () => {
  const handlePrint = (id: string) => {
    const printWindow = window.open(`/print`, '_blank');
  };
  return (
    <div>
      <Button onClick={() => handlePrint('123')}>Print</Button>
    </div>
  );
};

export default page;
