import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { notFound } from 'next/navigation';
import { getUserById } from '@/actions/user-action';
import UserForm from '@/features/users/components/user-form';
import { getRoles } from '@/actions/role-action';
import { getRegions } from '@/actions/region-action';

export const metadata = {
  title: 'Dashboard : Role View'
};

type PageProps = { params: Promise<{ userId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const [roles, regions] = await Promise.all([getRoles(), getRegions()]);

  if (params.userId === 'new') {
    return (
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          <Suspense fallback={<FormCardSkeleton />}>
            <UserForm
              initialData={null}
              pageTitle='Create New User'
              roles={roles}
              regions={regions}
            />
          </Suspense>
        </div>
      </PageContainer>
    );
  }

  const user = await getUserById(params.userId);
  if (!user) {
    notFound();
  }
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UserForm
            initialData={user}
            pageTitle='Edit User'
            roles={roles}
            regions={regions}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
