'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore } from '../lib/api';
import { AuthService, AdminService } from '../lib/services/admin.service';

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin,      setAdmin]      = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('admin_user');
        const token  = tokenStore.access;
        if (token && stored) {
          setAdmin(JSON.parse(stored));
          setIsLoggedIn(true);
          try {
            const data = await AdminService.getProfile();
            const adminData = data.admin || data;
            setAdmin(adminData);
            localStorage.setItem('admin_user', JSON.stringify(adminData));
          } catch { /* background refresh failed — keep stored data */ }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await AuthService.login(email, password);
    tokenStore.set(data.accessToken, data.refreshToken);
    const adminData = data.admin || data;
    setAdmin(adminData);
    setIsLoggedIn(true);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await AuthService.logout(tokenStore.refresh); } catch { /* ignore */ }
    // Clear tokens + cookie
    tokenStore.clear();
    // Explicitly remove every known admin key
    ['admin_user', 'admin_access_token', 'admin_refresh_token'].forEach(k => localStorage.removeItem(k));
    setAdmin(null);
    setIsLoggedIn(false);
  }, []);

  const updateAdmin = useCallback((data) => {
    setAdmin(data);
    localStorage.setItem('admin_user', JSON.stringify(data));
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isLoggedIn, isLoading, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
};

export default AuthContext;
