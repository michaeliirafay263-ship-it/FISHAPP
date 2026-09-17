import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CustomerAuthModal } from './CustomerAuthModal';
import { RiderAuthModal } from './RiderAuthModal';
import {
  Fish,
  ShoppingBag,
  Bike,
  ShieldCheck,
  Snowflake,
  Anchor,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export function RoleSelector() {
  const { loginCustomer, loginRider } = useAuth();
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [showRiderAuth, setShowRiderAuth] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px'
      }}
    >
      <div style={{ maxWidth: '540px', width: '100%', textAlign: 'center' }}>
        {/* Brand Logo */}
        <div
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 16px auto',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <Fish size={36} />
        </div>

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: 'var(--color-navy)',
            letterSpacing: '-0.03em',
            marginBottom: '4px'
          }}
        >
          SAMAKI FRESH
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', fontWeight: '600', marginBottom: '8px' }}>
          Kivukoni Market Catch • Dar es Salaam
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Fresh, frozen, and dried ocean catches delivered with guaranteed cold-chain insulation to your doorstep.
        </p>

        {/* Role Selection Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {/* Customer Option */}
          <div
            className="card"
            style={{
              padding: '24px',
              textAlign: 'left',
              cursor: 'pointer',
              border: '2px solid var(--color-border)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
            }}
            onClick={() => setShowCustomerAuth(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                    Customer / Household / Restaurant
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                    Browse today's Kivukoni catch, order fish cuts & track delivery
                  </p>
                </div>
              </div>
              <ArrowRight size={20} color="var(--color-primary)" />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowCustomerAuth(true);
              }}
            >
              <ShoppingBag size={16} />
              <span>Continue as Customer</span>
            </button>
          </div>

          {/* Rider Option */}
          <div
            className="card"
            style={{
              padding: '24px',
              textAlign: 'left',
              cursor: 'pointer',
              border: '2px solid var(--color-border)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
            }}
            onClick={() => setShowRiderAuth(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-teal)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-teal-light)',
                    color: 'var(--color-teal-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bike size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                    Delivery Rider
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                    View assigned deliveries, cold-chain checks & route updates
                  </p>
                </div>
              </div>
              <ArrowRight size={20} color="var(--color-teal)" />
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{
                width: '100%',
                marginTop: '8px',
                borderColor: 'var(--color-teal)',
                color: 'var(--color-teal-dark)',
                fontWeight: '700'
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowRiderAuth(true);
              }}
            >
              <Bike size={16} />
              <span>Continue as Rider</span>
            </button>
          </div>
        </div>

        {/* Value badges footer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '0.75rem',
            color: 'var(--color-text-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Anchor size={14} color="var(--color-primary)" />
            <span>Direct from Kivukoni Dock</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Snowflake size={14} color="var(--color-primary)" />
            <span>0-4°C Cold-Chain Insulated</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>M-Pesa & Tigo Pesa Verified</span>
          </div>
        </div>
      </div>

      {/* Auth Modals */}
      {showCustomerAuth && (
        <CustomerAuthModal
          onClose={() => setShowCustomerAuth(false)}
          onLoginSuccess={(data) => loginCustomer(data)}
        />
      )}

      {showRiderAuth && (
        <RiderAuthModal
          onClose={() => setShowRiderAuth(false)}
          onLoginSuccess={(riderId) => loginRider(riderId)}
        />
      )}
    </div>
  );
}
