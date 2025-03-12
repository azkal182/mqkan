import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

// Extend tipe bawaan User di NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      roles: string[];
      permissions: string[];
      regions: string[];
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username: string;
    roles: string[];
    permissions: string[];
    regions: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    roles: string[];
    permissions: string[];
    regions: string[];
  }
}
