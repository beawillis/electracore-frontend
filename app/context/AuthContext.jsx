import React, { createContext, useState, useCallback, useEffect } from 'react'; // Context for managing authentication state and actions across the app
import authService from '../services/authService'; // Service for handling API calls related to authentication
import socketService from '../services/socketService';

export const AuthContext = createContext(); // Create a context for authentication

// AuthProvider component to wrap the app and provide authentication state and actions
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const userData = response.user;

      if (!response.token || !userData) {
        throw new Error('Login response did not include a token and user profile');
      }
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      socketService.connect();
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function to create a new user account
  const register = useCallback(async (email, password, name, role = 'viewer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(email, password, name, role);
      const userData = response.user;

      if (!response.token || !userData) {
        throw new Error('Registration response did not include a token and user profile');
      }
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      socketService.connect();
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
 
  // Logout function to clear user data and token from localStorage
  const logout = useCallback(() => {
    authService.logout();
    socketService.disconnect();
    setUser(null);
    setError(null);
  }, []);

  // Update profile function to allow users to update their profile information
  const updateProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.updateProfile(data);
      const updatedUser = { ...user, ...response };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
