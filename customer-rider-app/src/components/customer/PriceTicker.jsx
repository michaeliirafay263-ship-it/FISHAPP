import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Snowflake, Anchor, Clock } from 'lucide-react';

export function PriceTicker() {
  const { t, language } = useApp();

  return (
    <div
      style={{
        backgroundColor: 'var(--color-navy)',
        color: '#ffffff',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'rgba(2, 132, 199, 0.2)',
            border: '1px solid rgba(2, 132, 199, 0.4)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}
        >
          <Anchor size={18} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
              {t.todaysMarketPrice}
            </span>
            <span
              style={{
                backgroundColor: 'var(--color-success)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              LIVE
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {t.priceUpdated} • {language === 'sw' ? 'Maji ya Bahari ya Hindi & Ziwa Victoria' : 'Indian Ocean & Lake Victoria Landings'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Snowflake size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>
            {language === 'sw' ? 'Barafu & Ubaridi 0-4°C Umehakikishwa' : 'Cold-Chain 0-4°C Guaranteed'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={15} color="#4ade80" />
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: '500' }}>
            {language === 'sw' ? 'Kufikishiwa Siku Hiyo Hiyo Jijini Dar' : 'Same-Day Dar Delivery'}
          </span>
        </div>
      </div>
    </div>
  );
}
