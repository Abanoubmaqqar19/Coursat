'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/types';
import { Loader2 } from 'lucide-react';

type Props = {
  children: React.ReactNode;
  roles: Role[];
  redirectTo?: string;
};

export default function RoleGuard({ children, roles, redirectTo = '/login' }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace('/');
    }
  }, [user, loading, router, roles, redirectTo]);

  if (loading || !user || !roles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
