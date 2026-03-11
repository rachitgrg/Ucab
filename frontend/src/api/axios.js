import axios from 'axios';

const API = axios.create({
  // Use localhost so the app works on any network (school, home, cafe)
  baseURL: 'http://localhost:5000/api', 
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('ucabUser');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
