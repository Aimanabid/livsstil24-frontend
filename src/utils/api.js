import axios from 'axios';
import mockApi from '../mock/api.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

if (USE_MOCK) {
  console.info('%c[Mock API] Running with mock data — backend not required', 'color:#C9A96E;font-weight:bold');
}

const realApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

realApi.interceptors.response.use(
  res => res,
  err => {
    if (
      err.response?.status === 401 &&
      window.location.pathname.startsWith('/admin') &&
      window.location.pathname !== '/admin/login'
    ) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default USE_MOCK ? mockApi : realApi;
