import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ShoppingBag, Clock, User, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const { activeTab, setActiveTab, cartItemCount, t, orders } = useApp();

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const tabs = [
    { id: 'catalog', label: t.navCatalog, icon: Compass },
    { id: 'tracking', label: t.navTrack, icon: Clock, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'cart', label: t.navCart, icon: ShoppingBag, badge: cartItemCount > 0 ? cartItemCount : null },
    { id: 'orders', label: t.navOrders, icon: User },
    { id: 'admin', label: 'Admin', icon: SlidersHorizontal }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-subtle)',
              position: 'relative',
              padding: '6px 0',
              transition: 'color 0.15s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {tab.badge !== null && tab.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-10px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? '700' : '500',
                marginTop: '4px'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
