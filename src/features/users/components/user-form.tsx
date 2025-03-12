'use client';
import React from 'react';
import {
  createUser,
  updateUser,
  UserWithRolesAndRegions
} from '@/actions/user-action';
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
    defaultValues
  });

  const onSubmit = async (values: User) => {
    try {
      const isUpdate = !!initialData;
      const action = isUpdate
        ? updateUser({ id: initialData.id, ...values })
        : createUser(values);

      const result = await action;
      const actionName = isUpdate
        ? `User ${initialData.name} berhasil diupdate`
        : 'User berhasil dibuat';

      if (result.success) {
        toast.success(actionName);
        router.push('/dashboard/users');
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan, coba lagi nanti.');
    }
  };

  return (
    <Card className='mx-auto max-w-2xl rounded-lg p-4 shadow-lg'>
      <CardHeader>
        <CardTitle className='text-left text-3xl font-semibold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-2'
          >
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
            {!initialData && (
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                          className='w-full justify-between'
                        >
                          {field.value
                            ? roles.find((role: any) => role.id === field.value)
                                ?.name
                            : 'Select role'}
                          <ChevronsUpDown size={16} className='opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Search role...'
                          className='h-9'
                        />
                        <CommandList>
                          <CommandEmpty>No roles found.</CommandEmpty>
                          <CommandGroup>
                            {roles.map((role: any) => (
                              <CommandItem
                                key={role.id}
                                onSelect={() =>
                                  form.setValue('roleId', role.id)
                                }
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
                    maxCount={5}
                    options={regions}
                    onValueChange={(data) => form.setValue('regionId', data)}
                    defaultValue={defaultValues.regionId}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-2 w-full'>
              {initialData ? 'Update' : 'Create'} User
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
