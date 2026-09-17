import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bike, Phone, MapPin, Star, ShieldCheck, CheckCircle2, User } from 'lucide-react';

export function RiderProfile() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Rider Account & Fleet Credentials
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Kivukoni Fish Market Logistics & Transport Fleet
        </p>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-teal)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '1.4rem'
            }}
          >
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              {user?.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Authorized Kivukoni Cold-Chain Rider
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Motorbike Model
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '2px' }}>
              {user?.bikeModel || 'Bajaj Boxer 150 (Fitted Cold Box 45L)'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Registration Number Plate
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '2px' }}>
              {user?.bikePlate || 'MC 849 DXA'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Phone Contact
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '2px' }}>
              {user?.phone}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
              Operational Primary Zone
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)', marginTop: '2px' }}>
              {user?.currentZone || 'Kivukoni Hub'}
            </div>
          </div>
        </div>
      </div>

      {/* Cold Chain Standard Pledge */}
      <div
        className="card"
        style={{
          padding: '20px',
          backgroundColor: 'var(--color-navy)',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="#2dd4bf" />
          <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>
            Kivukoni Cold-Chain Protocol
          </h4>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          All fresh fish must remain sealed inside the insulated carrier with crushed gel ice packs throughout transit. Direct sunlight or open exposure without ice is strictly prohibited.
        </p>
      </div>
    </div>
  );
}
