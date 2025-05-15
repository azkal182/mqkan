'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCurrentSession } from '@/hooks/use-current-user';
import { useHasPermission } from '@/hooks/use-has-permission';
import { Edit, MoreHorizontal, TicketCheck, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CellAction = ({ participantId }: { participantId: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const canAccCorwil = useHasPermission('participant:acc-corwill');
  const canAccPusat = useHasPermission('participant:acc-pusatt');
  const showActions = canAccCorwil || canAccPusat;

  const router = useRouter();

  if (!showActions) return null;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {canAccCorwil && (
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/dashboard/participants/review-korwil?participantId=${participantId}`
                )
              }
            >
              <TicketCheck className='mr-2 h-4 w-4' /> Review Korwil
            </DropdownMenuItem>
          )}
          {canAccPusat && (
            <DropdownMenuItem>
              <TicketCheck className='mr-2 h-4 w-4' /> Review Pusat
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Modal Ganti Password */}
    </>
  );
};
