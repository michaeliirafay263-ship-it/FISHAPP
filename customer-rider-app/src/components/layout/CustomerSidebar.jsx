import React from 'react';
import { useCustomerApp } from '../../context/CustomerAppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Fish,
  ShoppingBag,
  Clock,
  Compass,
  User,
  Globe,
  MapPin,
  LogOut
} from 'lucide-react';
import { formatTZS } from '../../utils/formatters';

export function CustomerSidebar() {
  const {
    activeCustomerTab,
    setActiveCustomerTab,
    cartItemCount,
    cartSubtotal,
    language,
    setLanguage,
    t,
    orders
  } = useCustomerApp();

  const { user, logout } = useAuth();

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const navItems = [
    { id: 'market', label: t.navCatalog, icon: Compass },
    { id: 'tracking', label: t.navTrack, icon: Clock, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'cart', label: t.navCart, icon: ShoppingBag, badge: cartItemCount > 0 ? cartItemCount : null },
    { id: 'orders', label: t.navOrders, icon: Fish },
    { id: 'profile', label: t.navProfile, icon: User }
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

      {/* Main Navigation (Customer Only) */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '16px' }}>
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
            {language === 'sw' ? 'Menyu ya Mteja' : 'Customer Menu'}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeCustomerTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCustomerTab(item.id)}
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
      </div>

      {/* Cart Summary Widget */}
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
            onClick={() => setActiveCustomerTab('cart')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
          >
            <ShoppingBag size={14} />
            <span>{t.checkout}</span>
          </button>
        </div>
      )}

      {/* Customer User Info & Logout */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--color-navy-border)',
          backgroundColor: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem',
              flexShrink: 0
            }}
          >
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Customer'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              {user?.phone || '0754 443 219'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout"
          style={{
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            color: '#94a3b8',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Language Switch */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-navy-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={15} color="#94a3b8" />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {language === 'sw' ? 'Lugha' : 'Language'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setLanguage('en')}
            style={{
              padding: '3px 8px',
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
              padding: '3px 8px',
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
