'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ParticipantResponseActive } from '@/actions/participant-action';

interface UserAutoSelectProps {
  users: ParticipantResponseActive[];
  onSelect: (user: ParticipantResponseActive) => void;
  placeholder?: string;
}

function UserAutoSelect({
  users,
  onSelect,
  placeholder = 'Select a user...'
}: UserAutoSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] =
    React.useState<ParticipantResponseActive | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null); // Ref untuk button trigger

  const handleSelect = (user: ParticipantResponseActive) => {
    setSelectedUser(user);
    onSelect(user);
    setOpen(false);
  };

  // Mendapatkan lebar button trigger
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef} // Menyimpan referensi button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-white'
        >
          {selectedUser ? selectedUser.fullName : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start' // Memastikan popup sejajar dengan sisi kiri trigger
        className='p-0'
        style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }} // Mengatur lebar sesuai trigger
      >
        <Command>
          <CommandInput placeholder='Search user...' />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.fullName}
                  onSelect={() => handleSelect(user)}
                  className={`${user.checkIn ? 'bg-green-200 [&&]:hover:bg-green-300' : ''}`}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  [{user.noRegistration}] - {user.fullName} - {user.region.name}{' '}
                  - {user.gender}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default UserAutoSelect;
