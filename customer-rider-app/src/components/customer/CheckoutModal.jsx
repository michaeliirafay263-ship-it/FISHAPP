import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAR_WARDS, DELIVERY_TIME_SLOTS, COLD_CHAIN_FEE } from '../../data/wards';
import { formatTZS } from '../../utils/formatters';
import { PaymentSimulator } from './PaymentSimulator';
import {
  X,
  MapPin,
  Clock,
  Phone,
  User,
  CreditCard,
  Building2,
  FileText,
  ShieldCheck,
  Smartphone,
  Banknote,
  ArrowRight
} from 'lucide-react';

export function CheckoutModal({ initialWardId, onClose }) {
  const {
    cart,
    cartSubtotal,
    coldChainPackaging,
    currentUser,
    placeNewOrder,
    t,
    language
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser.name || 'Amina Salum');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '0754 443 219');
  const [customerType, setCustomerType] = useState(currentUser.userType || 'Household');
  const [wardId, setWardId] = useState(initialWardId || 'mikocheni');
  const [exactAddress, setExactAddress] = useState(currentUser.address || 'Mikocheni B, Near Rose Garden, House 42B');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(DELIVERY_TIME_SLOTS[0].label);
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa (Vodacom)');
  const [notes, setNotes] = useState('');
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const selectedWard = DAR_WARDS.find((w) => w.id === wardId) || DAR_WARDS[0];
  const deliveryFee = selectedWard.fee;
  const coldFee = coldChainPackaging ? COLD_CHAIN_FEE : 0;
  const grandTotal = cartSubtotal + deliveryFee + coldFee;

  const paymentOptions = [
    { id: 'mpesa', name: 'M-Pesa (Vodacom)', icon: Smartphone, color: '#dc2626', popular: true },
    { id: 'tigo', name: 'Tigo Pesa', icon: Smartphone, color: '#0284c7', popular: true },
    { id: 'airtel', name: 'Airtel Money', icon: Smartphone, color: '#b91c1c', popular: false },
    { id: 'halo', name: 'Halopesa', icon: Smartphone, color: '#f59e0b', popular: false },
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, color: '#16a34a', popular: false }
  ];

  const validateForm = () => {
    const errors = {};
    if (!customerName.trim()) {
      errors.name = language === 'sw' ? 'Tafadhali weka jina lako' : 'Please enter your name';
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      errors.phone = language === 'sw' ? 'Weka namba sahihi ya simu (mf. 0754 123 456)' : 'Enter a valid phone number (e.g. 0754 123 456)';
    }
    if (!exactAddress.trim()) {
      errors.address = language === 'sw' ? 'Weka mtaa au alama maarufu' : 'Enter your street or nearest landmark';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInitiateOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod.includes('Cash')) {
      // Direct placement for Cash on Delivery
      placeNewOrder({
        customerName,
        customerPhone,
        customerType,
        wardId: selectedWard.id,
        ward: `${selectedWard.name} (${selectedWard.district})`,
        exactAddress,
        deliveryTimeSlot,
        paymentMethod,
        deliveryFee,
        notes
      });
      onClose();
    } else {
      // Trigger USSD Simulator
      setShowPaymentSimulator(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentSimulator(false);
    placeNewOrder({
      customerName,
      customerPhone,
      customerType,
      wardId: selectedWard.id,
      ward: `${selectedWard.name} (${selectedWard.district})`,
      exactAddress,
      deliveryTimeSlot,
      paymentMethod,
      deliveryFee,
      notes
    });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '640px' }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                {t.checkoutTitle}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                {language === 'sw' ? 'Uwasilishaji wa siku hiyo hiyo jijini Dar es Salaam' : 'Same-day cold chain delivery across Dar es Salaam'}
              </p>
            </div>
            <button onClick={onClose} style={{ color: 'var(--color-text-subtle)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleInitiateOrder} style={{ padding: '24px' }}>
            {/* Customer Type Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                {language === 'sw' ? 'Aina ya Mteja' : 'Customer Account Type'}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCustomerType('Household')}
                  className={customerType === 'Household' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                >
                  <User size={15} />
                  <span>{language === 'sw' ? 'Nyumbani (Household)' : 'Household / Home'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType('Restaurant')}
                  className={customerType === 'Restaurant' ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
                >
                  <Building2 size={15} />
                  <span>{language === 'sw' ? 'Mgahawa / Hoteli (Bulk)' : 'Restaurant / Hotel'}</span>
                </button>
              </div>
            </div>

            {/* Name & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  {language === 'sw' ? 'Jina Kamili' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Amina Salum"
                />
                {formErrors.name && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{formErrors.name}</span>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                  {t.contactNumber}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="input-field"
                  placeholder="0754 123 456"
                />
                {formErrors.phone && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{formErrors.phone}</span>
                )}
              </div>
            </div>

            {/* Ward Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {t.deliveryWard}
              </label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="input-field"
              >
                {DAR_WARDS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.district}) — {formatTZS(w.fee)} (ETA: ~{w.estimatedMinutes} mins)
                  </option>
                ))}
              </select>
            </div>

            {/* Exact Address */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                {t.exactAddress}
              </label>
              <input
                type="text"
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                className="input-field"
              />
              {formErrors.address && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{formErrors.address}</span>
              )}
            </div>

            {/* Delivery Time Window */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {t.deliveryTime}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                {DELIVERY_TIME_SLOTS.map((slot) => {
                  const isSelected = deliveryTimeSlot === slot.label;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setDeliveryTimeSlot(slot.label)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-main)' }}>
                        {slot.shortLabel}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
                        {slot.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>
                <CreditCard size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {t.paymentMethod}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod === opt.name;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.name)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: opt.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: isSelected ? '700' : '500' }}>
                        {opt.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes / Special Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {language === 'sw' ? 'Maagizo Maalum kwa Boda Rider' : 'Rider Delivery Instructions (Optional)'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'sw' ? 'mf. Piga simu ukifika getini, weka barafu ya ziada' : 'e.g. Ring bell at white gate, call when arriving'}
                className="input-field"
              />
            </div>

            {/* Total breakdown */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-hover)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{t.subtotal}</span>
                <span style={{ fontWeight: '600' }}>{formatTZS(cartSubtotal)}</span>
              </div>
              {coldChainPackaging && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cold Chain Pack (Ice)</span>
                  <span style={{ fontWeight: '600' }}>{formatTZS(COLD_CHAIN_FEE)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {t.deliveryFee} ({selectedWard.name})
                </span>
                <span style={{ fontWeight: '600' }}>{formatTZS(deliveryFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>{t.total}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                  {formatTZS(grandTotal)}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>{paymentMethod.includes('Cash') ? t.placeOrder : `${t.payWith} ${paymentMethod}`}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Payment USSD Simulator Modal */}
      {showPaymentSimulator && (
        <PaymentSimulator
          orderData={{
            customerName,
            customerPhone,
            paymentMethod,
            grandTotal,
            ward: selectedWard.name
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentSimulator(false)}
          language={language}
        />
      )}
    </>
  );
}
