import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_FISH_CATALOG } from '../data/fishCatalog';
import { INITIAL_ORDERS, RIDERS } from '../data/initialOrders';
import { DAR_WARDS, COLD_CHAIN_FEE } from '../data/wards';
import { translations } from '../data/translations';
import { getStoredData, setStoredData } from '../utils/storage';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import {
  fetchLiveFishCatalog,
  createOrderRPC,
  getGuestOrderTrackingRPC,
  submitOrderRatingRPC,
  riderUpdateOrderStatusRPC,
  subscribeToOrderRealtime
} from '../services/orderService';

const CustomerAppContext = createContext(null);

export function CustomerAppProvider({ children }) {
  const { addToast } = useToast();
  const { user, role } = useAuth();

  // Language: 'en' | 'sw'
  const [language, setLanguageState] = useState(() => getStoredData('language', 'en'));

  // Navigation tab for Customer: 'market' | 'cart' | 'tracking' | 'orders' | 'profile'
  const [activeCustomerTab, setActiveCustomerTab] = useState('market');

  // Navigation tab for Rider: 'dashboard' | 'deliveries' | 'history' | 'profile'
  const [activeRiderTab, setActiveRiderTab] = useState('dashboard');

  // Currently tracked order ID
  const [trackingOrderId, setTrackingOrderId] = useState(() => {
    const stored = getStoredData('orders', INITIAL_ORDERS);
    const active = stored.find((o) => o.status !== 'delivered');
    return active ? active.id : stored[0]?.id || null;
  });

  // Fish Catalog (Synced with Supabase)
  const [fishCatalog, setFishCatalog] = useState(() => getStoredData('fish_catalog', INITIAL_FISH_CATALOG));

  // Cart
  const [cart, setCart] = useState(() => getStoredData('cart', []));

  // Orders
  const [orders, setOrders] = useState(() => getStoredData('orders', INITIAL_ORDERS));

  // Riders
  const [riders, setRiders] = useState(() => getStoredData('riders', RIDERS));

  // Cold chain option
  const [coldChainPackaging, setColdChainPackaging] = useState(true);

  // Search & category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch live fish catalog from Supabase on mount
  useEffect(() => {
    async function loadCatalog() {
      const res = await fetchLiveFishCatalog();
      if (res.success && res.data && res.data.length > 0) {
        setFishCatalog(res.data);
      }
    }
    loadCatalog();
  }, []);

  // Sync to storage
  useEffect(() => {
    setStoredData('language', language);
  }, [language]);

  useEffect(() => {
    setStoredData('cart', cart);
  }, [cart]);

  useEffect(() => {
    setStoredData('orders', orders);
  }, [orders]);

  useEffect(() => {
    setStoredData('fish_catalog', fishCatalog);
  }, [fishCatalog]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    addToast(lang === 'sw' ? 'Lugha imebadilishwa kuwa Kiswahili' : 'Language switched to English', 'info', 2000);
  };

  const t = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const cartTotalWeight = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.weightKg, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.length;
  }, [cart]);

  // Cart Actions
  const addToCart = (fish, weightKg, cleaningOption, cleaningExtra = 0) => {
    const itemPrice = fish.pricePerKg * weightKg + cleaningExtra;
    const cartItemId = `${fish.id}-${cleaningOption}-${Date.now()}`;

    const newItem = {
      cartItemId,
      fishId: fish.id,
      name: fish.name,
      swahiliName: fish.swahiliName,
      image: fish.image,
      pricePerKg: fish.pricePerKg,
      weightKg,
      cleaningOption,
      cleaningExtra,
      totalPrice: itemPrice,
      unit: fish.unit || 'kg'
    };

    setCart((prev) => [...prev, newItem]);
    addToast(
      language === 'sw'
        ? `${fish.swahiliName} (${weightKg} kg) imeongezwa kwenye kikapu`
        : `${fish.name} (${weightKg} kg) added to cart`
    );
  };

  const updateCartItemWeight = (cartItemId, newWeightKg) => {
    if (newWeightKg <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newTotal = item.pricePerKg * newWeightKg + item.cleaningExtra;
          return { ...item, weightKg: newWeightKg, totalPrice: newTotal };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast(language === 'sw' ? 'Samaki ameondolewa kikapuni' : 'Item removed from cart', 'info', 2000);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Authoritative Order Placement
  const placeNewOrder = async (orderPayload) => {
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Try Supabase create_order RPC
    const rpcRes = await createOrderRPC({
      customerName: orderPayload.customerName || user?.name || 'Amina Salum',
      customerPhone: orderPayload.customerPhone || user?.phone || '0754 443 219',
      customerType: orderPayload.customerType || user?.userType || 'Household',
      wardId: orderPayload.wardId || 'mikocheni',
      exactAddress: orderPayload.exactAddress,
      deliveryTimeSlot: orderPayload.deliveryTimeSlot,
      paymentMethod: orderPayload.paymentMethod,
      coldChainPackaging,
      cart,
      notes: orderPayload.notes || ''
    });

    let newOrderId = rpcRes.success ? rpcRes.data.orderId : `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    let guestToken = rpcRes.success ? rpcRes.data.guestToken : null;

    if (guestToken) {
      setStoredData(`samaki_guest_token_${newOrderId}`, guestToken);
    }

    const newOrder = {
      id: newOrderId,
      guestToken,
      customerName: orderPayload.customerName || user?.name || 'Amina Salum',
      customerPhone: orderPayload.customerPhone || user?.phone || '0754 443 219',
      customerType: orderPayload.customerType || user?.userType || 'Household',
      items: cart.map((c) => ({
        id: c.fishId,
        name: c.name,
        pricePerKg: c.pricePerKg,
        weightKg: c.weightKg,
        cleaningOption: c.cleaningOption,
        totalPrice: c.totalPrice
      })),
      itemsSubtotal: rpcRes.success ? rpcRes.data.itemsSubtotal : cartSubtotal,
      coldChainFee: rpcRes.success ? rpcRes.data.coldChainFee : (coldChainPackaging ? COLD_CHAIN_FEE : 0),
      deliveryFee: rpcRes.success ? rpcRes.data.deliveryFee : (orderPayload.deliveryFee || 3500),
      grandTotal: rpcRes.success ? rpcRes.data.grandTotal : (cartSubtotal + (coldChainPackaging ? COLD_CHAIN_FEE : 0) + (orderPayload.deliveryFee || 3500)),
      ward: orderPayload.ward,
      wardId: orderPayload.wardId,
      exactAddress: orderPayload.exactAddress,
      deliveryTimeSlot: orderPayload.deliveryTimeSlot,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: rpcRes.success ? rpcRes.data.paymentStatus : (orderPayload.paymentMethod?.includes('Cash') ? 'PENDING_COD' : 'PENDING'),
      paymentRef: `${(orderPayload.paymentMethod || 'MPESA').split(' ')[0].toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'received',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'received',
          time: currentTimeStr,
          label: language === 'sw' ? 'Oda imepokelewa na kuandaliwa' : 'Order received and confirmed'
        }
      ],
      assignedRiderId: 'rider-1',
      riderNotes: orderPayload.notes || '',
      freshnessRating: null
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newOrderId);
    setActiveCustomerTab('tracking');

    addToast(
      language === 'sw'
        ? `Oda ${newOrderId} imekamilika! Inaandaliwa sasa.`
        : `Order ${newOrderId} placed successfully! Preparing your catch.`
    );

    return newOrder;
  };

  const reorder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      const fish = fishCatalog.find((f) => f.id === item.id) || {
        id: item.id,
        name: item.name,
        swahiliName: item.name,
        pricePerKg: item.pricePerKg,
        image: 'https://images.unsplash.com/photo-1534943441045-1089d75cb355?auto=format&fit=crop&w=800&q=80',
        unit: 'kg'
      };
      addToCart(fish, item.weightKg, item.cleaningOption || 'Descaled & Gutted', 0);
    });

    setActiveCustomerTab('cart');
    addToast(language === 'sw' ? 'Vitu vya oda vimerudishwa kikapuni' : 'Items added back to cart for reorder');
  };

  const rateOrder = async (orderId, rating, feedback) => {
    const guestToken = getStoredData(`samaki_guest_token_${orderId}`, null);
    await submitOrderRatingRPC(orderId, rating, feedback, guestToken);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, freshnessRating: rating, feedbackText: feedback };
        }
        return order;
      })
    );
    addToast(language === 'sw' ? 'Asante kwa kutoa tathmini ya ubichi!' : 'Thank you for rating our freshness quality!');
  };

  // Rider Action: Update status with enforced RPC
  const updateRiderOrderStatus = async (orderId, nextStatus, note = '') => {
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let label = '';
    if (nextStatus === 'out_for_delivery') {
      label = language === 'sw' ? 'Nipo njiani na Boda Rider' : 'Out for delivery with boda rider';
    } else if (nextStatus === 'delivered') {
      label = language === 'sw' ? 'Imekabidhiwa mlangoni kwa mteja' : 'Delivered to client doorstep';
    }

    await riderUpdateOrderStatusRPC(orderId, nextStatus, note);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedHistory = [...order.statusHistory, { status: nextStatus, time: currentTimeStr, label }];
          return {
            ...order,
            status: nextStatus,
            statusHistory: updatedHistory,
            riderNotes: note || order.riderNotes
          };
        }
        return order;
      })
    );

    addToast(
      language === 'sw'
        ? `Oda ${orderId} imesasishwa kuwa: ${nextStatus}`
        : `Order ${orderId} updated to: ${nextStatus}`
    );
  };

  const value = {
    language,
    setLanguage,
    t,
    activeCustomerTab,
    setActiveCustomerTab,
    activeRiderTab,
    setActiveRiderTab,
    trackingOrderId,
    setTrackingOrderId,
    fishCatalog,
    cart,
    cartSubtotal,
    cartTotalWeight,
    cartItemCount,
    orders,
    riders,
    coldChainPackaging,
    setColdChainPackaging,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    updateCartItemWeight,
    removeFromCart,
    clearCart,
    placeNewOrder,
    reorder,
    rateOrder,
    updateRiderOrderStatus
  };

  return <CustomerAppContext.Provider value={value}>{children}</CustomerAppContext.Provider>;
}

export function useCustomerApp() {
  const context = useContext(CustomerAppContext);
  if (!context) {
    throw new Error('useCustomerApp must be used within CustomerAppProvider');
  }
  return context;
}

export const useApp = useCustomerApp;
