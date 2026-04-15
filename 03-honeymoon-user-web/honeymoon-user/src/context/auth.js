'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore } from '../lib/api';
import { AuthService, UserService } from '../lib/services/user.service';

const AuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [isLoggedIn,setIsLoggedIn]= useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('user_data');
        if (tokenStore.access && stored) {
          setUser(JSON.parse(stored));
          setIsLoggedIn(true);
          try {
            const data = await UserService.getProfile();
            setUser(data.user);
            localStorage.setItem('user_data', JSON.stringify(data.user));
          } catch {}
        }
      } finally { setIsLoading(false); }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await AuthService.login(email, password);
    tokenStore.set(data.accessToken, data.refreshToken); // also sets cookie for middleware
    const u = data.user || data;
    setUser(u); setIsLoggedIn(true);
    localStorage.setItem('user_data', JSON.stringify(u));
    return data;
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await AuthService.signup(payload);
    tokenStore.set(data.accessToken, data.refreshToken);
    const u = data.user || data;
    setUser(u); setIsLoggedIn(true);
    localStorage.setItem('user_data', JSON.stringify(u));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await AuthService.logout(tokenStore.refresh); } catch { /* ignore */ }
    tokenStore.clear();
    ['user_data', 'user_access_token', 'user_refresh_token'].forEach(k => localStorage.removeItem(k));
    setUser(null); setIsLoggedIn(false);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user_data', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useUserAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useUserAuth must be inside UserAuthProvider');
  return ctx;
};
export default AuthContext;
