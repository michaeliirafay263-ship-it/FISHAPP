import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import {
  CheckCircle2,
  Bike,
  Clock,
  MapPin,
  Phone,
  Package,
  ArrowRight,
  Filter,
  UserCheck,
  Snowflake
} from 'lucide-react';

export function OrderManagement() {
  const { orders, riders, updateOrderStatus, assignRider, language } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return o.status !== 'delivered';
    return o.status === filterStatus;
  });

  const getNextStatus = (current) => {
    switch (current) {
      case 'received':
        return { next: 'sourced', label: 'Mark Sourced at Kivukoni' };
      case 'sourced':
        return { next: 'packed', label: 'Mark Packed in Ice Pouch' };
      case 'packed':
        return { next: 'out_for_delivery', label: 'Dispatch with Boda Rider' };
      case 'out_for_delivery':
        return { next: 'delivered', label: 'Confirm Delivered to Client' };
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {language === 'sw' ? 'Usimamizi wa Oda & Dispatch' : 'Order Pipeline & Rider Assignment'}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
            {language === 'sw' ? 'Fuatilia na badilisha hatua za uandaaji na usafirishaji wa samaki.' : 'Monitor order flow from Kivukoni landing to customer doorstep.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Pipeline' },
            { id: 'received', label: 'Received' },
            { id: 'packed', label: 'Packed' },
            { id: 'out_for_delivery', label: 'On Route' },
            { id: 'delivered', label: 'Delivered' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={filterStatus === f.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredOrders.map((order) => {
          const nextAction = getNextStatus(order.status);
          const currentRider = riders.find((r) => r.id === order.assignedRiderId);

          return (
            <div key={order.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      {order.id}
                    </span>
                    <span
                      style={{
                        backgroundColor: order.status === 'delivered' ? 'var(--color-success-bg)' : 'var(--color-primary-light)',
                        color: order.status === 'delivered' ? 'var(--color-success)' : 'var(--color-primary-dark)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {order.status.toUpperCase().replace(/_/g, ' ')}
                    </span>
                    <span className="badge badge-navy">
                      {order.customerType}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.ward}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    {order.exactAddress} • Slot: {order.deliveryTimeSlot}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                    {formatTZS(order.grandTotal)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Items for Cold Prep:
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>
                      {item.name} — <strong>{formatWeight(item.weightKg)}</strong> ({item.cleaningOption})
                    </span>
                    <span style={{ fontWeight: '600' }}>{formatTZS(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Rider Assignment & Pipeline Actions */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-border)'
                }}
              >
                {/* Rider select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bike size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Assign Rider:</span>
                  <select
                    value={order.assignedRiderId || ''}
                    onChange={(e) => assignRider(order.id, e.target.value)}
                    className="input-field"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                  >
                    <option value="">Unassigned</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.bikePlate}) - {r.currentZone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Progress button */}
                {nextAction && (
                  <button
                    onClick={() => updateOrderStatus(order.id, nextAction.next)}
                    className="btn btn-primary btn-sm"
                  >
                    <span>{nextAction.label}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
