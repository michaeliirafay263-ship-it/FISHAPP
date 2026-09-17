import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTZS } from '../../utils/formatters';
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  X,
  Fish,
  DollarSign
} from 'lucide-react';

export function StockPriceEditor() {
  const { fishCatalog, updateDailyFish, addNewFish, t, language } = useApp();

  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStockKg, setEditStockKg] = useState(0);
  const [editInStock, setEditInStock] = useState(true);

  // New Fish Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSwahiliName, setNewSwahiliName] = useState('');
  const [newCategory, setNewCategory] = useState('fresh');
  const [newPricePerKg, setNewPricePerKg] = useState(15000);
  const [newStockKg, setNewStockKg] = useState(25);
  const [newSource, setNewSource] = useState('Kivukoni Fish Market (Daily Catch)');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1534943441045-1089d75cb355?auto=format&fit=crop&w=800&q=80');

  const startEdit = (fish) => {
    setEditingId(fish.id);
    setEditPrice(fish.pricePerKg);
    setEditStockKg(fish.stockKg);
    setEditInStock(fish.inStock);
  };

  const handleSaveEdit = (fishId) => {
    updateDailyFish(fishId, {
      pricePerKg: Number(editPrice),
      stockKg: Number(editStockKg),
      inStock: editInStock && Number(editStockKg) > 0
    });
    setEditingId(null);
  };

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newSwahiliName.trim()) return;

    addNewFish({
      name: newName,
      swahiliName: newSwahiliName,
      category: newCategory,
      categoryLabel: newCategory === 'fresh' ? 'Fresh Catch' : newCategory === 'frozen' ? 'Frozen Fish' : newCategory === 'smoked' ? 'Smoked & Dried' : 'Shellfish',
      pricePerKg: Number(newPricePerKg),
      stockKg: Number(newStockKg),
      unit: 'kg',
      minWeightKg: 1.0,
      weightStep: 0.5,
      source: newSource,
      description: newDescription || `${newName} fresh from market landings.`,
      image: newImage,
      badge: 'New Arrival',
      storageTip: 'Keep on fresh ice at 0-4°C.',
      nutrition: 'High Lean Protein and Omega-3'
    });

    setShowAddModal(false);
    setNewName('');
    setNewSwahiliName('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)' }}>
            {t.dailyPriceUpdate}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
            {language === 'sw'
              ? 'Badilisha bei za leo kulingana na mnada wa asubuhi wa Kivukoni.'
              : 'Adjust daily market prices and real-time kg stock levels.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} />
          <span>{language === 'sw' ? 'Ongeza Samaki Mpya' : 'Add New Catch'}</span>
        </button>
      </div>

      {/* Fish Inventory Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-navy)', color: '#ffffff', borderBottom: '1px solid var(--color-navy-border)' }}>
              <th style={{ padding: '12px 16px' }}>Fish / Species</th>
              <th style={{ padding: '12px 16px' }}>Source / Origin</th>
              <th style={{ padding: '12px 16px' }}>Today's Price (TZS/kg)</th>
              <th style={{ padding: '12px 16px' }}>Stock (kg)</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fishCatalog.map((fish, index) => {
              const isEditing = editingId === fish.id;

              return (
                <tr
                  key={fish.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)'
                  }}
                >
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={fish.image}
                        alt={fish.name}
                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#e2e8f0' }}
                      />
                      <div>
                        <div>{fish.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                          {fish.swahiliName}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>
                    {fish.source}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="input-field"
                        style={{ width: '110px', padding: '4px 8px', fontSize: '0.85rem' }}
                      />
                    ) : (
                      <span style={{ fontWeight: '700', color: 'var(--color-navy)' }}>
                        {formatTZS(fish.pricePerKg)}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editStockKg}
                        onChange={(e) => setEditStockKg(e.target.value)}
                        className="input-field"
                        style={{ width: '80px', padding: '4px 8px', fontSize: '0.85rem' }}
                      />
                    ) : (
                      <span style={{ fontWeight: '600' }}>{fish.stockKg} kg</span>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <input
                          type="checkbox"
                          checked={editInStock}
                          onChange={(e) => setEditInStock(e.target.checked)}
                        />
                        <span>Available</span>
                      </label>
                    ) : (
                      <span className={fish.inStock ? 'badge badge-success' : 'badge badge-danger'}>
                        {fish.inStock ? t.inStock : t.outOfStock}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleSaveEdit(fish.id)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <Check size={14} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(fish)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 10px' }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add New Fish Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-navy)' }}>
                {language === 'sw' ? 'Ongeza Samaki Mpya Sokoni' : 'Add New Fish to Daily Inventory'}
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    English Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Barracuda (Mzia)"
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Swahili Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newSwahiliName}
                    onChange={(e) => setNewSwahiliName(e.target.value)}
                    placeholder="mf. Mzia Mkubwa"
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="fresh">Fresh Catch</option>
                    <option value="frozen">Frozen Fish</option>
                    <option value="smoked">Smoked & Dried</option>
                    <option value="shellfish">Shellfish</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Price (TZS/kg)
                  </label>
                  <input
                    type="number"
                    value={newPricePerKg}
                    onChange={(e) => setNewPricePerKg(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Stock (kg)
                  </label>
                  <input
                    type="number"
                    value={newStockKg}
                    onChange={(e) => setNewStockKg(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  Source / Landing Hub
                </label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Fresh ocean landing..."
                  className="input-field"
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add Fish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
