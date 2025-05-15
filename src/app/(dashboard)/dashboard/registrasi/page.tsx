import React from 'react';
import PageClient from './page.client';
import { getParticipantsActive } from '@/actions/participant-action';

const page = async () => {
  const participants = await getParticipantsActive();
  return (
    <div>
      <PageClient participant={participants} />
    </div>
  );
};

export default page;
