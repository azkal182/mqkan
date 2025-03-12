'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
// import * as z from 'zod';
import { LoginInput, LoginSchema } from '@/schemas/login-schema';
import { login } from '@/actions/login-action';

export default function UserAuthForm() {
  //   const searchParams = useSearchParams();
  //   const callbackUrl = searchParams.get('callbackUrl');
  const [isPending, startTransition] = useTransition();
  const defaultValues = {
    username: 'admin',
    password: 'admin'
  };
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues
  });

  const onSubmit = async (data: LoginInput) => {
    startTransition(async () => {
      await login(data).then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success('Signed In Successfully!');
        }
      });
    });
  };

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-2'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your username...'
                    disabled={isLoading}
                    {...field}
                  />
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
                    placeholder='Enter your password...'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} className='ml-auto w-full' type='submit'>
            Login
          </Button>
        </form>
      </Form>
      {/* <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background text-muted-foreground px-2'>
            Or continue with
          </span>
        </div>
      </div> */}
      {/* <GithubSignInButton /> */}
    </>
  );
}
