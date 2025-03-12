import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { LoginSchema } from '@/schemas/login-schema';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const authConfig = {
  // adapter: PrismaAdapter(prisma),
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
          where: { username: username },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: { select: { name: true } }
                      }
                    }
                  }
                }
              }
            },
            regions: {
              include: {
                region: { select: { id: true } }
              }
            }
          }
        });

        if (!user) {
          throw new Error('User not found.');
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
          throw new Error('Invalid credentials.');
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          roles: user.roles.map((ur) => ur.role.name),
          permissions: user.roles.flatMap((ur) =>
            ur.role.permissions.map((rp) => rp.permission.name)
          ),
          regions: user.regions.map((ur) => ur.region.id)
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.username = user.username;
        token.roles = user.roles;
        token.permissions = user.permissions;
        token.regions = user.regions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
        session.user.regions = token.regions;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
