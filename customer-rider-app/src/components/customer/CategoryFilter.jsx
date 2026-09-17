import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Waves, Snowflake, Flame, Shell } from 'lucide-react';

export function CategoryFilter({ sortBy, setSortBy }) {
  const { selectedCategory, setSelectedCategory, t, language } = useApp();

  const categories = [
    { id: 'all', label: t.allCategories, icon: Layers },
    { id: 'fresh', label: t.freshFish, icon: Waves },
    { id: 'frozen', label: t.frozenFish, icon: Snowflake },
    { id: 'smoked', label: t.smokedDried, icon: Flame },
    { id: 'shellfish', label: t.shellfish, icon: Shell }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '20px'
      }}
    >
      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isSelected ? '#ffffff' : 'var(--color-text-main)',
                border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                fontSize: '0.85rem',
                fontWeight: isSelected ? '700' : '500',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isSelected ? '#ffffff' : 'var(--color-primary)'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort selection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: '600' }}>
          {language === 'sw' ? 'Panga kwa:' : 'Sort by:'}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field"
          style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <option value="featured">{language === 'sw' ? 'Maarufu Zaidi' : 'Most Popular'}</option>
          <option value="price-asc">{language === 'sw' ? 'Bei: Chini kwenda Juu' : 'Price: Low to High'}</option>
          <option value="price-desc">{language === 'sw' ? 'Bei: Juu kwenda Chini' : 'Price: High to Low'}</option>
          <option value="stock">{language === 'sw' ? 'Idadi Iliyopo (Stock)' : 'Available Stock'}</option>
        </select>
      </div>
    </div>
  );
}
