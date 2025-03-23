'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useEffect, useState } from 'react';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { getKelas, getSubKelasByKelasId } from '@/actions/category';
import { useParticipantTableFilters } from './use-participant-table-filter';

export default function ParticipantTableAction() {
  const {
    kelasFilter,
    setKelasFilter,
    subKelasFilter,
    setSubKelasFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    isSingleKelas // Pastikan hanya satu kelas yang dipilih
  } = useParticipantTableFilters();

  const [kelas, setKelas] = useState<{ value: string; label: string }[]>([]);
  const [subKelas, setSubKelas] = useState<{ value: string; label: string }[]>(
    []
  );

  useEffect(() => {
    const fetchKelas = async () => {
      const result = await getKelas();
      setKelas(result.map((kelas) => ({ value: kelas.id, label: kelas.name })));
    };
    fetchKelas();
  }, []);

  useEffect(() => {
    if (isSingleKelas) {
      const fetchSubKelas = async () => {
        const result = await getSubKelasByKelasId(kelasFilter); // Ambil sub-kelas berdasarkan kelas
        setSubKelas(
          result.map((subKelas) => ({
            value: subKelas.id,
            label: subKelas.name
          }))
        );
      };
      fetchSubKelas();
    } else {
      setSubKelas([]); // Kosongkan sub-kelas jika lebih dari satu kelas dipilih
      setSubKelasFilter(null);
    }
  }, [kelasFilter, isSingleKelas, setSubKelasFilter]);

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='name'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='kelasId'
        title='Kategori'
        options={kelas}
        setFilterValue={setKelasFilter}
        filterValue={kelasFilter}
      />
      {isSingleKelas && (
        <DataTableFilterBox
          filterKey='subKelasId'
          title='Jenjang'
          options={subKelas}
          setFilterValue={setSubKelasFilter}
          filterValue={subKelasFilter}
        />
      )}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
