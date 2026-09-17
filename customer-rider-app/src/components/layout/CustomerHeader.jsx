import React from 'react';
import { useCustomerApp } from '../../context/CustomerAppContext';
import { useAuth } from '../../context/AuthContext';
import { Search, ShoppingBag, Globe, LogOut, User } from 'lucide-react';
import { formatTZS } from '../../utils/formatters';

export function CustomerHeader() {
  const {
    searchQuery,
    setSearchQuery,
    cartItemCount,
    cartSubtotal,
    setActiveCustomerTab,
    language,
    setLanguage,
    t
  } = useCustomerApp();

  const { user, logout } = useAuth();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        gap: '16px'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1', maxWidth: '440px' }}>
        <Search
          size={18}
          color="var(--color-text-subtle)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="input-field"
          style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              color: 'var(--color-text-subtle)',
              fontWeight: '600'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Language selector */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
          className="btn btn-secondary btn-sm"
          style={{ padding: '6px 10px' }}
          title="Switch Language"
        >
          <Globe size={14} />
          <span>{language.toUpperCase()}</span>
        </button>

        {/* Cart Quick Button */}
        <button
          onClick={() => setActiveCustomerTab('cart')}
          className="btn btn-primary"
          style={{ position: 'relative', padding: '8px 14px' }}
        >
          <ShoppingBag size={16} />
          <span style={{ display: 'none', md: 'inline' }}>
            {cartItemCount > 0 ? formatTZS(cartSubtotal) : t.navCart}
          </span>
          {cartItemCount > 0 && (
            <span
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--color-primary-dark)',
                fontSize: '0.7rem',
                fontWeight: '800',
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Customer Avatar / Logout */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          title="Sign out of customer account"
          style={{ padding: '6px 10px' }}
        >
          <LogOut size={14} />
          <span style={{ display: 'none', md: 'inline' }}>Logout</span>
        </button>
      </div>
    </header>
  );
}
