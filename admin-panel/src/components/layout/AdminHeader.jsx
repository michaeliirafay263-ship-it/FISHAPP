import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { formatTZS } from '../../utils/formatters';
import { Anchor, ShieldCheck, DollarSign, Clock, Bell, LogOut } from 'lucide-react';

export function AdminHeader() {
  const { adminUser, logout } = useAdminAuth();
  const { totalRevenue, activeOrdersCount, orders } = useAdminData();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        gap: '16px'
      }}
    >
      {/* Kivukoni Market Live Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}
        >
          <Anchor size={15} color="var(--color-primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)' }}>
            Kivukoni Fish Market Landing: Open (05:30 - 18:00)
          </span>
        </div>
      </div>

      {/* Right Stats & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Total Revenue pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-primary-light)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', fontWeight: '600' }}>
            Daily Revenue:
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
            {formatTZS(totalRevenue)}
          </span>
        </div>

        {/* Active Orders Count pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontWeight: '600' }}>
            Active Dispatches:
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {activeOrdersCount}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 12px' }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
