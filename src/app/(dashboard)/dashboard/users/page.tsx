import React from 'react';
import PageContainer from '@/components/layout/page-container';
import { getUsers } from '@/actions/user-action';
import UsersView from '@/features/users/components/users-view';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const metadata = {
  title: 'Dashboard : Users'
};
const Page = async () => {
  const users = await getUsers();

  return (
    <PageContainer>
      <div className={'flex flex-1 flex-col space-y-4'}>
        <div className='flex items-start justify-between'>
          <Heading title='Users' description='Manage Users' />
          <Link
            href='/dashboard/users/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <UsersView users={users} />
      </div>
    </PageContainer>
  );
};

export default Page;
