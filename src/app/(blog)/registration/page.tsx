import React from 'react';
import RegistrationForm from './form-pendaftaran';
import PageContainer from '@/components/layout/page-container';
import { ScrollArea } from '@/components/ui/scroll-area';

const page = () => {
  return (
    <div>
      <div className='py-8'>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default page;
