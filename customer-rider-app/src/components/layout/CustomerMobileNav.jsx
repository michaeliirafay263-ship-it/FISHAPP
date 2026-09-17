import React from 'react';
import { useCustomerApp } from '../../context/CustomerAppContext';
import { Compass, ShoppingBag, Clock, User, Fish } from 'lucide-react';

export function CustomerMobileNav() {
  const { activeCustomerTab, setActiveCustomerTab, cartItemCount, t, orders } = useCustomerApp();

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const tabs = [
    { id: 'market', label: t.navCatalog, icon: Compass },
    { id: 'tracking', label: t.navTrack, icon: Clock, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'cart', label: t.navCart, icon: ShoppingBag, badge: cartItemCount > 0 ? cartItemCount : null },
    { id: 'orders', label: t.navOrders, icon: Fish },
    { id: 'profile', label: t.navProfile, icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Customer Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCustomerTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveCustomerTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-subtle)',
              position: 'relative',
              padding: '6px 0'
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
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? '700' : '500', marginTop: '4px' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
