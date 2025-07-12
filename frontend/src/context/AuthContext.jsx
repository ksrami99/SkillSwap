import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Auto-check login on first load
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('/auth/me',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkLogin();
  }, []);

  const logout = async () => {
    await axios.post('/auth/logout', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loadingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
