import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCustomerApp } from '../../context/CustomerAppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import { CheckCircle2, Star, Calendar, MapPin, DollarSign } from 'lucide-react';

export function RiderHistory() {
  const { user } = useAuth();
  const { orders } = useCustomerApp();

  const completedDeliveries = orders.filter(
    (o) => (o.assignedRiderId === user?.id || !o.assignedRiderId) && o.status === 'delivered'
  );

  const totalDeliveryEarnings = completedDeliveries.length * 3000; // TZS 3,000 per delivery payout

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Completed Deliveries & Payouts
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Record of successfully fulfilled cold-chain doorstep orders across Dar es Salaam.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Fulfilled Deliveries
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)', marginTop: '4px' }}>
            {completedDeliveries.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>
            100% On-Time Sourcing
          </span>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Estimated Rider Earnings
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-teal-dark)', marginTop: '4px' }}>
            {formatTZS(totalDeliveryEarnings)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            TZS 3,000 / doorstep delivery
          </span>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Customer Rating
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-warning)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={20} fill="var(--color-warning)" />
            <span>{user?.rating || '4.9'} / 5.0</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Freshness verified
          </span>
        </div>
      </div>

      {/* Deliveries List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {completedDeliveries.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p>No completed deliveries recorded yet today.</p>
          </div>
        ) : (
          completedDeliveries.map((order) => (
            <div key={order.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                    {order.id}
                  </span>
                  <span className="badge badge-success">Delivered</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                  {formatTZS(order.grandTotal)}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                <strong>{order.customerName}</strong> ({order.customerPhone})
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {order.ward} • {order.exactAddress} • Payment: {order.paymentMethod}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
