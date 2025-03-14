import { createContext, useContext, useMemo, ReactNode } from 'react';
import { Session } from 'next-auth';
import { useCurrentSession } from '@/hooks/use-current-user';

type AuthContextType = {
  session: Session | null;
  permissions: string[];
};

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { session } = useCurrentSession();

  const permissions = useMemo(() => {
    return session?.user?.permissions || [];
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
