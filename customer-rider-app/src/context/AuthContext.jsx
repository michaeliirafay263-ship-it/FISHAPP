import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredData, setStoredData } from '../utils/storage';
import { useToast } from './ToastContext';
import { RIDERS } from '../data/initialOrders';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { addToast } = useToast();

  const [auth, setAuth] = useState(() =>
    getStoredData('customer_rider_auth', {
      isAuthenticated: false,
      role: null, // 'customer' | 'rider' | null
      user: null
    })
  );

  useEffect(() => {
    setStoredData('customer_rider_auth', auth);
  }, [auth]);

  const loginCustomer = (customerData) => {
    const user = {
      id: customerData.id || `cust-${Date.now()}`,
      name: customerData.name || 'Amina Salum',
      phone: customerData.phone || '0754 443 219',
      ward: customerData.ward || 'Mikocheni A & B',
      address: customerData.address || 'Mikocheni B, Near Rose Garden, House 42B',
      userType: customerData.userType || 'Household',
      role: 'customer'
    };

    setAuth({
      isAuthenticated: true,
      role: 'customer',
      user
    });

    addToast(`Karibu Samaki Fresh, ${user.name}!`);
  };

  const loginRider = (riderIdOrPhone) => {
    const foundRider = RIDERS.find(
      (r) => r.id === riderIdOrPhone || r.phone.replace(/\s+/g, '') === (riderIdOrPhone || '').replace(/\s+/g, '')
    ) || RIDERS[0];

    const user = {
      ...foundRider,
      role: 'rider'
    };

    setAuth({
      isAuthenticated: true,
      role: 'rider',
      user
    });

    addToast(`Rider ${user.name} logged in successfully!`, 'info');
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      role: null,
      user: null
    });
    addToast('Logged out successfully', 'info', 2000);
  };

  const updateUserProfile = (updatedFields) => {
    setAuth((prev) => ({
      ...prev,
      user: { ...prev.user, ...updatedFields }
    }));
    addToast('Profile updated successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: auth.isAuthenticated,
        role: auth.role,
        user: auth.user,
        loginCustomer,
        loginRider,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
