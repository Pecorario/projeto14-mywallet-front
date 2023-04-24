import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

api.interceptors.request.use(async config => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user !== null) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }

    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export default api;
