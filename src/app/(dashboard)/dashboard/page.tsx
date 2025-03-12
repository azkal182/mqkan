import PageContainer from '@/components/layout/page-container';
import { auth } from '@/lib/auth';
import React from 'react';

export const metadata = {
  title: 'Dashboard : MQKAN'
};
const page = async () => {
  const sessions = await auth();
  return (
    <PageContainer>
      <div>
        <pre>{JSON.stringify(sessions, null, 2)}</pre>
      </div>
    </PageContainer>
  );
};

export default page;
