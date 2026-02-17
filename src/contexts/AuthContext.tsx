import React, { createContext, useContext, useState, useCallback } from 'react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';

export type Role = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
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
  const convex = useConvex();

  const login = useCallback(async (userId: string, password: string): Promise<boolean> => {
    try {
      const result = await convex.query(api.queries.getUser, { userId, password });
      if (!result) return false;

      setUser({
        id: result.userId,
        name: result.name ?? result.userId,
        role: result.role as Role,
      });
      return true;
    } catch {
      return false;
    }
  }, [convex]);

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
