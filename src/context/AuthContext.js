import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored credentials on mount
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const creds = await AsyncStorage.getItem('ta_credentials');
      if (creds) {
        setUser(JSON.parse(creds));
      }
    } catch (err) {
      console.error('Failed to load stored user:', err);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    try {
      // Store credentials
      const userData = { username, password };
      await AsyncStorage.setItem('ta_credentials', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem('ta_credentials');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 