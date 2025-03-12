import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { notFound } from 'next/navigation';
import RoleForm from '@/features/role/components/role-form';
import { getRoleById } from '@/actions/role-action';

export const metadata = {
  title: 'Dashboard : Role View'
};

type PageProps = { params: Promise<{ roleId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  let role = null;
  let pageTitle = 'Create New Role';

  if (params.roleId !== 'new') {
    role = await getRoleById(params.roleId);
    if (!role) {
      notFound();
    }
    pageTitle = `Edit Role`;
  }

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <RoleForm role={role} pageTitle={pageTitle} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
