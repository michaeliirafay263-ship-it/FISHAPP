import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_FISH_CATALOG } from '../data/fishCatalog';
import { INITIAL_ORDERS, RIDERS } from '../data/initialOrders';
import { DAR_WARDS, COLD_CHAIN_FEE } from '../data/wards';
import { translations } from '../data/translations';
import { getStoredData, setStoredData } from '../utils/storage';
import { useToast } from './ToastContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { addToast } = useToast();

  // Language: 'en' | 'sw'
  const [language, setLanguageState] = useState(() => getStoredData('language', 'en'));

  // Active View Tab: 'catalog' | 'orders' | 'tracking' | 'admin' | 'rider' | 'profile'
  const [activeTab, setActiveTab] = useState('catalog');

  // Currently tracked order ID
  const [trackingOrderId, setTrackingOrderId] = useState(() => {
    const stored = getStoredData('orders', INITIAL_ORDERS);
    const active = stored.find((o) => o.status !== 'delivered');
    return active ? active.id : stored[0]?.id || null;
  });

  // Fish Catalog (editable by admin)
  const [fishCatalog, setFishCatalog] = useState(() => getStoredData('fish_catalog', INITIAL_FISH_CATALOG));

  // Cart: Array of { id, fishId, name, swahiliName, image, pricePerKg, weightKg, cleaningOption, cleaningExtra, totalPrice }
  const [cart, setCart] = useState(() => getStoredData('cart', []));

  // Orders
  const [orders, setOrders] = useState(() => getStoredData('orders', INITIAL_ORDERS));

  // Riders
  const [riders, setRiders] = useState(() => getStoredData('riders', RIDERS));

  // Cold chain packaging option (selected by default)
  const [coldChainPackaging, setColdChainPackaging] = useState(true);

  // Search & category filters for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // User profile
  const [currentUser, setCurrentUser] = useState(() =>
    getStoredData('current_user', {
      name: 'Amina Salum',
      phone: '0754 443 219',
      ward: 'Mikocheni A & B',
      address: 'Mikocheni B, Near Rose Garden, House 42B',
      userType: 'Household',
      isLoggedIn: true
    })
  );

  // Sync to storage
  useEffect(() => {
    setStoredData('language', language);
  }, [language]);

  useEffect(() => {
    setStoredData('fish_catalog', fishCatalog);
  }, [fishCatalog]);

  useEffect(() => {
    setStoredData('cart', cart);
  }, [cart]);

  useEffect(() => {
    setStoredData('orders', orders);
  }, [orders]);

  useEffect(() => {
    setStoredData('riders', riders);
  }, [riders]);

  useEffect(() => {
    setStoredData('current_user', currentUser);
  }, [currentUser]);

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

  // Order Placement
  const placeNewOrder = (orderPayload) => {
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newOrderId,
      customerName: orderPayload.customerName || currentUser.name,
      customerPhone: orderPayload.customerPhone || currentUser.phone,
      customerType: orderPayload.customerType || currentUser.userType,
      items: cart.map((c) => ({
        id: c.fishId,
        name: c.name,
        pricePerKg: c.pricePerKg,
        weightKg: c.weightKg,
        cleaningOption: c.cleaningOption,
        totalPrice: c.totalPrice
      })),
      itemsSubtotal: cartSubtotal,
      coldChainFee: coldChainPackaging ? COLD_CHAIN_FEE : 0,
      deliveryFee: orderPayload.deliveryFee || 3500,
      grandTotal: cartSubtotal + (coldChainPackaging ? COLD_CHAIN_FEE : 0) + (orderPayload.deliveryFee || 3500),
      ward: orderPayload.ward,
      exactAddress: orderPayload.exactAddress,
      deliveryTimeSlot: orderPayload.deliveryTimeSlot,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod.includes('Cash') ? 'PENDING_COD' : 'PAID',
      paymentRef: `${orderPayload.paymentMethod.split(' ')[0].toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'received',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'received',
          time: currentTimeStr,
          label: language === 'sw' ? 'Oda imepokelewa na malipo yamethibitishwa' : 'Order received and confirmed'
        }
      ],
      assignedRiderId: null,
      riderNotes: orderPayload.notes || '',
      freshnessRating: null
    };

    // Deduct stock
    setFishCatalog((prev) =>
      prev.map((fish) => {
        const ordered = cart.find((c) => c.fishId === fish.id);
        if (ordered) {
          const remainingStock = Math.max(0, fish.stockKg - ordered.weightKg);
          return {
            ...fish,
            stockKg: remainingStock,
            inStock: remainingStock > 0
          };
        }
        return fish;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newOrderId);
    setActiveTab('tracking');

    addToast(
      language === 'sw'
        ? `Oda ${newOrderId} imekamilika! Inaandaliwa sasa.`
        : `Order ${newOrderId} placed successfully! Preparing your catch.`
    );

    return newOrder;
  };

  // Reorder
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

    setActiveTab('cart');
    addToast(language === 'sw' ? 'Vitu vya oda vimerudishwa kikapuni' : 'Items added back to cart for reorder');
  };

  // Admin Actions
  const updateDailyFish = (fishId, updates) => {
    setFishCatalog((prev) =>
      prev.map((fish) => {
        if (fish.id === fishId) {
          return { ...fish, ...updates };
        }
        return fish;
      })
    );
    addToast(language === 'sw' ? 'Taarifa za samaki zimehifadhiwa' : 'Fish inventory and price updated');
  };

  const addNewFish = (newFishData) => {
    const newId = `fish-${Date.now()}`;
    const fishItem = {
      id: newId,
      ...newFishData,
      inStock: newFishData.stockKg > 0,
      cleaningOptions: newFishData.cleaningOptions || [
        { id: 'whole', label: 'Whole Fish', extraCost: 0 },
        { id: 'gutted', label: 'Descaled & Gutted', extraCost: 0, recommended: true }
      ]
    };
    setFishCatalog((prev) => [fishItem, ...prev]);
    addToast(language === 'sw' ? 'Aina mpya ya samaki imeongezwa sokoni' : 'New fish added to market catalog');
  };

  const updateOrderStatus = (orderId, nextStatus, riderId = null, note = '') => {
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let label = '';
    if (nextStatus === 'sourced') {
      label = language === 'sw' ? 'Imethibitishwa na kukaguliwa soko la Kivukoni' : 'Sourced & quality checked at Kivukoni Market';
    } else if (nextStatus === 'packed') {
      label = language === 'sw' ? 'Imesafishwa na kufungwa kwenye mfuko wa barafu' : 'Cleaned & sealed in insulated ice pack bag';
    } else if (nextStatus === 'out_for_delivery') {
      label = language === 'sw' ? 'Mlangoni ipo njiani na Boda Rider' : 'Out for delivery with boda rider';
    } else if (nextStatus === 'delivered') {
      label = language === 'sw' ? 'Imefikishwa mlangoni kikamilifu' : 'Delivered to client doorstep';
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedHistory = [...order.statusHistory, { status: nextStatus, time: currentTimeStr, label }];
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

    addToast(
      language === 'sw'
        ? `Hali ya oda ${orderId} imebadilishwa kuwa: ${nextStatus}`
        : `Order ${orderId} updated to: ${nextStatus}`
    );
  };

  const assignRider = (orderId, riderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, assignedRiderId: riderId };
        }
        return order;
      })
    );

    const rider = riders.find((r) => r.id === riderId);
    addToast(
      language === 'sw'
        ? `Oda ${orderId} amepewa rider ${rider?.name || ''}`
        : `Order ${orderId} assigned to rider ${rider?.name || ''}`
    );
  };

  const rateOrder = (orderId, rating, feedback) => {
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

  const updateUserProfile = (userData) => {
    setCurrentUser((prev) => ({ ...prev, ...userData }));
    addToast(language === 'sw' ? 'Taarifa za akaunti zimehifadhiwa' : 'Profile updated successfully');
  };

  const value = {
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
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
    currentUser,
    updateUserProfile,
    addToCart,
    updateCartItemWeight,
    removeFromCart,
    clearCart,
    placeNewOrder,
    reorder,
    updateDailyFish,
    addNewFish,
    updateOrderStatus,
    assignRider,
    rateOrder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
