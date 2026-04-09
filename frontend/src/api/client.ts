// OMNIQ API Client
// BASE_URL: set VITE_API_URL in Vercel env vars
const BASE_URL: string = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://omniq-backend.onrender.com';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('omniq_token');
export const setToken = (t: string): void => { localStorage.setItem('omniq_token', t); };
export const clearToken = (): void => { localStorage.removeItem('omniq_token'); };

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(BASE_URL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Record<string, string>;
    throw new Error(body['detail'] ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  token_type: string;
  username: string;
  role: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: string;
  organization?: string;
  permissions: string[];
  product_access: string[];
}

// ── API modules ───────────────────────────────────────────────────────────────
export const authApi = {
  login: (username: string, password: string) =>
    req<TokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username: string, email: string, password: string, company: string) =>
    req<TokenResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password, company }) }),
  me: (token: string) => req<UserProfile>(`/api/auth/me?token=${encodeURIComponent(token)}`),
};

export const argusApi = {
  getStats: () => req<Record<string, unknown>>('/api/argus/stats'),
};

export const nexusApi = {
  getStats: () => req<Record<string, unknown>>('/api/nexus/stats'),
};

export const auroraApi = {
  getStats: () => req<Record<string, unknown>>('/api/aurora/stats'),
};

export const healthApi = {
  check: () => req<{ status: string }>('/health'),
};
