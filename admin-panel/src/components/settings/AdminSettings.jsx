import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Settings, Save, ShieldCheck, DollarSign, MapPin, Snowflake, Smartphone } from 'lucide-react';

export function AdminSettings() {
  const { addToast } = useToast();

  const [coldChainFee, setColdChainFee] = useState(1500);
  const [marketHours, setMarketHours] = useState('05:30 AM - 06:00 PM');
  const [hubAddress, setHubAddress] = useState('Kivukoni Fish Market Landing Bay 3, Ferry Road, Dar es Salaam');
  const [mpesaShortcode, setMpesaShortcode] = useState('5520991 (Samaki Fresh Lipa Namba)');
  const [tigoTills, setTigoTills] = useState('883210 (Tigo Pesa Lipa)');

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Market logistics settings updated successfully');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          Kivukoni Logistics & Platform Configuration
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Configure cold chain pricing, market operating schedules, and mobile money payment aggregator details.
        </p>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                Cold-Chain Thermal Pouch Fee (TZS)
              </label>
              <input
                type="number"
                value={coldChainFee}
                onChange={(e) => setColdChainFee(e.target.value)}
                className="input-field"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                Includes 2x sealed gel ice packs and foil insulation
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                Daily Market Sourcing Window
              </label>
              <input
                type="text"
                value={marketHours}
                onChange={(e) => setMarketHours(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              Primary Fish Sourcing & Quality Inspection Hub
            </label>
            <input
              type="text"
              value={hubAddress}
              onChange={(e) => setHubAddress(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                Vodacom M-Pesa Merchant Lipa Namba
              </label>
              <input
                type="text"
                value={mpesaShortcode}
                onChange={(e) => setMpesaShortcode(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                Tigo Pesa Merchant Till Number
              </label>
              <input
                type="text"
                value={tigoTills}
                onChange={(e) => setTigoTills(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
