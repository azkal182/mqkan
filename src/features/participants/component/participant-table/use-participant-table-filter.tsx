'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo, useEffect } from 'react';

export function useParticipantTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [kelasFilter, setKelasFilter] = useQueryState(
    'kelas',
    searchParams.kelas.withOptions({ shallow: false }).withDefault('')
  );

  const [subKelasFilter, setSubKelasFilter] = useQueryState(
    'subKelas',
    searchParams.subKelas.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  // Mengecek apakah kelasFilter memiliki hanya 1 ID
  const kelasIds = kelasFilter ? kelasFilter.split('.') : [];
  const isSingleKelas = kelasIds.length === 1;

  // Reset subKelasFilter jika kelas memiliki lebih dari 1 ID
  useEffect(() => {
    if (!isSingleKelas) {
      setSubKelasFilter(null);
    }
  }, [isSingleKelas, setSubKelasFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setKelasFilter(null);
    setSubKelasFilter(null);
    setPage(1);
  }, [setSearchQuery, setKelasFilter, setSubKelasFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery || !!kelasFilter || (isSingleKelas && !!subKelasFilter)
    );
  }, [searchQuery, kelasFilter, subKelasFilter, isSingleKelas]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    kelasFilter,
    setKelasFilter,
    subKelasFilter,
    setSubKelasFilter,
    isSingleKelas // Menyediakan informasi apakah hanya satu kelas yang dipilih
  };
}
