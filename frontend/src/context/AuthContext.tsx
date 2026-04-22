'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { mapUserFromApi, type User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, redirectTo?: string | null) => Promise<void>;
  register: (
    data: {
      name: string;
      email: string;
      password: string;
      role: 'student' | 'instructor';
    },
    redirectTo?: string | null,
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw || raw === 'undefined') return null;
  try {
    const u = JSON.parse(raw) as { id?: string; _id?: string; name: string; email: string; role: 'student' | 'instructor' };
    if (u.id) return u as User;
    if (u._id) return mapUserFromApi({ _id: u._id, name: u.name, email: u.email, role: u.role });
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!t) {
      clearSession();
      return;
    }
    try {
      const { data } = await api.get<{ success: boolean; data: import('@/lib/types').ApiUserPayload }>(
        '/auth/me',
      );
      if (data?.data) {
        persistSession(t, mapUserFromApi(data.data));
      }
    } catch {
      clearSession();
    }
  }, [clearSession, persistSession]);

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const parsed = parseStoredUser();
      if (savedToken && parsed) {
        setToken(savedToken);
        setUser(parsed);
        await refreshUser();
      } else if (savedToken && !parsed) {
        clearSession();
      }
      setLoading(false);
    };
    void init();
  }, [clearSession, refreshUser]);

  useEffect(() => {
    const onUnauthorized = () => {
      clearSession();
      const p = window.location.pathname;
      if (!p.startsWith('/login') && !p.startsWith('/register')) {
        router.replace('/login');
      }
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, [clearSession, router]);

  const login = async (email: string, password: string, redirectTo?: string | null) => {
    const response = await api.post<{
      token: string;
      data: import('@/lib/types').ApiUserPayload;
    }>('/auth/login', { email, password });

    const nextUser = mapUserFromApi(response.data.data);
    persistSession(response.data.token, nextUser);

    if (redirectTo && redirectTo.startsWith('/')) {
      router.push(redirectTo);
      return;
    }
    if (nextUser.role === 'instructor') {
      router.push('/instructor/dashboard');
    } else {
      router.push('/');
    }
  };

  const register = async (
    data: {
      name: string;
      email: string;
      password: string;
      role: 'student' | 'instructor';
    },
    redirectTo?: string | null,
  ) => {
    const response = await api.post<{
      token: string;
      data: import('@/lib/types').ApiUserPayload;
    }>('/auth/register', data);

    const nextUser = mapUserFromApi(response.data.data);
    persistSession(response.data.token, nextUser);

    if (redirectTo && redirectTo.startsWith('/')) {
      router.push(redirectTo);
      return;
    }
    if (nextUser.role === 'instructor') {
      router.push('/instructor/dashboard');
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
