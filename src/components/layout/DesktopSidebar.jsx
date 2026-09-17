import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Fish,
  ShoppingBag,
  Clock,
  Compass,
  SlidersHorizontal,
  Bike,
  User,
  ShieldCheck,
  Globe,
  MapPin
} from 'lucide-react';
import { formatTZS } from '../../utils/formatters';

export function DesktopSidebar() {
  const {
    activeTab,
    setActiveTab,
    cartItemCount,
    cartSubtotal,
    language,
    setLanguage,
    t,
    orders
  } = useApp();

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const navItems = [
    { id: 'catalog', label: t.navCatalog, icon: Compass },
    { id: 'tracking', label: t.navTrack, icon: Clock, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'orders', label: t.navOrders, icon: Fish },
    { id: 'cart', label: t.navCart, icon: ShoppingBag, badge: cartItemCount > 0 ? cartItemCount : null },
    { id: 'profile', label: t.navProfile, icon: User }
  ];

  const adminNavItems = [
    { id: 'admin', label: t.navAdmin, icon: SlidersHorizontal },
    { id: 'rider', label: t.navRider, icon: Bike }
  ];

  return (
    <aside className="desktop-sidebar">
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--color-navy-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}
          >
            <Fish size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Samaki Fresh
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Kivukoni Market • Dar
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            marginTop: '6px'
          }}
        >
          <MapPin size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', color: '#e0f2fe', fontWeight: '500' }}>
            Direct from Kivukoni Dock
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              padding: '0 12px 8px 12px'
            }}
          >
            {language === 'sw' ? 'Mteja' : 'Customer View'}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? '#ffffff' : '#94a3b8'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: isActive ? '#ffffff' : 'var(--color-primary)',
                        color: isActive ? 'var(--color-primary-dark)' : '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin & Operations Section */}
        <div>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              padding: '0 12px 8px 12px'
            }}
          >
            {language === 'sw' ? 'Usimamizi & Boda' : 'Management & Dispatch'}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--color-navy-surface)' : 'transparent',
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                    border: isActive ? '1px solid var(--color-navy-border)' : '1px solid transparent',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? '#38bdf8' : '#94a3b8'} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Cart Summary Card */}
      {cartItemCount > 0 && (
        <div
          style={{
            margin: '0 12px 12px 12px',
            backgroundColor: 'var(--color-navy-surface)',
            border: '1px solid var(--color-navy-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>
              {formatTZS(cartSubtotal)}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('cart')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
          >
            <ShoppingBag size={14} />
            <span>{t.checkout}</span>
          </button>
        </div>
      )}

      {/* Footer / Language Switch */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-navy-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} color="#94a3b8" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {language === 'sw' ? 'Lugha' : 'Language'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: language === 'en' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
              color: '#ffffff'
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('sw')}
            style={{
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: language === 'sw' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
              color: '#ffffff'
            }}
          >
            SW
          </button>
        </div>
      </div>
    </aside>
  );
}
