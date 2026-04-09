import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi, setToken, clearToken, getToken } from '../api/client';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: string;
  organization?: string;
  permissions: string[];
  product_access: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, company: string) => Promise<void>;
  logout: () => void;
}

function decodeTokenPayload(token: string): { sub?: string; role?: string } | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    return JSON.parse(window.atob(padded)) as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

function buildUserFromToken(token: string): UserProfile | null {
  const payload = decodeTokenPayload(token);
  if (!payload?.sub) return null;
  return {
    id: payload.sub,
    username: payload.sub,
    role: payload.role ?? 'viewer',
    permissions: [],
    product_access: [],
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      const nextUser = buildUserFromToken(stored);
      if (nextUser) {
        setUser(nextUser);
      } else {
        clearToken();
        setTokenState(null);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(username, password);
      setToken(res.access_token);
      setTokenState(res.access_token);
      setUser({
        id: res.username,
        username: res.username,
        role: res.role,
        permissions: [],
        product_access: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, company: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(username, email, password, company);
      setToken(res.access_token);
      setTokenState(res.access_token);
      setUser({
        id: res.username,
        username: res.username,
        email,
        organization: company,
        role: res.role,
        permissions: [],
        product_access: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  }), [user, token, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
