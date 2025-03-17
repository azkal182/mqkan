import { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface CustomSelectProps<T extends { id: string | number; name: string }> {
  field: {
    value: string | number | null;
    onChange: (value: string | number) => void;
  };
  label?: string;
  placeholder?: string;
  description?: string;
  data: T[];
  disabled?: boolean;
  onSelectedObject?: (selected: T) => void;
  onSelect?: (id: number) => void;
}

export function CustomSelect<T extends { id: string | number; name: string }>({
  field,
  label = 'Select',
  placeholder = 'Select an option',
  description,
  data,
  disabled = false,
  onSelectedObject,
  onSelect
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false); // ⬅️ State untuk mengontrol Popover
  const selectedItem = data.find((item) => item.id === field.value) || null;

  const handleSelect = (item: T) => {
    if (disabled) return;
    field.onChange(item.id);
    onSelectedObject?.(item);
    onSelect?.(parseInt(item.id as string));
    setOpen(false); // ⬅️ Tutup Popover setelah memilih item
  };

  return (
    <FormItem className='flex flex-col'>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={open} onOpenChange={setOpen}>
        {' '}
        {/* ⬅️ Kontrol Popover */}
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                'w-full justify-between',
                !selectedItem && 'text-muted-foreground',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              disabled={disabled}
              onClick={() => setOpen((prev) => !prev)} // ⬅️ Toggle Popover
            >
              {selectedItem ? selectedItem.name : placeholder}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent className='w-full p-0'>
            <Command>
              <CommandInput placeholder='Search...' />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item)}
                    >
                      {item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedItem && selectedItem.id === item.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
