import { getRoles } from '@/actions/role-action';
import RoleView from '@/features/role/components/role-view';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

export default async function RolePage() {
  const roles = await getRoles();
  return (
    <PageContainer>
      <div className={'flex flex-1 flex-col space-y-4'}>
        <div className='flex items-start justify-between'>
          <Heading title='Roles' description='Manage Roles' />
          <Link
            href='/dashboard/roles/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className='mr-2 h-4 w-4' /> Add New
          </Link>
        </div>
        <RoleView roles={roles} />
      </div>
    </PageContainer>
  );
}
