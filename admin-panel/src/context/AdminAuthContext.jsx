import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredData, setStoredData } from '../utils/storage';
import { useToast } from './ToastContext';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const { addToast } = useToast();

  const [adminAuth, setAdminAuth] = useState(() =>
    getStoredData('samaki_admin_auth', {
      isAuthenticated: false,
      adminUser: null
    })
  );

  useEffect(() => {
    setStoredData('samaki_admin_auth', adminAuth);
  }, [adminAuth]);

  const login = (email, password) => {
    // Valid admin credentials
    if (
      email === 'admin@samakifresh.co.tz' &&
      (password === 'Admin@2026' || password === 'admin123' || password === 'admin')
    ) {
      const user = {
        id: 'admin-1',
        name: 'Michaeli',
        title: 'Operations Director',
        email: 'admin@samakifresh.co.tz',
        role: 'admin',
        hub: 'Kivukoni Fish Market Hub (Dar es Salaam)'
      };

      setAdminAuth({
        isAuthenticated: true,
        adminUser: user
      });

      addToast(`Welcome back, ${user.name}! Admin Portal unlocked.`);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please use admin@samakifresh.co.tz and Admin@2026.'
    };
  };

  const logout = () => {
    setAdminAuth({
      isAuthenticated: false,
      adminUser: null
    });
    addToast('Admin logged out successfully', 'info', 2000);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: adminAuth.isAuthenticated,
        adminUser: adminAuth.adminUser,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
