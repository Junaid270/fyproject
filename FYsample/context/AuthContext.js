import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.202:3000';

  const fetchApi = async (endpoint, options = {}) => {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'include',
      ...options,
    });
    return response;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchApi('/auth/profile', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      }
      const error = await response.json();
      return { success: false, message: error.message || 'Login failed.' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Login failed.' };
    }
  };

  const register = async (credentials) => {
    try {
      const response = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true };
      }
      const error = await response.json();
      return { success: false, message: error.message || 'Registration failed.' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'Registration failed.' };
    }
  };

  const logout = async () => {
    try {
      const response = await fetchApi('/auth/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
      }
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
 