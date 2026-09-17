import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import {
  LayoutDashboard,
  Fish,
  ShoppingBag,
  Bike,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ShieldCheck,
  Anchor,
  DollarSign
} from 'lucide-react';

export function AdminSidebar() {
  const { adminUser, logout } = useAdminAuth();
  const { activeAdminRoute, setActiveAdminRoute, activeOrdersCount, orders } = useAdminData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'stock', label: 'Stock & Daily Prices', icon: Fish },
    { id: 'orders', label: 'Orders Pipeline', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'riders', label: 'Riders & Dispatch', icon: Bike },
    { id: 'customers', label: 'Customer Accounts', icon: Users },
    { id: 'analytics', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Market Settings', icon: Settings }
  ];

  return (
    <aside className="desktop-sidebar" style={{ width: '270px', backgroundColor: '#0f172a' }}>
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
              Samaki Admin
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}>
              Kivukoni Logistics Center
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
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
            Management
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeAdminRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminRoute(item.id)}
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

      {/* Admin User Badge & Logout */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-navy-border)',
          backgroundColor: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.9rem',
              flexShrink: 0
            }}
          >
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {adminUser?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {adminUser?.email || 'admin@samakifresh.co.tz'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out of Admin Portal"
          style={{
            padding: '6px',
            color: '#94a3b8',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
