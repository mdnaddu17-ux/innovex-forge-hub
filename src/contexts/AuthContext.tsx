import React, { createContext, useContext, useState, useCallback } from 'react';

export type Role = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const MOCK_USERS: Record<string, { password: string; name: string; role: Role }> = {
  admin: { password: 'admin123', name: 'Admin Engineer', role: 'admin' },
  member: { password: 'member123', name: 'Lab Member', role: 'member' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userId: string, password: string): boolean => {
    const found = MOCK_USERS[userId.toLowerCase()];
    if (found && found.password === password) {
      setUser({ id: userId.toLowerCase(), name: found.name, role: found.role });
      return true;
    }
    return false;
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
