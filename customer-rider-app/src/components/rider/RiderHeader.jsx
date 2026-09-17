import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCustomerApp } from '../../context/CustomerAppContext';
import { Bike, LogOut, Globe, ShieldCheck, CheckCircle2, User } from 'lucide-react';

export function RiderHeader() {
  const { user, logout } = useAuth();
  const { language, setLanguage, activeRiderTab, setActiveRiderTab } = useCustomerApp();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-navy)',
        color: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--color-navy-border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            backgroundColor: 'var(--color-teal)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}
        >
          <Bike size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Rider Portal • {user?.name || 'Rider'}
            </h1>
            <span
              style={{
                backgroundColor: 'var(--color-success)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              ONLINE
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {user?.bikeModel} • Reg: <strong>{user?.bikePlate}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Rider Tab Quick Selectors for Mobile */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveRiderTab('dashboard')}
            className={activeRiderTab === 'dashboard' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{
              backgroundColor: activeRiderTab === 'dashboard' ? 'var(--color-teal)' : 'rgba(255,255,255,0.1)',
              borderColor: 'transparent',
              color: '#ffffff',
              fontSize: '0.75rem'
            }}
          >
            Deliveries
          </button>
          <button
            onClick={() => setActiveRiderTab('history')}
            className={activeRiderTab === 'history' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{
              backgroundColor: activeRiderTab === 'history' ? 'var(--color-teal)' : 'rgba(255,255,255,0.1)',
              borderColor: 'transparent',
              color: '#ffffff',
              fontSize: '0.75rem'
            }}
          >
            History
          </button>
        </div>

        {/* Language switch */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Globe size={14} />
          <span>{language.toUpperCase()}</span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            borderColor: 'rgba(239, 68, 68, 0.4)',
            fontSize: '0.75rem',
            padding: '6px 12px'
          }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
