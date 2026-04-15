import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [isLoading,   setIsLoading]   = useState(true); // checking stored token on boot

  // ── Boot: check for stored token ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const cached = await AuthService.getCachedUser();
        const loggedIn = await AuthService.isLoggedIn();
        if (loggedIn && cached) {
          setUser(cached);
          setIsLoggedIn(true);
          // Refresh profile from API in background
          try {
            const fresh = await UserService.getProfile();
            setUser(fresh.user);
            await AsyncStorage.setItem('userData', JSON.stringify(fresh.user));
          } catch {}
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Login helpers ─────────────────────────────────────────────────────────

  /* Register push notification token after login */
  const registerPushToken = async () => {
    try {
      const { getExpoPushTokenAsync, requestPermissionsAsync } = await import('expo-notifications');
      const { status } = await requestPermissionsAsync();
      if (status !== 'granted') return;
      const { data: token } = await getExpoPushTokenAsync({ projectId: process.env.EXPO_PUBLIC_PROJECT_ID });
      const { Platform } = await import('react-native');
      await fetch(`${require('../services/api').BASE_URL}/push/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await require('../services/api').TokenStore.getAccess()}` },
        body: JSON.stringify({ token, platform: Platform.OS }),
      });
    } catch (e) { /* push is optional */ }
  };

  const loginEmail = useCallback(async (email, password) => {
    const data = await AuthService.loginEmail(email, password);
    setUser(data.user);
    setIsLoggedIn(true);
    registerPushToken().catch(() => {});
    return data;
  }, []);

  const loginUAEPass = useCallback(async () => {
    const data = await AuthService.loginUAEPass();
    setUser(data.user);
    setIsLoggedIn(true);
    return data;
  }, []);

  const loginMobile = useCallback(async (phone, otp) => {
    const data = await AuthService.loginMobile(phone, otp);
    setUser(data.user);
    setIsLoggedIn(true);
    return data;
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await AuthService.signup(payload);
    setUser(data.user);
    setIsLoggedIn(true);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      AsyncStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isLoading,
      loginEmail, loginUAEPass, loginMobile,
      signup, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
