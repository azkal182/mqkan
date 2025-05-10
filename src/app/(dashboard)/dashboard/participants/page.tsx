import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus, Newspaper } from 'lucide-react';
import { SearchParams } from 'nuqs/server';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import UserTableAction from '@/features/users/components/user-tables/user-table-action';
import UserListingPage from '@/features/users/components/user-listing';
import ParticipantListingPage from '@/features/participants/component/participant-listing-page';
import ParticipantTableAction from '@/features/participants/component/participant-table/participant-table-action';
import { auth } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard : Peserta'
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};
const ParticipantsPage = async (props: pageProps) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });
  const session = await auth();
  // console.log(session);
  const region = session?.user.regions;

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title='Peserta' description='Daftar Peserta' />
          <div className='flex items-center space-x-2'>
            {region && region?.length > 0 ? (
              <Link
                target='_blank'
                href={`http://localhost:3000/api/region-pdf/${region[0]}`}
                className={cn(buttonVariants(), 'text-xs md:text-sm')}
              >
                <Newspaper className='mr-2 h-4 w-4' /> Export Pdf
              </Link>
            ) : (
              <Link
                target='_blank'
                href={`http://localhost:3000/api/region-pdf`}
                className={cn(buttonVariants(), 'text-xs md:text-sm')}
              >
                <Newspaper className='mr-2 h-4 w-4' /> Export all
              </Link>
            )}

            {/* <Link
              href='/dashboard/participants/new'
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className='mr-2 h-4 w-4' /> Add New
            </Link> */}
          </div>
        </div>
        <Separator />
        <ParticipantTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ParticipantListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ParticipantsPage;
