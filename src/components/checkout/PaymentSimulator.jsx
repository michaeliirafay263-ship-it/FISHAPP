import React, { useState, useEffect } from 'react';
import { formatTZS } from '../../utils/formatters';
import { Smartphone, CheckCircle2, ShieldAlert, ArrowRight, X, Loader2, KeyRound } from 'lucide-react';

export function PaymentSimulator({
  orderData,
  onPaymentSuccess,
  onCancel,
  language
}) {
  const [stage, setStage] = useState('push_sent'); // 'push_sent' | 'pin_input' | 'verifying' | 'confirmed'
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto countdown for USSD session
  useEffect(() => {
    if (stage === 'push_sent' || stage === 'pin_input') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  const handleAuthorize = () => {
    if (pin.length < 4) {
      setErrorMsg(language === 'sw' ? 'Weka namba ya siri yenye tarakimu 4 (mf. 1234)' : 'Enter a 4-digit PIN (e.g. 1234)');
      return;
    }

    setStage('verifying');
    setErrorMsg('');

    setTimeout(() => {
      setStage('confirmed');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1200);
    }, 1800);
  };

  const methodColor = orderData.paymentMethod.includes('M-Pesa')
    ? '#dc2626' // Red for Vodacom M-Pesa
    : orderData.paymentMethod.includes('Tigo')
    ? '#0284c7' // Blue for Tigo Pesa
    : orderData.paymentMethod.includes('Airtel')
    ? '#b91c1c'
    : '#f59e0b';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '0', overflow: 'hidden' }}
      >
        {/* USSD Dialog Header */}
        <div
          style={{
            backgroundColor: 'var(--color-navy)',
            color: '#ffffff',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-navy-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: methodColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Smartphone size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', display: 'block' }}>
                {orderData.paymentMethod}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                Tanzania Mobile Money Gateway
              </span>
            </div>
          </div>
          <button onClick={onCancel} style={{ color: '#94a3b8' }}>
            <X size={18} />
          </button>
        </div>

        {/* Dialog Body */}
        <div style={{ padding: '24px' }}>
          {stage === 'push_sent' && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <Smartphone size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '6px' }}>
                {language === 'sw' ? 'Ombi la Malipo Limerushwa Simuni' : 'USSD Push Prompt Dispatched'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {language === 'sw'
                  ? `Ombi la kulipa ${formatTZS(orderData.grandTotal)} kwenda Samaki Fresh limetumwa kwa namba ${orderData.customerPhone}.`
                  : `Payment prompt for ${formatTZS(orderData.grandTotal)} to Samaki Fresh has been sent to ${orderData.customerPhone}.`}
              </p>

              {/* Mock USSD Screen Box */}
              <div
                style={{
                  backgroundColor: '#0f172a',
                  color: '#22c55e',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  marginBottom: '20px',
                  border: '1px solid #334155'
                }}
              >
                <div>SAMAKI FRESH DAR ES SALAAM</div>
                <div style={{ color: '#ffffff', margin: '6px 0' }}>
                  Lipa Kiasi: {formatTZS(orderData.grandTotal)}
                </div>
                <div style={{ color: '#94a3b8' }}>Weka namba ya siri kukamilisha:</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setStage('pin_input')}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '10px' }}
                >
                  <KeyRound size={16} />
                  <span>{language === 'sw' ? 'Weka PIN ya Majaribio' : 'Enter Test PIN'}</span>
                </button>
              </div>
            </div>
          )}

          {stage === 'pin_input' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: '600' }}>
                  {orderData.paymentMethod}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                  {formatTZS(orderData.grandTotal)}
                </h3>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  {language === 'sw' ? 'Namba ya Siri (Test PIN):' : 'Enter Mobile Money PIN (Simulation):'}
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1 2 3 4"
                  className="input-field"
                  style={{
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    letterSpacing: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700'
                  }}
                  autoFocus
                />
                {errorMsg && (
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '6px', textAlign: 'center' }}>
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Quick keypad shortcuts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'C') setPin('');
                      else if (key === 'OK') handleAuthorize();
                      else if (pin.length < 4) setPin((prev) => prev + key);
                    }}
                    className="btn btn-secondary"
                    style={{
                      height: '42px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>
                  {language === 'sw' ? 'Ghairi' : 'Cancel'}
                </button>
                <button onClick={handleAuthorize} className="btn btn-primary" style={{ flex: 2 }}>
                  <span>{language === 'sw' ? 'Thibitisha Malipo' : 'Authorize Payment'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {stage === 'verifying' && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-surface-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--color-primary)'
                }}
              >
                <Loader2 size={32} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '6px' }}>
                {language === 'sw' ? 'Inathibitisha Muamala na Mtandao...' : 'Verifying Network Callback...'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {language === 'sw' ? 'Tafadhali subiri kidogo wakati benki inajibu' : 'Communicating with telecom aggregator'}
              </p>
            </div>
          )}

          {stage === 'confirmed' && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '6px' }}>
                {language === 'sw' ? 'Malipo Yamethibitishwa!' : 'Payment Verified!'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {language === 'sw' ? 'Oda yako inatumwa jikoni na soko la Kivukoni...' : 'Forwarding order to Kivukoni cold hub...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
