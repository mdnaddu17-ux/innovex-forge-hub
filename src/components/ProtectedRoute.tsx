import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types/domain';

export default function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactElement;
  allow: Array<Role | 'guest'>;
}) {
  const { role } = useAuth();
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}
