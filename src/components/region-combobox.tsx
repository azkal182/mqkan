// components/creatable-combobox.tsx
'use client';

import { useState, useTransition, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createRegion } from '@/actions/region-action';

interface Option {
  id: string;
  name: string;
}

interface RegionComboboxProps {
  options: Option[];
  // createAction: (data: { name: string }) => Promise<Option>;
  onSelectedIdChange?: (id: string) => void;
}

export function RegionCombobox({
  options: initialOptions,
  // createAction,
  onSelectedIdChange
}: RegionComboboxProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>(initialOptions);

  // Sync with parent options changes
  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // components/creatable-combobox.tsx (Bagian yang diupdate)
  const handleCreate = () => {
    const tempId = uuidv4();
    const newTempItem = { id: tempId, name: inputValue };

    // Optimistic update
    setOptions((prev) => [...prev, newTempItem]);
    setSelectedId(tempId);
    onSelectedIdChange?.(tempId);

    startTransition(async () => {
      try {
        await createRegion({
          id: tempId,
          name: inputValue
        });

        setInputValue('');
        setOpen(false);
      } catch (error) {
        // Rollback on error
        setOptions((prev) => prev.filter((item) => item.id !== tempId));
        setSelectedId('');
        onSelectedIdChange?.('');
      }
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      inputValue &&
      !options.some(
        (option) => option.name.toLowerCase() === inputValue.toLowerCase()
      )
    ) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {selectedId
            ? options.find((option) => option.id === selectedId)?.name
            : 'Select item...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Search or create...'
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.id}
                value={option.name}
                onSelect={() => {
                  setSelectedId(option.id);
                  onSelectedIdChange?.(option.id);
                  setOpen(false);
                }}
                className={cn(
                  'aria-selected:bg-primary aria-selected:text-primary-foreground',
                  option.id.startsWith('temp-') &&
                    'text-muted-foreground italic'
                )}
              >
                {option.name}
                {option.id.startsWith('temp-') && ' (creating...)'}
              </CommandItem>
            ))}
            {inputValue &&
              !options.some(
                (option) =>
                  option.name.toLowerCase() === inputValue.toLowerCase()
              ) && (
                <CommandItem
                  onSelect={handleCreate}
                  disabled={isPending}
                  className='aria-selected:bg-green-100'
                >
                  {isPending ? 'Creating...' : `Create "${inputValue}"`}
                </CommandItem>
              )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
