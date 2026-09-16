import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = async (email, password) => {
    const response = await api.login({ email, password });
    const authToken = response.access_token;
    const userData = response.user;

    localStorage.setItem('access_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const handleRegister = async (name, email, password, rol) => {
    const response = await api.register({ name, email, password, rol });
    const authToken = response.access_token;
    const userData = response.user;

    localStorage.setItem('access_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await api.logout();
      }
    } catch {
      // Ignorar errores de red en logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.rol === 'admin',
        isCliente: user?.rol === 'cliente',
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
