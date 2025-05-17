import { getAllOfficial } from '@/actions/official-action';
import OfficialAutoSelect from '@/components/official-auto-complete';
import React from 'react';
import PageClient from './page.client';

const page = async () => {
  const data = await getAllOfficial();
  return (
    <div>
      <PageClient users={data} />
    </div>
  );
};

export default page;
