import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true,
  header = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  header?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className={`${header ? 'h-[calc(100dvh-52px)]' : 'h-dvh'}`}>
          <div className='flex flex-1 p-4 md:px-6'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 p-4 md:px-6'>{children}</div>
      )}
    </>
  );
}
