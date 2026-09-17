import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCustomerApp } from '../../context/CustomerAppContext';
import {
  Bike,
  Package,
  Clock,
  History,
  User,
  ShieldCheck,
  LogOut,
  MapPin,
  Star
} from 'lucide-react';

export function RiderSidebar() {
  const { user, logout } = useAuth();
  const { activeRiderTab, setActiveRiderTab, orders } = useCustomerApp();

  const assignedOrders = orders.filter((o) => o.assignedRiderId === user?.id);
  const activeCount = assignedOrders.filter((o) => o.status !== 'delivered').length;

  const navItems = [
    { id: 'dashboard', label: 'Active Deliveries', icon: Bike, badge: activeCount > 0 ? activeCount : null },
    { id: 'history', label: 'Delivery History', icon: History },
    { id: 'profile', label: 'Rider Profile', icon: User }
  ];

  return (
    <aside className="desktop-sidebar" style={{ backgroundColor: '#0f172a' }}>
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
              backgroundColor: 'var(--color-teal)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}
          >
            <Bike size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Samaki Rider
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Boda Fleet Dispatch
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(13, 148, 136, 0.15)',
            border: '1px solid rgba(13, 148, 136, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
            marginTop: '6px'
          }}
        >
          <MapPin size={14} color="#2dd4bf" />
          <span style={{ fontSize: '0.75rem', color: '#ccfbf1', fontWeight: '500' }}>
            Zone: {user?.currentZone || 'Kivukoni Hub'}
          </span>
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
            Rider Operations
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRiderTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveRiderTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--color-teal)' : 'transparent',
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
                        backgroundColor: isActive ? '#ffffff' : 'var(--color-teal)',
                        color: isActive ? 'var(--color-teal-dark)' : '#ffffff',
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

      {/* Rider Info & Logout Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-navy-border)',
          backgroundColor: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-teal)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}
          >
            {user?.name ? user.name.charAt(0) : 'R'}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>
              {user?.name || 'Rider'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#2dd4bf' }}>
              Plate: {user?.bikePlate || 'MC 849 DXA'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out of rider account"
          style={{
            padding: '6px',
            color: '#94a3b8',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
