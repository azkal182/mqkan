import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import FormCardSkeleton from '@/components/form-card-skeleton';
import { notFound } from 'next/navigation';
import { getUserById } from '@/actions/user-action';
import UserForm from '@/features/users/components/user-form';
import { getRoles } from '@/actions/role-action';
import { getRegions } from '@/actions/region-action';
import { getParticipantById } from '@/actions/participant-action';

export const metadata = {
  title: 'Dashboard : User View'
};

type PageProps = { params: Promise<{ participantId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const [roles, regions] = await Promise.all([getRoles(), getRegions()]);

  if (params.participantId === 'new') {
    return (
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          <Suspense fallback={<FormCardSkeleton />}>
            {/*<UserForm*/}
            {/*  initialData={null}*/}
            {/*  pageTitle='Create New User'*/}
            {/*  roles={roles}*/}
            {/*  regions={regions}*/}
            {/*/>*/}
            new
          </Suspense>
        </div>
      </PageContainer>
    );
  }

  const participant = await getParticipantById(params.participantId);
  if (!participant) {
    notFound();
  }
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          {/*<UserForm*/}
          {/*  initialData={user}*/}
          {/*  pageTitle='Edit User'*/}
          {/*  roles={roles}*/}
          {/*  regions={regions}*/}
          {/*/>*/}
          edit
        </Suspense>
      </div>
    </PageContainer>
  );
}
