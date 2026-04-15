import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { BASE_URL, TokenStore } from './api';

WebBrowser.maybeCompleteAuthSession();

const AuthService = {
  async loginEmail(email, password) {
    const res = await fetch(`${BASE_URL}/auth/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Login failed');
    await TokenStore.setTokens(data.accessToken, data.refreshToken, 'user');
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  },

  async loginMobile(phone, otp) {
    const formatted = phone.startsWith('+') ? phone : `+971${phone.replace(/^0/, '')}`;
    const res = await fetch(`${BASE_URL}/auth/phone/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formatted, otp }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'OTP verification failed');
    await TokenStore.setTokens(data.accessToken, data.refreshToken, 'user');
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  },

  async sendOtp(phone) {
    const formatted = phone.startsWith('+') ? phone : `+971${phone.replace(/^0/, '')}`;
    const res = await fetch(`${BASE_URL}/auth/phone/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formatted }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to send OTP');
    return data;
  },

  /**
   * UAE Pass login — Feature #11
   * Opens UAE Pass in a browser, waits for the deep-link callback,
   * and exchanges the code for a JWT pair.
   *
   * Requires in app.json:
   *   "scheme": "honeymoon"
   *   expo-linking configured so honeymoon://auth/callback is handled.
   */
  async loginUAEPass() {
    try {
      /* Get the auth URL from API */
      const initRes = await fetch(`${BASE_URL}/auth/uae-pass/init?role=user&mobile=1`);
      const initData = await initRes.json();
      if (!initData.authorizationUrl) throw new Error('Could not get UAE Pass URL');

      /* The deep-link that UAE Pass will redirect to */
      const redirectUri = Linking.createURL('auth/callback');

      /* Open in system browser (not in-app — UAE Pass requires full browser) */
      const result = await WebBrowser.openAuthSessionAsync(
        initData.authorizationUrl,
        redirectUri
      );

      if (result.type !== 'success' || !result.url) {
        throw new Error('UAE Pass login cancelled or failed');
      }

      /* Parse code and state from the redirect URL */
      const parsed = Linking.parse(result.url);
      const code   = parsed.queryParams?.code;
      const state  = parsed.queryParams?.state;

      if (!code) throw new Error('No authorisation code received from UAE Pass');

      /* Exchange code for JWT tokens via API */
      const callbackRes = await fetch(
        `${BASE_URL}/auth/uae-pass/callback?code=${code}&state=${state}&mobile=1`
      );
      const data = await callbackRes.json();
      if (!data.success) throw new Error(data.message || 'UAE Pass exchange failed');

      await TokenStore.setTokens(data.accessToken, data.refreshToken, data.role || 'user');
      await AsyncStorage.setItem('userData', JSON.stringify(data.user || data.vendor));
      return data;
    } catch (e) {
      console.error('[Auth] UAE Pass error:', e.message);
      throw e;
    }
  },

  async logout() {
    const refreshToken = await TokenStore.getRefresh();
    if (refreshToken) {
      fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    await TokenStore.clear();
  },

  async isLoggedIn() {
    const token = await TokenStore.getAccess();
    return !!token;
  },

  async getCachedUser() {
    const raw = await AsyncStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  },
};

export default AuthService;
