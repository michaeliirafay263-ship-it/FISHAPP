import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import { X, Minus, Plus, ShoppingBag, ShieldCheck, Check, Info, Snowflake, HeartPulse } from 'lucide-react';

export function FishDetailModal({ fish, onClose }) {
  const { t, language, addToCart } = useApp();

  const [selectedCleaning, setSelectedCleaning] = useState(() => {
    return (
      fish?.cleaningOptions?.find((c) => c.recommended)?.label ||
      fish?.cleaningOptions?.[0]?.label ||
      'Descaled & Gutted'
    );
  });

  const [weightKg, setWeightKg] = useState(() => fish?.minWeightKg || 1.0);
  const [imgError, setImgError] = useState(false);

  if (!fish) return null;

  const currentCleaningObj = fish.cleaningOptions?.find((c) => c.label === selectedCleaning) || {
    extraCost: 0
  };

  const cleaningExtra = currentCleaningObj.extraCost || 0;
  const totalPrice = fish.pricePerKg * weightKg + cleaningExtra;

  const handleWeightChange = (delta) => {
    const step = fish.weightStep || 0.5;
    const min = fish.minWeightKg || 0.5;
    const max = fish.stockKg || 20;
    const newWeight = Math.min(max, Math.max(min, Math.round((weightKg + delta) * 10) / 10));
    setWeightKg(newWeight);
  };

  const handleAddToCart = () => {
    addToCart(fish, weightKg, selectedCleaning, cleaningExtra);
    onClose();
  };

  const fallbackImg = 'https://images.unsplash.com/photo-1534943441045-1089d75cb355?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div style={{ position: 'relative', height: '230px', backgroundColor: '#e2e8f0' }}>
          <img
            src={imgError ? fallbackImg : fish.image}
            alt={fish.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '16px',
              backgroundColor: 'var(--color-navy)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}
          >
            {fish.source}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)' }}>
              {language === 'sw' ? fish.swahiliName : fish.name}
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
              {language === 'sw' ? fish.name : fish.swahiliName}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
              {fish.description}
            </p>
          </div>

          {/* Cleaning / Preparation Options */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '8px' }}>
              {t.selectCut}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {fish.cleaningOptions?.map((option) => {
                const isSelected = selectedCleaning === option.label;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCleaning(option.label)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-main)' }}>
                        {option.label}
                      </span>
                      {isSelected && <Check size={14} color="var(--color-primary)" strokeWidth={3} />}
                    </div>
                    {option.extraCost > 0 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
                        +{formatTZS(option.extraCost)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight / Quantity Stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-surface-hover)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              border: '1px solid var(--color-border)'
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-main)' }}>
                {t.weightQuantity}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                {formatTZS(fish.pricePerKg)} / kg
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => handleWeightChange(-(fish.weightStep || 0.5))}
                disabled={weightKg <= (fish.minWeightKg || 0.5)}
                className="btn btn-secondary"
                style={{ width: '36px', height: '36px', padding: 0 }}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', minWidth: '70px', textAlign: 'center' }}>
                {formatWeight(weightKg)}
              </span>
              <button
                onClick={() => handleWeightChange(fish.weightStep || 0.5)}
                disabled={weightKg >= (fish.stockKg || 20)}
                className="btn btn-secondary"
                style={{ width: '36px', height: '36px', padding: 0 }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Storage & Cold Chain Guarantee Info */}
          <div
            style={{
              backgroundColor: 'var(--color-teal-light)',
              border: '1px solid var(--color-teal)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              gap: '12px'
            }}
          >
            <Snowflake size={20} color="var(--color-teal-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-teal-dark)' }}>
                {language === 'sw' ? 'Uhifadhi wa Ubaridi Mlangoni' : 'Cold-Chain Delivery Guarantee'}
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-teal-dark)', marginTop: '2px' }}>
                {fish.storageTip}
              </p>
            </div>
          </div>

          {/* Total & Action Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                {t.total} ({formatWeight(weightKg)})
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                {formatTZS(totalPrice)}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-lg"
              style={{ padding: '12px 28px' }}
            >
              <ShoppingBag size={18} />
              <span>{t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
