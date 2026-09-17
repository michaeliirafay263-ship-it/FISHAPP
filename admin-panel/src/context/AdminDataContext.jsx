import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_FISH_CATALOG } from '../data/fishCatalog';
import { INITIAL_ORDERS, RIDERS } from '../data/initialOrders';
import { DAR_WARDS } from '../data/wards';
import { getStoredData, setStoredData } from '../utils/storage';
import { useToast } from './ToastContext';
import {
  fetchAdminOrders,
  adminUpdateOrderStatus,
  adminAssignRider,
  adminUpdateDailyFish,
  adminAddNewFish,
  subscribeToAdminRealtime
} from '../services/adminService';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const { addToast } = useToast();

  const [activeAdminRoute, setActiveAdminRoute] = useState('dashboard');
  const [fishCatalog, setFishCatalog] = useState(() => getStoredData('fish_catalog', INITIAL_FISH_CATALOG));
  const [orders, setOrders] = useState(() => getStoredData('orders', INITIAL_ORDERS));
  const [riders, setRiders] = useState(() => getStoredData('riders', RIDERS));

  const [customers, setCustomers] = useState(() =>
    getStoredData('customers_list', [
      {
        id: 'cust-1',
        name: 'Amina Salum',
        phone: '0754 443 219',
        userType: 'Household',
        ward: 'Mikocheni A & B',
        address: 'Mikocheni B, Near Rose Garden, House 42B',
        ordersCount: 4,
        totalSpent: 185000,
        joinedDate: '2026-08-12'
      },
      {
        id: 'cust-2',
        name: 'David Mwangi (The Peninsula Bistro)',
        phone: '0784 102 938',
        userType: 'Restaurant',
        ward: 'Masaki (Peninsula)',
        address: 'Toure Drive, Plot 14, Kitchen Back Entrance',
        ordersCount: 12,
        totalSpent: 1640000,
        joinedDate: '2026-07-20'
      },
      {
        id: 'cust-3',
        name: 'Fatma Zahran',
        phone: '0767 991 302',
        userType: 'Household',
        ward: 'Upanga East / West',
        address: 'United Nations Rd, Upanga, Apartment 3B',
        ordersCount: 2,
        totalSpent: 89000,
        joinedDate: '2026-09-01'
      }
    ])
  );

  // Load orders from Supabase on mount
  useEffect(() => {
    async function loadOrders() {
      const res = await fetchAdminOrders();
      if (res.success && res.data && res.data.length > 0) {
        setOrders(res.data);
      }
    }
    loadOrders();

    // Subscribe to Realtime
    const unsubscribe = subscribeToAdminRealtime(
      (newOrder) => {
        setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
        addToast(`New live order received: ${newOrder.id}`, 'info');
      },
      (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o))
        );
      }
    );

    return () => unsubscribe();
  }, [addToast]);

  // Sync to shared storage
  useEffect(() => {
    setStoredData('fish_catalog', fishCatalog);
  }, [fishCatalog]);

  useEffect(() => {
    setStoredData('orders', orders);
  }, [orders]);

  useEffect(() => {
    setStoredData('riders', riders);
  }, [riders]);

  useEffect(() => {
    setStoredData('customers_list', customers);
  }, [customers]);

  // Actions
  const updateDailyFish = async (fishId, updates) => {
    await adminUpdateDailyFish(fishId, updates);

    setFishCatalog((prev) =>
      prev.map((fish) => {
        if (fish.id === fishId) {
          return { ...fish, ...updates };
        }
        return fish;
      })
    );
    addToast('Daily fish stock and market price updated');
  };

  const addNewFish = async (newFishData) => {
    const newId = `fish-${Date.now()}`;
    const fishItem = {
      id: newId,
      ...newFishData,
      inStock: Number(newFishData.stockKg) > 0,
      cleaningOptions: newFishData.cleaningOptions || [
        { id: 'whole', label: 'Whole Fish (Uncut)', extraCost: 0 },
        { id: 'gutted', label: 'Descaled & Gutted', extraCost: 0, recommended: true }
      ]
    };

    await adminAddNewFish(fishItem);

    setFishCatalog((prev) => [fishItem, ...prev]);
    addToast('New fish species listed on Kivukoni catalog');
  };

  const updateOrderStatus = async (orderId, nextStatus, riderId = null, note = '') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let label = `Status changed to ${nextStatus}`;
    if (nextStatus === 'sourced') label = 'Sourced & quality checked at Kivukoni pier';
    if (nextStatus === 'packed') label = 'Packed in thermal ice pouch';
    if (nextStatus === 'out_for_delivery') label = 'Dispatched with Boda Rider';
    if (nextStatus === 'delivered') label = 'Delivered to client doorstep';

    await adminUpdateOrderStatus(orderId, nextStatus, riderId, note);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedHistory = [...order.statusHistory, { status: nextStatus, time: timeStr, label }];
          return {
            ...order,
            status: nextStatus,
            assignedRiderId: riderId !== null ? riderId : order.assignedRiderId,
            riderNotes: note || order.riderNotes,
            statusHistory: updatedHistory
          };
        }
        return order;
      })
    );

    addToast(`Order ${orderId} updated to: ${nextStatus}`);
  };

  const assignRider = async (orderId, riderId) => {
    await adminAssignRider(orderId, riderId);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, assignedRiderId: riderId };
        }
        return order;
      })
    );

    const rider = riders.find((r) => r.id === riderId);
    addToast(`Order ${orderId} assigned to rider ${rider?.name || 'Rider'}`);
  };

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.grandTotal, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status !== 'delivered').length;
  }, [orders]);

  const value = {
    activeAdminRoute,
    setActiveAdminRoute,
    fishCatalog,
    orders,
    riders,
    customers,
    totalRevenue,
    activeOrdersCount,
    updateDailyFish,
    addNewFish,
    updateOrderStatus,
    assignRider
  };

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
}
