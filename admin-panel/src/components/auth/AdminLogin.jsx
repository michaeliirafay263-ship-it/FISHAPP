import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Fish } from 'lucide-react';

export function AdminLogin() {
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('admin@samakifresh.co.tz');
  const [password, setPassword] = useState('Admin@2026');
  const [error, setError] = useState('');
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@samakifresh.co.tz');
    setPassword('Admin@2026');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b1329',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px'
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 14px auto',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
            }}
          >
            <Fish size={32} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            SAMAKI FRESH
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
            ADMIN CONTROL PORTAL
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
            Kivukoni Fish Market Logistics & Inventory Management
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#334155',
            color: '#ffffff',
            padding: '28px'
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#fca5a5'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                Admin Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{
                    paddingLeft: '38px',
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#ffffff'
                  }}
                  placeholder="admin@samakifresh.co.tz"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(true)}
                  style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '600' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{
                    paddingLeft: '38px',
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#ffffff'
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {showForgotNotice && (
              <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.75rem', color: '#94a3b8' }}>
                Demo Master Credentials: <strong>admin@samakifresh.co.tz</strong> / <strong>Admin@2026</strong>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '12px' }}
            >
              <ShieldCheck size={18} />
              <span>LOGIN TO ADMIN PORTAL</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Demo Credential Pill */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Demo Access:</span>
            <button
              type="button"
              onClick={handleQuickDemo}
              style={{
                fontSize: '0.75rem',
                color: '#38bdf8',
                fontWeight: '700',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              Auto-Fill Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
