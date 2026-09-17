import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  Bike,
  ShieldCheck,
  Phone,
  Snowflake,
  Star,
  MapPin,
  Package,
  Calendar,
  Sparkles,
  ArrowRight,
  Anchor,
  HelpCircle
} from 'lucide-react';

export function OrderTracker() {
  const {
    orders,
    trackingOrderId,
    setTrackingOrderId,
    riders,
    rateOrder,
    setActiveTab,
    t,
    language
  } = useApp();

  const [ratingVal, setRatingVal] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  const order = orders.find((o) => o.id === trackingOrderId) || orders[0];

  if (!order) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '8px' }}>
          {language === 'sw' ? 'Hakuna Oda Inayofuatiliwa' : 'No Active Order Being Tracked'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
          {language === 'sw' ? 'Chagua samaki kutoka soko la Kivukoni uanze oda yako.' : 'Explore fresh catches and place your first order.'}
        </p>
        <button onClick={() => setActiveTab('catalog')} className="btn btn-primary">
          {t.navCatalog}
        </button>
      </div>
    );
  }

  const assignedRider = riders.find((r) => r.id === order.assignedRiderId) || riders[0];

  const steps = [
    {
      key: 'received',
      title: language === 'sw' ? '1. Oda Imepokelewa' : '1. Order Confirmed',
      desc: language === 'sw' ? 'Malipo yamehakikiwa na kupelekwa kituo cha Kivukoni' : 'Payment verified & sent to Kivukoni hub'
    },
    {
      key: 'sourced',
      title: language === 'sw' ? '2. Imetolewa Kivukoni' : '2. Kivukoni Sourced',
      desc: language === 'sw' ? 'Samaki wamekaguliwa ubichi kwenye gati la Kivukoni' : 'Inspected for gills, eyes & firmness at pier'
    },
    {
      key: 'packed',
      title: language === 'sw' ? '3. Imesafishwa & Barafu' : '3. Cold-Packed with Ice',
      desc: language === 'sw' ? 'Kutolewa magamba na kuwekwa mfuko maalum wa ubaridi' : 'Descaled, cleaned & sealed in insulated ice bag'
    },
    {
      key: 'out_for_delivery',
      title: language === 'sw' ? '4. Ipo Njiani na Rider' : '4. Out for Delivery',
      desc: language === 'sw' ? 'Boda rider yupo njiani kuelekea mlangoni kwako' : 'Motorbike rider in transit with temperature carrier'
    },
    {
      key: 'delivered',
      title: language === 'sw' ? '5. Imefikishwa' : '5. Delivered',
      desc: language === 'sw' ? 'Imekabidhiwa mlangoni kwako salama' : 'Safely handed over to client at doorstep'
    }
  ];

  const statusOrder = ['received', 'sourced', 'packed', 'out_for_delivery', 'delivered'];
  const currentStepIndex = statusOrder.indexOf(order.status);

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    rateOrder(order.id, ratingVal, feedbackText);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      {/* Order Selector (if multiple orders exist) */}
      {orders.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setTrackingOrderId(o.id)}
              className={o.id === order.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ flexShrink: 0 }}
            >
              <span>{o.id}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({o.ward.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Order Header Card */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '20px',
          backgroundColor: 'var(--color-navy)',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700' }}>
                LIVE DISPATCH
              </span>
              <span
                style={{
                  backgroundColor: order.status === 'delivered' ? 'var(--color-success)' : '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {order.status.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {order.id}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {order.ward} • {order.deliveryTimeSlot}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>
              {formatTZS(order.grandTotal)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {order.paymentMethod} ({order.paymentStatus})
            </div>
          </div>
        </div>
      </div>

      {/* Live Cold-Chain Timeline */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Snowflake size={18} color="var(--color-primary)" />
          <span>{language === 'sw' ? 'Mchakato wa Ubaridi & Uwasilishaji' : 'Cold-Chain Fulfillment Pipeline'}</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                {/* Step circle indicator */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border)',
                    color: isCompleted ? '#ffffff' : 'var(--color-text-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    zIndex: 2,
                    boxShadow: isCurrent ? '0 0 0 4px var(--color-primary-light)' : 'none'
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                </div>

                {/* Step info */}
                <div style={{ flex: 1, paddingBottom: idx < steps.length - 1 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        color: isCompleted ? 'var(--color-navy)' : 'var(--color-text-subtle)'
                      }}
                    >
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {order.statusHistory?.find((h) => h.status === step.key)?.time || 'Completed'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Delivery Rider Card */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bike size={18} color="var(--color-primary)" />
          <span>{language === 'sw' ? 'Boda Rider Aliyepangiwa Oda Yako' : 'Assigned Cold-Chain Delivery Rider'}</span>
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1.1rem'
              }}
            >
              {assignedRider.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                  {assignedRider.name}
                </h4>
                <span className="badge badge-success">
                  <Star size={12} fill="var(--color-success)" />
                  {assignedRider.rating}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                {assignedRider.bikeModel} • Reg: <strong>{assignedRider.bikePlate}</strong>
              </p>
            </div>
          </div>

          <a
            href={`tel:${assignedRider.phone}`}
            className="btn btn-primary"
            style={{ padding: '8px 18px' }}
          >
            <Phone size={16} />
            <span>{assignedRider.phone}</span>
          </a>
        </div>
      </div>

      {/* Ordered Items Summary */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="var(--color-primary)" />
          <span>{language === 'sw' ? 'Vitu vya Samaki Ndani ya Oda' : 'Fish Pack Contents'}</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                backgroundColor: 'var(--color-surface-hover)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                  {item.name}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                  {formatWeight(item.weightKg)} • {item.cleaningOption}
                </div>
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                {formatTZS(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Address & Delivery note */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div>
            <strong>{language === 'sw' ? 'Eneo la Kushusha:' : 'Delivery Address:'}</strong> {order.exactAddress}, {order.ward}
          </div>
          {order.riderNotes && (
            <div style={{ marginTop: '4px' }}>
              <strong>{language === 'sw' ? 'Maelekezo:' : 'Notes:'}</strong> {order.riderNotes}
            </div>
          )}
        </div>
      </div>

      {/* Freshness Review Dialog (If delivered or test review) */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '10px' }}>
          {t.freshnessRating}
        </h3>

        {order.freshnessRating ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: '700' }}>
            <CheckCircle2 size={18} />
            <span>
              {language === 'sw'
                ? `Umetathmini ubichi huu kwa alama ${order.freshnessRating}/5. Asante!`
                : `You rated this catch ${order.freshnessRating}/5 stars. Thank you!`}
            </span>
          </div>
        ) : (
          <form onSubmit={handleRatingSubmit}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              {language === 'sw'
                ? 'Tathmini ubichi wa samaki na ubaridi wa begi la barafu ulilopokea kutoka Kivukoni.'
                : 'Help us maintain 100% freshness by rating the fish condition and ice cold pack.'}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingVal(star)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: star <= ratingVal ? 'var(--color-warning-bg)' : 'var(--color-surface-hover)',
                    border: `1px solid ${star <= ratingVal ? 'var(--color-warning)' : 'var(--color-border)'}`,
                    color: 'var(--color-warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Star size={18} fill={star <= ratingVal ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={language === 'sw' ? 'Toa maoni kuhusu ubichi au usafi...' : 'Any comments on fish freshness or packaging...'}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                {t.submitFeedback}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
