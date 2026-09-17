import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCustomerApp } from '../../context/CustomerAppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import {
  Bike,
  MapPin,
  Phone,
  CheckCircle2,
  Snowflake,
  ShieldCheck,
  Package,
  Clock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export function RiderDashboard() {
  const { user } = useAuth();
  const { orders, updateRiderOrderStatus, language } = useCustomerApp();

  const [checklist, setChecklist] = useState({
    insulatedBag: true,
    icePacksSealed: true,
    tempVerified: true
  });

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const assignedOrders = orders.filter((o) => o.assignedRiderId === user?.id || !o.assignedRiderId);
  const activeDeliveries = assignedOrders.filter((o) => o.status !== 'delivered');

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      {/* Cold-Chain Departure Checklist */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: 'var(--color-teal-light)',
          border: '1.5px solid var(--color-teal)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Snowflake size={20} color="var(--color-teal-dark)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-teal-dark)' }}>
            Cold-Chain Departure Quality Checklist
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--color-navy)'
            }}
          >
            <input
              type="checkbox"
              checked={checklist.insulatedBag}
              onChange={() => toggleCheck('insulatedBag')}
            />
            <span>Insulated Thermal Box (45L)</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--color-navy)'
            }}
          >
            <input
              type="checkbox"
              checked={checklist.icePacksSealed}
              onChange={() => toggleCheck('icePacksSealed')}
            />
            <span>2x Sealed Gel Ice Packs</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--color-navy)'
            }}
          >
            <input
              type="checkbox"
              checked={checklist.tempVerified}
              onChange={() => toggleCheck('tempVerified')}
            />
            <span>Temp Verified (0-4°C)</span>
          </label>
        </div>
      </div>

      {/* Active Assigned Deliveries */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
          Assigned Deliveries in Transit ({activeDeliveries.length})
        </h2>

        {activeDeliveries.length === 0 ? (
          <div className="card" style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: '0 auto 10px auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-navy)', marginBottom: '4px' }}>
              All Caught Up!
            </h3>
            <p style={{ fontSize: '0.85rem' }}>
              No active pending deliveries assigned right now. You will be alerted when new Kivukoni orders are ready for dispatch.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeDeliveries.map((order) => (
              <div key={order.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                        {order.id}
                      </span>
                      <span className="badge badge-primary">
                        {order.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '4px' }}>
                      {order.customerName}
                    </div>
                  </div>

                  <a
                    href={`tel:${order.customerPhone}`}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '6px 14px' }}
                  >
                    <Phone size={14} />
                    <span>{order.customerPhone}</span>
                  </a>
                </div>

                {/* Delivery location info */}
                <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                    <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                        {order.ward}
                      </span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {order.exactAddress}
                      </p>
                    </div>
                  </div>
                  {order.riderNotes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontWeight: '600', marginTop: '6px', paddingLeft: '24px' }}>
                      Note: {order.riderNotes}
                    </div>
                  )}
                </div>

                {/* Items to Deliver */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                    Items in Cold Pack:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {order.items.map((it, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>• {it.name} ({formatWeight(it.weightKg)})</span>
                        <span style={{ color: 'var(--color-text-subtle)' }}>{it.cleaningOption}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rider Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                  {order.status !== 'out_for_delivery' && (
                    <button
                      onClick={() => updateRiderOrderStatus(order.id, 'out_for_delivery')}
                      className="btn btn-secondary btn-sm"
                    >
                      <Bike size={14} />
                      <span>Start Transit on Bike</span>
                    </button>
                  )}

                  <button
                    onClick={() => updateRiderOrderStatus(order.id, 'delivered')}
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Confirm Delivered to Doorstep</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
