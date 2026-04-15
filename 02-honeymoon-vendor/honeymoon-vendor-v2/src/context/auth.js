'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore } from '../lib/api';
import { AuthService, VendorService } from '../lib/services/vendor.service';

const AuthContext = createContext(null);

export function VendorAuthProvider({ children }) {
  const [vendor,     setVendor]     = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('vendor_user');
        if (tokenStore.access && stored) {
          setVendor(JSON.parse(stored));
          setIsLoggedIn(true);
          try {
            const data = await VendorService.getProfile();
            const v = data.vendor || data;
            setVendor(v);
            localStorage.setItem('vendor_user', JSON.stringify(v));
          } catch { /* keep stored data on bg refresh failure */ }
        }
      } finally { setIsLoading(false); }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await AuthService.login(email, password);
    tokenStore.set(data.accessToken, data.refreshToken);
    const v = data.vendor || data;
    setVendor(v);
    setIsLoggedIn(true);
    localStorage.setItem('vendor_user', JSON.stringify(v));
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await AuthService.logout(tokenStore.refresh); } catch { /* ignore */ }
    tokenStore.clear();
    ['vendor_user', 'vendor_access_token', 'vendor_refresh_token'].forEach(k => localStorage.removeItem(k));
    setVendor(null);
    setIsLoggedIn(false);
  }, []);

  const updateVendor = useCallback((updates) => {
    setVendor(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('vendor_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ vendor, isLoggedIn, isLoading, login, logout, updateVendor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useVendorAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useVendorAuth must be inside VendorAuthProvider');
  return ctx;
};
export default AuthContext;
