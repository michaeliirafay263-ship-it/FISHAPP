import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { Bike, Phone, Star, MapPin, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

export function RiderDispatchManager() {
  const { riders, orders } = useAdminData();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Kivukoni Boda Fleet & Dispatch Management
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Registered motorcycle delivery fleet equipped with 45L insulated cold boxes and temperature seals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {riders.map((rider) => {
          const riderOrders = orders.filter((o) => o.assignedRiderId === rider.id);
          const activeOrders = riderOrders.filter((o) => o.status !== 'delivered');
          const completedOrders = riderOrders.filter((o) => o.status === 'delivered');

          return (
            <div key={rider.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-teal)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.1rem'
                  }}
                >
                  <Bike size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      {rider.name}
                    </h3>
                    <span className="badge badge-success">
                      <Star size={12} fill="var(--color-success)" />
                      {rider.rating}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {rider.bikeModel} • <strong>{rider.bikePlate}</strong>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', backgroundColor: 'var(--color-surface-hover)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-subtle)' }}>Primary Ward:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{rider.currentZone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-subtle)' }}>Active Deliveries:</span>
                  <span style={{ fontWeight: '700', color: activeOrders.length > 0 ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {activeOrders.length} in transit
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-subtle)' }}>Fulfilled Today:</span>
                  <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                    {completedOrders.length} completed
                  </span>
                </div>
              </div>

              <a
                href={`tel:${rider.phone}`}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <Phone size={14} />
                <span>Call Rider ({rider.phone})</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
