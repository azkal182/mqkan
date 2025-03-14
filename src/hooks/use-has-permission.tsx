import { useAuth } from '@/context/auth-context';
import { useMemo } from 'react';

export const useHasPermission = (permission: string) => {
  const { permissions } = useAuth();

  return useMemo(
    () => permissions.includes(permission),
    [permissions, permission]
  );
};
