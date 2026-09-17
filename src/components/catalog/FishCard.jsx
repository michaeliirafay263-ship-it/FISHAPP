import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS } from '../../utils/formatters';
import { Plus, ShieldCheck, Waves, Info, Check, Sparkles } from 'lucide-react';

export function FishCard({ fish, onOpenDetail }) {
  const { t, language, addToCart } = useApp();
  const [imgError, setImgError] = useState(false);

  const fallbackImg = 'https://images.unsplash.com/photo-1534943441045-1089d75cb355?auto=format&fit=crop&w=800&q=80';

  const defaultCleaning = fish.cleaningOptions?.find((c) => c.recommended) || fish.cleaningOptions?.[0] || {
    id: 'gutted',
    label: 'Descaled & Gutted',
    extraCost: 0
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(fish, fish.minWeightKg || 1.0, defaultCleaning.label, defaultCleaning.extraCost || 0);
  };

  return (
    <div
      className="card"
      onClick={() => onOpenDetail(fish)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Product Image Header */}
      <div style={{ position: 'relative', width: '100%', height: '190px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
        <img
          src={imgError ? fallbackImg : fish.image}
          alt={fish.name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          loading="lazy"
        />

        {/* Origin / Type Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {fish.badge && (
            <span
              style={{
                backgroundColor: 'var(--color-navy)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {fish.badge}
            </span>
          )}
        </div>

        {/* Stock Status Badge */}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          {fish.inStock ? (
            <span
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--color-success)',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} strokeWidth={3} />
              {fish.stockKg} kg {t.inStock}
            </span>
          ) : (
            <span
              style={{
                backgroundColor: 'var(--color-danger)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {t.outOfStock}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', fontWeight: '600', textTransform: 'uppercase' }}>
            {fish.source}
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text-main)', marginTop: '2px' }}>
            {language === 'sw' ? fish.swahiliName : fish.name}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
            {language === 'sw' ? fish.name : fish.swahiliName}
          </p>
        </div>

        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4'
          }}
        >
          {fish.description}
        </p>

        {/* Cleaning Options Preview */}
        <div style={{ marginBottom: '14px', backgroundColor: 'var(--color-surface-hover)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontWeight: '600' }}>
            {language === 'sw' ? 'Usafi:' : 'Cuts:'}
          </span>{' '}
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-main)', fontWeight: '500' }}>
            {defaultCleaning.label}
          </span>
        </div>

        {/* Price and Action Footer */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              {formatTZS(fish.pricePerKg)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
              {t.pricePerKg} (Min {fish.minWeightKg}kg)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleQuickAdd}
              disabled={!fish.inStock}
              className="btn btn-primary btn-sm"
              title="Quick Add 1 kg"
            >
              <Plus size={15} />
              <span>{t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
