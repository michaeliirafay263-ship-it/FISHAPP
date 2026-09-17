import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export function RiderPortal() {
  const { riders, orders, updateOrderStatus, language } = useApp();
  const [selectedRiderId, setSelectedRiderId] = useState('rider-1');

  // Cold-chain checklist check items
  const [checklist, setChecklist] = useState({
    insulatedBag: true,
    icePacksSealed: true,
    tempVerified: true,
    clientContacted: false
  });

  const selectedRider = riders.find((r) => r.id === selectedRiderId) || riders[0];

  // Orders assigned to this rider
  const assignedOrders = orders.filter((o) => o.assignedRiderId === selectedRiderId);
  const activeDeliveries = assignedOrders.filter((o) => o.status !== 'delivered');
  const completedDeliveries = assignedOrders.filter((o) => o.status === 'delivered');

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      {/* Rider Header & Profile Switcher */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: 'var(--color-navy)',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                fontWeight: '800'
              }}
            >
              <Bike size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>
                Kivukoni Boda Fleet Dispatch
              </span>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                {selectedRider.name}
              </h1>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {selectedRider.bikeModel} • <strong>{selectedRider.bikePlate}</strong>
              </p>
            </div>
          </div>

          {/* Switch rider simulation */}
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Switch Rider View:
            </span>
            <select
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              className="input-field"
              style={{
                backgroundColor: 'var(--color-navy-surface)',
                color: '#ffffff',
                borderColor: 'var(--color-navy-border)',
                padding: '6px 12px',
                fontSize: '0.85rem'
              }}
            >
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.bikePlate})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cold-Chain Departure Checklist */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'var(--color-teal-light)', border: '1.5px solid var(--color-teal)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Snowflake size={20} color="var(--color-teal-dark)" />
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-teal-dark)' }}>
            {language === 'sw' ? 'Uhakiki wa Ubaridi Kabla ya Kuondoka (Cold-Chain)' : 'Cold-Chain Departure Quality Checklist'}
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
            <span>Temperature Verified (0-4°C)</span>
          </label>
        </div>
      </div>

      {/* Active Assigned Deliveries */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px' }}>
          {language === 'sw' ? 'Oda Zinazotakiwa Kufikishwa Sasa' : 'Assigned Deliveries in Transit'} ({activeDeliveries.length})
        </h2>

        {activeDeliveries.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <CheckCircle2 size={32} color="var(--color-success)" style={{ margin: '0 auto 8px auto' }} />
            <p style={{ fontWeight: '600' }}>
              {language === 'sw' ? 'Hakuna oda zinazosubiri kwa sasa. Upo tayari!' : 'No pending deliveries right now. You are all caught up!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeDeliveries.map((order) => (
              <div key={order.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                        {order.id}
                      </span>
                      <span className="badge badge-primary">
                        {order.status.toUpperCase().replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '4px' }}>
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
                    Items to Handover:
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
                      onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                      className="btn btn-secondary btn-sm"
                    >
                      <Bike size={14} />
                      <span>{language === 'sw' ? 'Nipo Njiani na Boda' : 'Start Transit on Bike'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>{language === 'sw' ? 'Imefikishwa & Kukabidhiwa' : 'Confirm Delivered to Doorstep'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Deliveries History for Rider */}
      {completedDeliveries.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '12px' }}>
            {language === 'sw' ? 'Oda Zilizokamilika Leo' : 'Completed Deliveries Today'} ({completedDeliveries.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {completedDeliveries.map((order) => (
              <div
                key={order.id}
                className="card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-surface-hover)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                    {order.id} — {order.customerName}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    {order.ward} • {formatTZS(order.grandTotal)}
                  </div>
                </div>
                <span className="badge badge-success">Delivered</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
