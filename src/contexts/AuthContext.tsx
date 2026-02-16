import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';

export type Role = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  college?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (userId: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, name, role, college')
        .eq('user_id', userId.toUpperCase())
        .eq('password', password)
        .single();

      if (error || !data) {
        return false;
      }

      setUser({
        id: data.id,
        name: data.name,
        role: data.role as Role,
        college: data.college ?? undefined,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const role: Role = user?.role ?? 'guest';

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
