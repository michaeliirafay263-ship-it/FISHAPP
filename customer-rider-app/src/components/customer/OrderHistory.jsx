import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS, formatWeight } from '../../utils/formatters';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';

export function OrderHistory() {
  const { orders, reorder, setTrackingOrderId, setActiveTab, t, language } = useApp();

  const handleTrackClick = (orderId) => {
    setTrackingOrderId(orderId);
    setActiveTab('tracking');
  };

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '8px' }}>
          {language === 'sw' ? 'Huna Oda Zilizopita Bado' : 'No Order History Found'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
          {language === 'sw' ? 'Weka oda yako ya kwanza ya samaki wabichi kutoka Kivukoni.' : 'Place your first order for fresh fish from Kivukoni.'}
        </p>
        <button onClick={() => setActiveTab('catalog')} className="btn btn-primary">
          {t.navCatalog}
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          {t.navOrders}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          {language === 'sw' ? 'Tazama oda zako zote, fuatilia na urudie kuagiza kwa bofyo 1.' : 'Track live dispatches and reorder in one click.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map((order) => {
          const isDelivered = order.status === 'delivered';

          return (
            <div key={order.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                      {order.id}
                    </h3>
                    <span
                      style={{
                        backgroundColor: isDelivered ? 'var(--color-success-bg)' : 'var(--color-primary-light)',
                        color: isDelivered ? 'var(--color-success)' : 'var(--color-primary-dark)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {order.status.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                    {order.ward} • {order.deliveryTimeSlot} • {order.paymentMethod}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                    {formatTZS(order.grandTotal)}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', backgroundColor: 'var(--color-surface-hover)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {order.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>
                      {it.name} ({formatWeight(it.weightKg)})
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginLeft: '6px' }}>
                        [{it.cleaningOption}]
                      </span>
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>
                      {formatTZS(it.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => handleTrackClick(order.id)}
                  className="btn btn-outline-primary btn-sm"
                >
                  <Clock size={14} />
                  <span>{language === 'sw' ? 'Fuatilia Hali' : 'Track Status'}</span>
                </button>

                <button
                  onClick={() => reorder(order.id)}
                  className="btn btn-primary btn-sm"
                >
                  <RotateCcw size={14} />
                  <span>{t.reorder}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
