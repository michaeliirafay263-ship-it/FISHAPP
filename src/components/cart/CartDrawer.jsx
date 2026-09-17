import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import { DAR_WARDS, COLD_CHAIN_FEE } from '../../data/wards';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Snowflake,
  ShieldCheck,
  MapPin,
  Clock,
  Check
} from 'lucide-react';

export function CartDrawer({ onProceedToCheckout }) {
  const {
    cart,
    cartSubtotal,
    cartTotalWeight,
    cartItemCount,
    updateCartItemWeight,
    removeFromCart,
    clearCart,
    coldChainPackaging,
    setColdChainPackaging,
    setActiveTab,
    t,
    language
  } = useApp();

  const [selectedWardId, setSelectedWardId] = useState('mikocheni');

  const selectedWard = DAR_WARDS.find((w) => w.id === selectedWardId) || DAR_WARDS[0];
  const deliveryFee = selectedWard.fee;
  const coldFee = coldChainPackaging ? COLD_CHAIN_FEE : 0;
  const grandTotal = cartSubtotal + deliveryFee + coldFee;

  if (cartItemCount === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--color-surface-hover)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: 'var(--color-text-subtle)'
          }}
        >
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '8px' }}>
          {t.cartEmpty}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '420px', margin: '0 auto 24px auto' }}>
          {t.cartEmptySub}
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="btn btn-primary btn-lg"
        >
          <ArrowRight size={18} />
          <span>{language === 'sw' ? 'Tazama Samaki Waliopo' : 'Explore Fresh Fish'}</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {t.cartTitle}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} • Total Weight: {formatWeight(cartTotalWeight)}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--color-danger)', borderColor: 'var(--color-border)' }}
        >
          <Trash2 size={14} />
          <span>{language === 'sw' ? 'Futa Yote' : 'Clear Cart'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="card"
              style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#e2e8f0',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                      {language === 'sw' ? item.swahiliName : item.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                      {item.cleaningOption}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{ color: 'var(--color-text-subtle)', padding: '4px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--color-border)'
                  }}
                >
                  {/* Weight Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => updateCartItemWeight(item.cartItemId, Math.max(0.5, Math.round((item.weightKg - 0.5) * 10) / 10))}
                      className="btn btn-secondary"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', minWidth: '55px', textAlign: 'center' }}>
                      {formatWeight(item.weightKg)}
                    </span>
                    <button
                      onClick={() => updateCartItemWeight(item.cartItemId, Math.round((item.weightKg + 0.5) * 10) / 10)}
                      className="btn btn-secondary"
                      style={{ width: '28px', height: '28px', padding: 0 }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      {formatTZS(item.totalPrice)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
                      {formatTZS(item.pricePerKg)} / kg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cold Chain Addon Box */}
          <div
            className="card"
            style={{
              padding: '16px',
              backgroundColor: coldChainPackaging ? 'var(--color-teal-light)' : 'var(--color-surface)',
              border: `1.5px solid ${coldChainPackaging ? 'var(--color-teal)' : 'var(--color-border)'}`,
              display: 'flex',
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
                  backgroundColor: 'var(--color-teal)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Snowflake size={18} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                  {t.coldChainTitle} (+{formatTZS(COLD_CHAIN_FEE)})
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {t.coldChainDesc}
                </p>
              </div>
            </div>

            <button
              onClick={() => setColdChainPackaging(!coldChainPackaging)}
              className={coldChainPackaging ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{
                backgroundColor: coldChainPackaging ? 'var(--color-teal)' : 'var(--color-surface)',
                borderColor: coldChainPackaging ? 'var(--color-teal)' : 'var(--color-border)',
                color: coldChainPackaging ? '#ffffff' : 'var(--color-text-main)',
                padding: '6px 12px',
                fontSize: '0.75rem'
              }}
            >
              {coldChainPackaging ? <Check size={14} /> : null}
              <span>{coldChainPackaging ? (language === 'sw' ? 'Imewekwa' : 'Included') : (language === 'sw' ? 'Weka' : 'Add')}</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div>
          <div className="card" style={{ padding: '20px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '16px' }}>
              {t.orderSummary}
            </h3>

            {/* Delivery Ward Selector for estimation */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '6px' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {t.deliveryWard}
              </label>
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.85rem', padding: '8px 12px' }}
              >
                {DAR_WARDS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.district}) — {formatTZS(w.fee)} ({w.estimatedMinutes} mins)
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{t.subtotal}</span>
                <span style={{ fontWeight: '600' }}>{formatTZS(cartSubtotal)}</span>
              </div>
              {coldChainPackaging && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cold Chain Pack (Ice)</span>
                  <span style={{ fontWeight: '600' }}>{formatTZS(COLD_CHAIN_FEE)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {t.deliveryFee} ({selectedWard.name})
                </span>
                <span style={{ fontWeight: '600' }}>{formatTZS(deliveryFee)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 20px 0' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-navy)' }}>{t.total}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                {formatTZS(grandTotal)}
              </span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onProceedToCheckout({ selectedWardId, deliveryFee, selectedWard })}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <ShoppingBag size={18} />
              <span>{t.checkout}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>{language === 'sw' ? 'Malipo Salama ya M-Pesa & Tigo Pesa' : 'Secure M-Pesa & Tigo Pesa Gateway'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
