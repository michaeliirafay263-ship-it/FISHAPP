import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import {
  TrendingUp,
  ShoppingBag,
  Bike,
  Award,
  DollarSign,
  Package,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Fish,
  MapPin
} from 'lucide-react';

export function DashboardOverview() {
  const { totalRevenue, activeOrdersCount, orders, fishCatalog, riders, setActiveAdminRoute } = useAdminData();

  const completedOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const inStockFishCount = fishCatalog.filter((f) => f.inStock).length;
  const outOfStockFishCount = fishCatalog.filter((f) => !f.inStock).length;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Kivukoni Operations Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Real-time fish market logistics, cold-chain dispatches, and daily sales overview in Dar es Salaam.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Today's Gross Revenue
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {formatTZS(totalRevenue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>
            +18% from last week
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Active Dispatches
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-teal-light)', color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {activeOrdersCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {completedOrdersCount} orders fulfilled today
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Inventory Availability
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Fish size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {inStockFishCount} / {fishCatalog.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: outOfStockFishCount > 0 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: '600' }}>
            {outOfStockFishCount} species sold out
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Cold Chain Score
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            4.9 / 5.0
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Freshness verified by clients
          </span>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Urgent Orders in Pipeline */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              Recent Orders
            </h3>
            <button
              onClick={() => setActiveAdminRoute('orders')}
              style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-navy)' }}>
                    {order.id} — {order.customerName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    {order.ward} • {formatTZS(order.grandTotal)}
                  </div>
                </div>
                <span
                  style={{
                    backgroundColor: order.status === 'delivered' ? 'var(--color-success-bg)' : 'var(--color-primary-light)',
                    color: order.status === 'delivered' ? 'var(--color-success)' : 'var(--color-primary-dark)',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {order.status.toUpperCase().replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stock Controls */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              Daily Price & Stock Quick Check
            </h3>
            <button
              onClick={() => setActiveAdminRoute('stock')}
              style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Manage Stock</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fishCatalog.slice(0, 3).map((fish) => (
              <div
                key={fish.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--color-navy)' }}>
                    {fish.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    {fish.source}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: 'var(--color-navy)' }}>
                    {formatTZS(fish.pricePerKg)} / kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: fish.inStock ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: '600' }}>
                    {fish.stockKg} kg in stock
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
