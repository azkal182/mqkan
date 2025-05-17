import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import TransactionForm from '@/features/transaction/components/form-transaction';
import React, { Suspense } from 'react';

type PageProps = { params: Promise<{ keuanganId: string }> };

const page = async (props: PageProps) => {
  const params = await props.params;

  if (params.keuanganId === 'new') {
    return (
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          <Suspense fallback={<FormCardSkeleton />}>
            <TransactionForm
            //   initialData={null}
            //   pageTitle='Create New User'
            //   roles={roles}
            //   regions={regions}
            />
          </Suspense>
        </div>
      </PageContainer>
    );
  }

  return <div>page</div>;
};

export default page;
