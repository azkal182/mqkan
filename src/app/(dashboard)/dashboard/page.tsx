'use client';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/context/auth-context';
import { useHasPermission } from '@/hooks/use-has-permission';
import React from 'react';

// export const metadata = {
//   title: 'Dashboard : MQKAN'
// };
const Page = () => {
  const { session } = useAuth();

  return (
    <PageContainer>
      <div>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        {useHasPermission('user:edit') && <p>You have admin access</p>}
      </div>
    </PageContainer>
  );
};

export default Page;
