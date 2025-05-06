'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function RegionsTable({ regions }: { regions: any }) {
  const [expandedRows, setExpandedRows] = useState<any>({});

  const toggleRow = (regionId: any) => {
    setExpandedRows((prev: any) => ({
      ...prev,
      [regionId]: !prev[regionId]
    }));
  };

  return (
    <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
      <Table className='min-w-full'>
        <TableHeader className='hidden bg-gradient-to-r from-[#042F2E] to-[#065D5A] text-white md:table-header-group'>
          <TableRow>
            <TableHead className='px-4 py-2 text-white'>#</TableHead>
            <TableHead className='px-4 py-2 text-white'>Nama Korwil</TableHead>
            <TableHead className='w-32 px-4 py-2 text-center text-white'>
              Jumlah Peserta
            </TableHead>
            <TableHead className='w-16 px-4 py-2 text-center text-white'>
              Putra
            </TableHead>
            <TableHead className='w-16 px-4 py-2 text-center text-white'>
              Putri
            </TableHead>
            <TableHead className='w-sm px-4 py-2 text-center text-white'>
              Kelas & SubKelas
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.map((region: any, index: number) => (
            <TableRow
              key={region.id}
              className='flex flex-col even:bg-gray-50 hover:bg-gray-100 md:table-row'
            >
              <TableCell className='flex px-4 py-2 md:table-cell md:flex-none'>
                <span className='font-semibold md:hidden'>No:</span> {index + 1}
              </TableCell>
              <TableCell className='flex px-4 py-2 font-semibold md:table-cell md:flex-none'>
                <span className='font-semibold md:hidden'>Nama Korwil:</span>{' '}
                {region.name}
              </TableCell>
              <TableCell className='flex px-4 py-2 text-center font-bold text-[#065D5A] md:table-cell md:flex-none'>
                <span className='font-semibold md:hidden'>Jumlah Peserta:</span>{' '}
                {region.total}
              </TableCell>
              <TableCell className='flex px-4 py-2 text-center font-bold text-[#065D5A] md:table-cell md:flex-none'>
                <span className='font-semibold md:hidden'>Putra:</span>{' '}
                {region.putra}
              </TableCell>
              <TableCell className='flex px-4 py-2 text-center font-bold text-[#065D5A] md:table-cell md:flex-none'>
                <span className='font-semibold md:hidden'>Putri:</span>{' '}
                {region.putri}
              </TableCell>
              <TableCell className='px-4 py-2 md:table-cell'>
                <button
                  onClick={() => toggleRow(region.id)}
                  className='flex items-center gap-1 text-sm text-[#065D5A] hover:underline'
                >
                  {expandedRows[region.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  Detail Kelas
                </button>
                {expandedRows[region.id] && (
                  <div className='mt-2 rounded-md bg-gray-50 p-2'>
                    {/* {Object.entries(region.kelas).map(
                      ([kelasName, kelasData]) => (
                        <div key={kelasName} className='mb-2'>
                          <strong className='text-base text-[#042F2E]'>
                            {kelasName}
                          </strong>
                          : Total {kelasData.total} (Putra: {kelasData.putra},
                          Putri: {kelasData.putri})
                          <ul className='ml-4 list-disc space-y-1 text-sm'>
                            {Object.entries(kelasData.subKelas).map(
                              ([subKelasName, subKelasData]) => (
                                <li key={subKelasName}>
                                  {subKelasName}: Total {subKelasData.total}{' '}
                                  (Putra: {subKelasData.putra}, Putri:{' '}
                                  {subKelasData.putri})
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )
                    )} */}
                    {Object.entries(region.kelas as any).map(
                      ([kelasName, kelasData]: [string, any]) => (
                        <div key={kelasName} className='mb-2'>
                          <strong className='text-base text-[#042F2E]'>
                            {kelasName}
                          </strong>
                          : Total {kelasData.total} (Putra: {kelasData.putra},
                          Putri: {kelasData.putri})
                          <ul className='ml-4 list-disc space-y-1 text-sm'>
                            {Object.entries(kelasData.subKelas as any).map(
                              ([subKelasName, subKelasData]: [string, any]) => (
                                <li key={subKelasName}>
                                  {subKelasName}: Total {subKelasData.total}{' '}
                                  (Putra: {subKelasData.putra}, Putri:{' '}
                                  {subKelasData.putri})
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
