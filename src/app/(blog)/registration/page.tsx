import React from 'react';
import RegistrationForm from './form-pendaftaran';
import PageContainer from '@/components/layout/page-container';
import { ScrollArea } from '@/components/ui/scroll-area';

const page = () => {
  return (
    <ScrollArea className='flex h-dvh flex-1 px-4 md:px-6'>
      <div className='py-8'>
        <RegistrationForm />
      </div>
    </ScrollArea>
  );
};

export default page;
