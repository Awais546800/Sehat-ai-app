import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

const useStore = create((set, get) => ({
  // Auth
  user: null, accessToken: null, refreshToken: null,
  isLoading: true, isLoggedIn: false,
  // App
  language: 'en', isOnboarded: false,
  // Subscription
  isPremium: false, usageStats: null,

  initApp: async () => {
    try {
      const [token, refresh, onboarded, lang] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
        AsyncStorage.getItem('isOnboarded'),
        AsyncStorage.getItem('language'),
      ]);
      if (lang) set({ language: lang });
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await api.get('/users/me');
          set({
            user: res.data.user,
            accessToken: token,
            refreshToken: refresh,
            isLoggedIn: true,
            language: res.data.user.language || lang || 'en',
            isPremium: res.data.user.isPremium || false,
            usageStats: res.data.usageStats || null,
          });
        } catch {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
          set({ isLoggedIn: false });
        }
      }
      set({ isLoading: false, isOnboarded: onboarded === 'true' });
    } catch { set({ isLoading: false }); }
  },

  login: async (accessToken, refreshToken, user) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ user, accessToken, refreshToken, isLoggedIn: true, language: user.language || 'en', isPremium: user.isPremium || false });
  },

  logout: async () => {
    try { const { user } = get(); if (user) await api.post('/auth/logout', { userId: user._id }); } catch {}
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false, isPremium: false });
  },

  updateUser: (updates) => set(s => ({ user: { ...s.user, ...updates }, isPremium: updates.isPremium ?? s.isPremium })),

  setLanguage: async (lang) => {
    set({ language: lang });
    await AsyncStorage.setItem('language', lang);
    try { await api.put('/users/language', { language: lang }); } catch {}
  },

  setOnboarded: async () => {
    await AsyncStorage.setItem('isOnboarded', 'true');
    set({ isOnboarded: true });
  },

  refreshUsage: async () => {
    try {
      const res = await api.get('/users/me');
      set({ usageStats: res.data.usageStats, isPremium: res.data.user.isPremium || false });
    } catch {}
  },

  pendingUserId: null,
  setPendingUserId: (id) => set({ pendingUserId: id }),
}));

export default useStore;
