import React, { useState } from 'react';
import { RIDERS } from '../../data/initialOrders';
import { X, Bike, Phone, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

export function RiderAuthModal({ onClose, onLoginSuccess }) {
  const [selectedRiderId, setSelectedRiderId] = useState('rider-1');
  const [pin, setPin] = useState('1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(selectedRiderId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              Rider Dispatch Login
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Kivukoni Boda Fleet Management System
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              Select Registered Rider:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {RIDERS.map((r) => {
                const isSelected = selectedRiderId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRiderId(r.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--color-teal)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-teal-light)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isSelected ? 'var(--color-teal)' : 'var(--color-surface-hover)',
                        color: isSelected ? '#ffffff' : 'var(--color-text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700'
                      }}
                    >
                      <Bike size={18} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                        {r.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                        {r.phone} • {r.bikePlate} ({r.currentZone})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              Rider 4-Digit Security PIN
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input-field"
              style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '8px', fontFamily: 'var(--font-mono)' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', backgroundColor: 'var(--color-teal)', borderColor: 'var(--color-teal)' }}
          >
            <Bike size={18} />
            <span>Enter Rider Portal</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
