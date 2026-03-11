import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ucabUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('ucabUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const driverLogin = async (email, password) => {
    const { data } = await API.post('/auth/driver/login', { email, password });
    localStorage.setItem('ucabUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('ucabUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const driverRegister = async (formData) => {
    const { data } = await API.post('/auth/driver/register', formData);
    localStorage.setItem('ucabUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ucabUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, driverLogin, register, driverRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
