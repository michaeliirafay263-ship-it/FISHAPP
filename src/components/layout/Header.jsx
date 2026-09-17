import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, Globe, SlidersHorizontal, Bike, User, ShieldCheck, MapPin } from 'lucide-react';
import { formatTZS } from '../../utils/formatters';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    cartItemCount,
    cartSubtotal,
    language,
    setLanguage,
    t
  } = useApp();

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
        {/* Role Quick Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-surface-hover)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            border: '1px solid var(--color-border)'
          }}
        >
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: ['catalog', 'cart', 'orders', 'tracking', 'profile'].includes(activeTab)
                ? 'var(--color-surface)'
                : 'transparent',
              color: ['catalog', 'cart', 'orders', 'tracking', 'profile'].includes(activeTab)
                ? 'var(--color-text-main)'
                : 'var(--color-text-subtle)',
              boxShadow: ['catalog', 'cart', 'orders', 'tracking', 'profile'].includes(activeTab)
                ? 'var(--shadow-sm)'
                : 'none'
            }}
          >
            Client
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeTab === 'admin' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'admin' ? 'var(--color-primary)' : 'var(--color-text-subtle)',
              boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <SlidersHorizontal size={12} />
            Admin
          </button>
          <button
            onClick={() => setActiveTab('rider')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeTab === 'rider' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'rider' ? 'var(--color-teal)' : 'var(--color-text-subtle)',
              boxShadow: activeTab === 'rider' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Bike size={12} />
            Rider
          </button>
        </div>

        {/* Language selector (mobile/tablet visible) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 10px' }}
            title="Switch Language"
          >
            <Globe size={14} />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Cart Quick Button */}
        <button
          onClick={() => setActiveTab('cart')}
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
      </div>
    </header>
  );
}
