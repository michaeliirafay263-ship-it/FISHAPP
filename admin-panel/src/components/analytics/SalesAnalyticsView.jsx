import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import { TrendingUp, ShoppingBag, MapPin, Award, CheckCircle2 } from 'lucide-react';

export function SalesAnalyticsView() {
  const { orders } = useAdminData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  const wardMap = {};
  orders.forEach((o) => {
    const w = o.ward.split(' ')[0];
    wardMap[w] = (wardMap[w] || 0) + 1;
  });

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
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Sales Performance & Logistics Metrics
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Aggregated revenue, top fish species in demand, and ward density across Dar es Salaam.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Total Revenue
          </span>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '4px' }}>
            {formatTZS(totalRevenue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>
            +18% growth
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Fulfillment Rate
          </span>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '4px' }}>
            {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 100}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>
            100% cold-chain success
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Total Orders Logged
          </span>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '4px' }}>
            {totalOrders}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Household & Restaurant
          </span>
        </div>
      </div>

      {/* Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Popular Fish Demand */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
            Top Selling Fish Varieties (kg)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {popularFishList.map(([fishName, kg], i) => (
              <div key={fishName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
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

        {/* Deliveries by Zone */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
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
