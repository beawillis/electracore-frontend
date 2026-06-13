import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to access authentication context and actions across the app
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
