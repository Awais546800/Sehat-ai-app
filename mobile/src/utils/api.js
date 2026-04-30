import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ CHANGE THIS IP to your laptop IP (run ipconfig in cmd)
export const BASE_URL = 'http://192.168.100.28:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto attach token
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
}, err => Promise.reject(err));

// Auto refresh token on expiry
api.interceptors.response.use(r => r, async (error) => {
  const orig = error.config;
  if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !orig._retry) {
    orig._retry = true;
    try {
      const rt = await AsyncStorage.getItem('refreshToken');
      const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken: rt });
      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
      orig.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(orig);
    } catch {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    }
  }
  return Promise.reject(error);
});

export default api;
