import {
  getAllParticipantsCount,
  getTotalParticipantsCount
} from '@/actions/participant-action';
import { getAllRegionsWithCount } from '@/actions/region-action';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import React from 'react';

const Page = async () => {
  const count = await getAllParticipantsCount();
  const regions = await getAllRegionsWithCount();
  const totalParticipantsCount = await getTotalParticipantsCount();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div>
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>
            Jumlah Keseluruhan
          </h2>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            <Card className='relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl'>
              <CardHeader className='bg-gradient-to-r from-[#042F2E] to-[#065D5A] p-4 text-white'>
                <CardTitle className='text-lg leading-2 font-semibold'>
                  Jumlah
                </CardTitle>
              </CardHeader>

              <CardContent className='flex flex-col items-center pt-3'>
                <p className='text-4xl font-bold text-[#065D5A]'>
                  {totalParticipantsCount.total}
                </p>
                <p className='text-md text-gray-600'>Peserta</p>
                <div className='flex w-full items-center justify-evenly'>
                  <div>{totalParticipantsCount.putra} putra</div>
                  <div>{totalParticipantsCount.putri} putri</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>
            📊 Total Peserta per SubKelas
          </h2>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {count.map((item, index) => (
              <Card
                key={index}
                className='relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl'
              >
                <CardHeader className='bg-gradient-to-r from-[#042F2E] to-[#065D5A] p-4 text-white'>
                  <CardTitle className='text-lg leading-2 font-semibold'>
                    {item.kelas}
                  </CardTitle>
                  <p className='text-sm'>{item.subKelas}</p>
                </CardHeader>

                <CardContent className='flex flex-col items-center pt-3'>
                  <p className='text-4xl font-bold text-[#065D5A]'>
                    {item.count}
                  </p>
                  <p className='text-md text-gray-600'>Peserta</p>
                  <div className='flex w-full items-center justify-evenly'>
                    <div>{item.putra} putra</div>
                    <div>{item.putri} putri</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className='flex flex-1 flex-col space-y-6'>
          <h2 className='mb-4 text-2xl font-bold text-gray-800'>
            🌍 Daftar Korwil
          </h2>

          <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
            <Table className='min-w-full'>
              <TableHeader className='bg-gradient-to-r from-[#042F2E] to-[#065D5A] text-white'>
                <TableRow>
                  <TableHead className='px-4 py-2 text-white'>#</TableHead>
                  <TableHead className='px-4 py-2 text-white'>
                    Nama Korwil
                  </TableHead>
                  <TableHead className='w-32 px-4 py-2 text-center text-white'>
                    Jumlah Peserta
                  </TableHead>
                  <TableHead className='w-8 px-4 py-2 text-center text-white'>
                    Putra
                  </TableHead>
                  <TableHead className='w-8 px-4 py-2 text-center text-white'>
                    Putri
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regions.map((region, index) => (
                  <TableRow key={region.id} className='hover:bg-gray-100'>
                    <TableCell className='px-4 py-2 text-center'>
                      {index + 1}
                    </TableCell>
                    <TableCell className='px-4 py-2 font-semibold'>
                      {region.name}
                    </TableCell>
                    <TableCell className='px-4 py-2 text-center font-bold text-[#065D5A]'>
                      {region.total}
                    </TableCell>
                    <TableCell className='px-4 py-2 text-center font-bold text-[#065D5A]'>
                      {region.putra}
                    </TableCell>
                    <TableCell className='px-4 py-2 text-center font-bold text-[#065D5A]'>
                      {region.putri}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Page;
