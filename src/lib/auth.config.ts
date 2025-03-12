import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { LoginSchema } from '@/schemas/login-schema';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const authConfig = {
  providers: [
    GithubProvider({}),
    CredentialProvider({
      credentials: {
        username: {
          type: 'text'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const { username, password } =
          await LoginSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: {
            username
          }
        });
        if (!user) {
          throw new Error('User not found.');
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
          throw new Error('invalid credentials.');
        }

        return user;
      }
    })
  ],
  pages: {
    signIn: '/login' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
