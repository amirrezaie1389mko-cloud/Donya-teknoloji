import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../lib/types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOwner: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lumen_token');
    if (!token) { setLoading(false); return; }
    api.getMe()
      .then(res => setUser(res.user))
      .catch(() => { localStorage.removeItem('lumen_token'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('lumen_token', res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('lumen_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout,
      isAdmin: user?.role === 'OWNER' || user?.role === 'AUTHORIZED_ADMIN',
      isOwner: user?.role === 'OWNER',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
