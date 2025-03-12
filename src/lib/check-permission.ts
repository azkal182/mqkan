import { Session } from 'next-auth';

export const hasPermission = (
  session: Session,
  permission: string
): boolean => {
  return session?.user?.permissions.includes(permission);
};
