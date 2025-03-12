'use client';
import React from 'react';
import { createUser, UserWithRolesAndRegions } from '@/actions/user-action';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { User, UserSchema } from '@/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { MultiSelect } from '@/components/multi-select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
interface UserFormProps {
  initialData: UserWithRolesAndRegions | null;
  pageTitle: string;
  roles: any;
  regions: any;
}
const UserForm = ({
  initialData,
  pageTitle,
  roles,
  regions
}: UserFormProps) => {
  const router = useRouter();
  const defaultValues = {
    name: initialData?.name || '',
    username: initialData?.username || '',
    password: initialData?.password || '',
    roleId: initialData?.roles.length ? initialData?.roles[0].roleId : '',
    regionId: initialData?.regions.length
      ? initialData.regions.map((region) => region.regionId)
      : []
  };

  const form = useForm<User>({
    resolver: zodResolver(UserSchema),
    values: defaultValues
  });

  function onSubmit(values: User) {
    // console.log(values);

    if (initialData) {
      alert('edit');
    } else {
      createUser(values).then((result) => {
        if ('error' in result) {
          toast.error(result.error);
        } else if ('success' in result && result.success) {
          toast.success('Successfully created user');
          router.push('/dashboard/users');
        }
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={'password'}
                      placeholder='Enter Password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='roleId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Role</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? roles.find((role: any) => role.id === field.value)
                                ?.name
                            : 'Select language'}
                          <ChevronsUpDown size={16} className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Search framework...'
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {roles.map((role: any) => (
                              <CommandItem
                                value={role.id}
                                key={role.id}
                                onSelect={() => {
                                  form.setValue('roleId', role.id);
                                }}
                              >
                                {role.name}
                                <Check
                                  size={16}
                                  className={cn(
                                    'ml-auto',
                                    role.id === field.value
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
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='regionId'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Region</FormLabel>
                  <MultiSelect
                    maxCount={7}
                    options={regions}
                    onValueChange={(data) => form.setValue('regionId', data)}
                    defaultValue={
                      initialData?.regions.length
                        ? initialData.regions.map((region) => region.regionId)
                        : []
                    }
                  />
                  {/*<Popover>*/}
                  {/*  <PopoverTrigger asChild>*/}
                  {/*    <FormControl>*/}
                  {/*      <Button*/}
                  {/*        variant='outline'*/}
                  {/*        role='combobox'*/}
                  {/*        className={cn(*/}
                  {/*          'w-[200px] justify-between',*/}
                  {/*          !field.value && 'text-muted-foreground'*/}
                  {/*        )}*/}
                  {/*      >*/}
                  {/*        {field.value*/}
                  {/*          ? regions.find(*/}
                  {/*              (region) => region.id === field.value*/}
                  {/*            )?.name*/}
                  {/*          : 'Select Region'}*/}
                  {/*        <ChevronsUpDown size={16} className='opacity-50' />*/}
                  {/*      </Button>*/}
                  {/*    </FormControl>*/}
                  {/*  </PopoverTrigger>*/}
                  {/*  <PopoverContent className='w-[200px] p-0'>*/}
                  {/*    <Command>*/}
                  {/*      <CommandInput*/}
                  {/*        placeholder='Search framework...'*/}
                  {/*        className='h-9'*/}
                  {/*      />*/}
                  {/*      <CommandList>*/}
                  {/*        <CommandEmpty>No framework found.</CommandEmpty>*/}
                  {/*        <CommandGroup>*/}
                  {/*          {regions.map((region) => (*/}
                  {/*            <CommandItem*/}
                  {/*              value={region.id}*/}
                  {/*              key={region.id}*/}
                  {/*              onSelect={() => {*/}
                  {/*                form.setValue('roleId', region.id);*/}
                  {/*              }}*/}
                  {/*            >*/}
                  {/*              {region.name}*/}
                  {/*              <Check*/}
                  {/*                size={16}*/}
                  {/*                className={cn(*/}
                  {/*                  'ml-auto',*/}
                  {/*                  region.id === field.value*/}
                  {/*                    ? 'opacity-100'*/}
                  {/*                    : 'opacity-0'*/}
                  {/*                )}*/}
                  {/*              />*/}
                  {/*            </CommandItem>*/}
                  {/*          ))}*/}
                  {/*        </CommandGroup>*/}
                  {/*      </CommandList>*/}
                  {/*    </Command>*/}
                  {/*  </PopoverContent>*/}
                  {/*</Popover>*/}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>
              {initialData ? 'Update' : 'Create'} User
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
