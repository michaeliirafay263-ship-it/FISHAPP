import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StockPriceEditor } from './StockPriceEditor';
import { OrderManagement } from './OrderManagement';
import { SalesAnalytics } from './SalesAnalytics';
import {
  SlidersHorizontal,
  DollarSign,
  Package,
  TrendingUp,
  Fish,
  Bike,
  ShieldCheck
} from 'lucide-react';

export function AdminDashboard() {
  const { t, language, orders } = useApp();
  const [adminTab, setAdminTab] = useState('stock'); // 'stock' | 'orders' | 'analytics'

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-navy)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SlidersHorizontal size={18} />
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              {t.adminTitle}
            </h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            {language === 'sw'
              ? 'Udhibiti wa bei za kila siku, kugawa oda kwa boda riders na ripoti ya biashara.'
              : 'Daily pricing control, real-time stock allocation & rider dispatch.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--color-surface-hover)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setAdminTab('stock')}
            className={adminTab === 'stock' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{
              backgroundColor: adminTab === 'stock' ? 'var(--color-navy)' : 'transparent',
              borderColor: 'transparent',
              color: adminTab === 'stock' ? '#ffffff' : 'var(--color-text-main)'
            }}
          >
            <Fish size={14} />
            <span>{language === 'sw' ? 'Bei & Samaki' : 'Stock & Prices'}</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={adminTab === 'orders' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{
              backgroundColor: adminTab === 'orders' ? 'var(--color-navy)' : 'transparent',
              borderColor: 'transparent',
              color: adminTab === 'orders' ? '#ffffff' : 'var(--color-text-main)'
            }}
          >
            <Package size={14} />
            <span>{language === 'sw' ? 'Oda Zote' : 'Orders'}</span>
            {activeOrdersCount > 0 && (
              <span className="badge badge-primary" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('analytics')}
            className={adminTab === 'analytics' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{
              backgroundColor: adminTab === 'analytics' ? 'var(--color-navy)' : 'transparent',
              borderColor: 'transparent',
              color: adminTab === 'analytics' ? '#ffffff' : 'var(--color-text-main)'
            }}
          >
            <TrendingUp size={14} />
            <span>{language === 'sw' ? 'Mauzo' : 'Analytics'}</span>
          </button>
        </div>
      </div>

      {/* Admin Tab View */}
      {adminTab === 'stock' && <StockPriceEditor />}
      {adminTab === 'orders' && <OrderManagement />}
      {adminTab === 'analytics' && <SalesAnalytics />}
    </div>
  );
}
