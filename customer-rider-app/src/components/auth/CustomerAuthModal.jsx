import React, { useState } from 'react';
import { DAR_WARDS } from '../../data/wards';
import { X, User, Phone, MapPin, Building2, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export function CustomerAuthModal({ onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('Amina Salum');
  const [phone, setPhone] = useState('0754 443 219');
  const [ward, setWard] = useState('Mikocheni A & B');
  const [userType, setUserType] = useState('Household');
  const [address, setAddress] = useState('Mikocheni B, Near Rose Garden, House 42B');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name,
      phone,
      ward,
      address,
      userType
    });
    onClose();
  };

  const handleQuickDemo = (demoType) => {
    if (demoType === 'restaurant') {
      onLoginSuccess({
        name: 'David Mwangi (The Peninsula Bistro)',
        phone: '0784 102 938',
        ward: 'Masaki (Peninsula)',
        address: 'Toure Drive, Plot 14, Kitchen Back Entrance',
        userType: 'Restaurant'
      });
    } else {
      onLoginSuccess({
        name: 'Amina Salum',
        phone: '0754 443 219',
        ward: 'Mikocheni A & B',
        address: 'Mikocheni B, Near Rose Garden, House 42B',
        userType: 'Household'
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              {isRegister ? 'Create Customer Account' : 'Customer Sign In'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              Enter your phone number to access fresh Kivukoni catches
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Quick Demo Fill Pills */}
          <div style={{ marginBottom: '16px', backgroundColor: 'var(--color-surface-hover)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              Quick Demo Accounts:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('household')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', padding: '5px' }}
              >
                Household (Amina)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('restaurant')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', padding: '5px' }}
              >
                Restaurant (Bistro)
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Amina Salum"
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
              Phone Number (M-Pesa / Tigo Pesa)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="0754 443 219"
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
              Customer Type
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setUserType('Household')}
                className={userType === 'Household' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ flex: 1 }}
              >
                <User size={14} />
                <span>Household</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('Restaurant')}
                className={userType === 'Restaurant' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                style={{ flex: 1 }}
              >
                <Building2 size={14} />
                <span>Restaurant / Hotel</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
              Default Ward in Dar es Salaam
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="input-field"
            >
              {DAR_WARDS.map((w) => (
                <option key={w.id} value={`${w.name} (${w.district})`}>
                  {w.name} ({w.district})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
              Street / Landmark / House No.
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field"
              placeholder="e.g. Haile Selassie Rd, near Village Supermarket"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <span>Sign In to Fish Market</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
