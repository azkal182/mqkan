'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useUserTableFilters } from './use-user-table-filter';
import { useEffect, useState } from 'react';
import { getRoles } from '@/actions/role-action';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

export default function UserTableAction() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useUserTableFilters();
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await getRoles();
      setRoles(result.map((role) => ({ value: role.id, label: role.name })));
    };
    fetchRoles();
  }, []);

  return (
    <div className='flex flex-wrap items-center gap-4'>
      <DataTableSearch
        searchKey='name'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey='roleId'
        title='Role'
        options={roles}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
