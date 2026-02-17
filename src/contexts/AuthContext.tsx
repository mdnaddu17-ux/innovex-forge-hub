import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginService, logout as logoutService, refreshSession, restoreSession, subscribeRealtime } from '@/services/platformStore';
import type { PublicRole } from '@/types/domain';

export type Role = PublicRole;

export interface User {
  id: string;
  userId: string;
  name: string;
  role: Exclude<Role, 'guest'>;
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

  useEffect(() => {
    const restored = restoreSession();
    if (restored) {
      setUser({ id: restored.user.id, name: restored.user.name, userId: restored.user.user_id, role: restored.user.role });
    }
    const timer = setInterval(() => refreshSession(), 60_000);
    const unsubscribe = subscribeRealtime(() => {
      const current = restoreSession();
      if (!current) return setUser(null);
      setUser({ id: current.user.id, name: current.user.name, userId: current.user.user_id, role: current.user.role });
    });
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const login = async (userId: string, password: string) => {
    const result = loginService(userId, password);
    if (!result) return false;
    setUser({ id: result.user.id, name: result.user.name, userId: result.user.user_id, role: result.user.role });
    return true;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, role: user?.role ?? 'guest', login, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
