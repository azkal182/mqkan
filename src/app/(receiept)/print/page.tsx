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

// 'use client';

// import { useEffect, useRef, useState } from 'react';

// export default function Receipt() {
//   const printRef = useRef<HTMLDivElement>(null);

//   const [formattedAmount, setFormattedAmount] = useState<string | null>(null);

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
//     // Format hanya di client
//     setFormattedAmount(transaction.amount.toLocaleString('id-ID'));
//     setTimeout(() => {
//       window.print();
//     }, 300);
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
//           <p className='mt-1 font-bold'>Total: Rp {formattedAmount ?? '...'}</p>
//         </div>

//         <div className='mt-4 text-center'>
//           <p className='text-[10px]'>Terima kasih</p>
//           <p className='text-[10px] italic'>Semoga sukses dalam perlombaan!</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';
//
// import { useEffect, useRef, useState } from 'react';
// import logo from './logo.png';
// import Image from 'next/image';
// import { useSearchParams } from 'next/navigation';
//
// export default function Receipt() {
//   const printRef = useRef<HTMLDivElement>(null);
//   const [formattedAmount, setFormattedAmount] = useState<string | null>(null);
//   const searchParams = useSearchParams()
//
//   // const id = searchParams.get('id')
//   //
//   // const fetchDataById = async () => {
//   //   const data = fetch('/api/data')
//   // }
//
//
//   const transaction = {
//     id: 'TXN20240511',
//     name: 'Ahmad Fauzi wibowo hazam',
//     competition: 'Olimpiade Amtsilati',
//     date: '2025-05-11 09:32',
//     amount: 50000,
//     kelas: 'Wustho',
//   };
//
//   const handlePrint = () => {
//     if (printRef.current) {
//       window.print();
//     }
//   };
//
//   useEffect(() => {
//     setFormattedAmount(transaction.amount.toLocaleString('id-ID'));
//     setTimeout(() => {
//       window.print();
//     }, 300);
//   }, []);
//
//   return (
//     <div className='flex min-h-screen flex-col items-center bg-gray-100 p-4'>
//       <div className='mb-6'>
//         <button
//           onClick={handlePrint}
//           className='rounded bg-blue-600 px-6 py-2 text-sm text-white transition hover:bg-blue-700'
//         >
//           Cetak Struk
//         </button>
//       </div>
//
//       <div
//         ref={printRef}
//         className='receipt w-[260px] bg-white p-2 font-mono text-xs text-black'
//       >
//         <div className='mb-3 text-center'>
//           <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200'>
//             <Image src={logo} alt='logo' width={48} height={48} />
//             {/* <span className='text-[10px] text-gray-500'>Logo</span> */}
//           </div>
//           <h1 className='text-sm leading-snug font-bold uppercase'>
//             SEKRETARIAT PANITIA MQKAN PONDOK PESANTREN DARUL FALAH AMTSILATI
//           </h1>
//           <p className='mt-1 text-[9px] leading-tight'>
//             Dk, Gg. Kenanga II, RT.03/RW.12, Krsak, Sidorejo,
//             <br />
//             Bangsri, Jepara, Jawa Tengah 59453
//           </p>
//           <p className='text-[9px]'>Telp: {transaction.contact}</p>
//           <p className='my-2 border-t border-b border-dashed pt-1 pb-1 text-[10px]'>
//             ==============================
//           </p>
//           <p className='font-bold uppercase'>Bukti Registrasi Lomba</p>
//           <p className='text-[10px]'>==============================</p>
//         </div>
//
//         <div className='mb-3 leading-tight'>
//           <div className='grid grid-cols-[90px_1fr] gap-x-2'>
//             <p>ID Registrasi</p>
//             <p>:{transaction.id}</p>
//             <p>Nama</p>
//             <p>:{transaction.name}</p>
//             <p>Kategori</p>
//             <p>:{transaction.competition}</p>
//             <p>Kelas</p>
//             <p>:{transaction.kelas}</p>
//             <p>Tanggal</p>
//             <p>:{transaction.date}</p>
//             {/*<p>Kasir</p>*/}
//             {/*<p>:{transaction.cashier}</p>*/}
//           </div>
//           <p className='mt-2 text-right font-bold'>
//             Total: Rp {formattedAmount ?? '...'}
//           </p>
//         </div>
//
//         <div className='mt-4 text-center'>
//           <p className='border-t border-dashed pt-2 text-[9px]'>
//             Terima kasih sudah melakukan registrasi peserta
//           </p>
//           {/*<p className='text-[9px] italic'>Semoga sukses dalam perlombaan!</p>*/}
//           {/*<p className='mt-2 text-[8px]'>*/}
//           {/*  Struk ini adalah bukti pembayaran yang sah*/}
//           {/*</p>*/}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logo from './logo.png';
import { ParticipantResponse } from '@/actions/participant-action'; // ganti sesuai path logo kamu

export default function Receipt() {
  const printRef = useRef<HTMLDivElement>(null);
  const [transaction, setTransaction] = useState<ParticipantResponse | null>(
    null
  );
  const [formattedAmount, setFormattedAmount] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const date = new Date().toLocaleString('id-ID');
  const fetchDataById = async (id: string) => {
    try {
      const res = await fetch(`/api/receipt?id=${id}`);
      const json = await res.json();
      console.log(json);
      setTransaction(json.data);
      // setFormattedAmount(json.data.amount.toLocaleString('id-ID'));
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  useEffect(() => {
    if (id) {
      fetchDataById(id);
    }
  }, [id]);

  useEffect(() => {
    if (transaction) {
      setTimeout(() => {
        window.print();
      }, 300);
    }
  }, [transaction]);

  if (!transaction) {
    return <p className='p-4 text-center'>Memuat data...</p>;
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-100 p-4'>
      <div className='mb-6'>
        <button
          onClick={handlePrint}
          className='rounded bg-blue-600 px-6 py-2 text-sm text-white transition hover:bg-blue-700'
        >
          Cetak Struk
        </button>
      </div>

      <div
        ref={printRef}
        className='receipt w-[260px] bg-white px-2 py-4 font-mono text-xs text-black'
      >
        <div className='mb-3 text-center'>
          <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200'>
            <Image src={logo} alt='logo' width={48} height={48} />
          </div>
          <h1 className='text-sm leading-4 font-bold uppercase'>
            SEKRETARIAT PANITIA MQKAN PONDOK PESANTREN DARUL FALAH AMTSILATI
          </h1>
          <p className='mt-1 text-[9px] leading-tight'>
            Dk, Gg. Kenanga II, RT.03/RW.12, Krsak, Sidorejo,
            <br />
            Bangsri, Jepara, Jawa Tengah 59453
          </p>
          {/*<p className='text-[9px]'>Telp: {transaction.contact ?? '-'}</p>*/}
          <p className='mt-2 border-t border-b border-dashed pt-1 pb-1 text-[10px]'>
            ==============================
          </p>
          <p className='font-bold uppercase'>Bukti Registrasi Lomba</p>
          <p className='text-[10px]'>==============================</p>
        </div>

        <div className='mb-3 leading-tight'>
          <div className='grid grid-cols-[90px_1fr] gap-x-2'>
            <p>No Registrasi</p>
            <p>: {transaction.noRegistration}</p>
            <p>Nama</p>
            <p>: {transaction.fullName}</p>
            <p>Korwil</p>
            <p>: {transaction.region.name}</p>
            <p>Kategori</p>
            {/*@ts-ignore*/}
            <p>: {transaction.subKelas.kelas.name}</p>
            <p>Kelas</p>
            {/*@ts-ignore*/}
            <p>: {transaction.subKelas.name}</p>
            <p>Tanggal</p>
            <p>: {date}</p>
          </div>
          <p className='mt-2 text-right font-bold'>Total: Rp 50.000</p>
        </div>

        <div className='mt-4 text-center'>
          <p className='border-t border-dashed pt-2 text-[9px]'>
            Terima kasih sudah melakukan registrasi peserta
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <p className='text-[9px] italic'>-</p>
        </div>
      </div>
    </div>
  );
}
