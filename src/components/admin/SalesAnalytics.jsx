import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import {
  TrendingUp,
  ShoppingBag,
  MapPin,
  Award,
  DollarSign,
  Users,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export function SalesAnalytics() {
  const { orders, fishCatalog, language } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100;

  // Aggregate wards
  const wardMap = {};
  orders.forEach((o) => {
    const w = o.ward.split(' ')[0];
    wardMap[w] = (wardMap[w] || 0) + 1;
  });

  // Aggregate popular fish
  const fishSalesMap = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      fishSalesMap[item.name] = (fishSalesMap[item.name] || 0) + item.weightKg;
    });
  });

  const popularFishList = Object.entries(fishSalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          {language === 'sw' ? 'Ripoti ya Mauzo & Uchambuzi' : 'Sales Analytics & Fulfillment Metrics'}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          {language === 'sw' ? 'Mwenendo wa mapato ya samaki na ufanisi wa kufikisha Dar es Salaam.' : 'Performance insights across Dar es Salaam delivery wards.'}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Total Revenue
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {formatTZS(totalRevenue)}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600' }}>
            +18% from last week
          </span>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Total Orders
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {totalOrders}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            {completedOrders} fulfilled successfully
          </span>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Completion Rate
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {completionRate}%
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '600' }}>
            Cold chain intact
          </span>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Freshness Score
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            4.9 / 5.0
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            From 48 client reviews
          </span>
        </div>
      </div>

      {/* Breakdown grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Popular Fish */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
            Top Demanded Fish Varieties (kg)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {popularFishList.map(([fishName, kg], i) => (
              <div key={fishName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600' }}>{i + 1}. {fishName}</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{formatWeight(kg)}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (kg / 15) * 100)}%`,
                      backgroundColor: 'var(--color-primary)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Dar Wards */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
            Deliveries by Dar es Salaam Zone
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(wardMap).map(([ward, count]) => (
              <div
                key={ward}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--color-primary)" />
                  <span style={{ fontWeight: '600' }}>{ward}</span>
                </div>
                <span className="badge badge-primary">
                  {count} {count === 1 ? 'order' : 'orders'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
