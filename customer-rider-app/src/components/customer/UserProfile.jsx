import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAR_WARDS } from '../../data/wards';
import {
  User,
  Phone,
  MapPin,
  Building2,
  Save,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Clock
} from 'lucide-react';

export function UserProfile() {
  const { currentUser, updateUserProfile, setActiveTab, orders, language } = useApp();

  const [name, setName] = useState(currentUser.name || 'Amina Salum');
  const [phone, setPhone] = useState(currentUser.phone || '0754 443 219');
  const [userType, setUserType] = useState(currentUser.userType || 'Household');
  const [ward, setWard] = useState(currentUser.ward || 'Mikocheni A & B');
  const [address, setAddress] = useState(currentUser.address || 'Mikocheni B, Near Rose Garden, House 42B');

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({ name, phone, userType, ward, address });
  };

  const userOrders = orders;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-navy)' }}>
          {language === 'sw' ? 'Akaunti Yangu ya Samaki Fresh' : 'My Account & Delivery Address'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          {language === 'sw'
            ? 'Weka taarifa zako za simu na makazi kwa ajili ya kuagiza samaki kwa urahisi.'
            : 'Manage your delivery address in Dar es Salaam and phone number.'}
        </p>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                {language === 'sw' ? 'Jina Kamili' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
                {language === 'sw' ? 'Namba ya Simu (M-Pesa / Tigo Pesa)' : 'Phone Number (Mobile Money)'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              {language === 'sw' ? 'Aina ya Mteja' : 'Customer Account Type'}
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setUserType('Household')}
                className={userType === 'Household' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ flex: 1, padding: '8px' }}
              >
                <User size={15} />
                <span>Household / Family</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('Restaurant')}
                className={userType === 'Restaurant' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ flex: 1, padding: '8px' }}
              >
                <Building2 size={15} />
                <span>Restaurant / Hotel (Bulk)</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {language === 'sw' ? 'Kata / Eneo la Dar es Salaam' : 'Default Ward (Dar es Salaam)'}
            </label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="input-field"
            >
              {DAR_WARDS.map((w) => (
                <option key={w.id} value={`${w.name} (${w.district})`}>
                  {w.name} ({w.district})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '6px' }}>
              {language === 'sw' ? 'Mtaa / Namba ya Nyumba / Alama Maarufu' : 'Street / House / Landmark'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{language === 'sw' ? 'Hifadhi Mabadiliko' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Freshness & Cold Chain Standard Info */}
      <div
        className="card"
        style={{
          padding: '20px',
          backgroundColor: 'var(--color-navy)',
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={22} color="#38bdf8" />
          <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>
            {language === 'sw' ? 'Dhamana ya Ubichi wa Kivukoni' : 'Kivukoni Freshness Promise'}
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          {language === 'sw'
            ? 'Kila samaki anasafishwa na kupakiwa kwa barafu maalum inayotunza ubaridi hadi anapofika jikoni kwako. Ikiwa haujaridhika na ubichi, tutakubadilishia bure mara moja.'
            : 'Every fish is carefully inspected, gutted, and sealed with food-grade gel ice packs inside an insulated thermal container. If you are not 100% satisfied with freshness, we will replace or refund immediately.'}
        </p>
      </div>
    </div>
  );
}
