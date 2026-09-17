import React, { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Header } from './components/layout/Header';
import { PriceTicker } from './components/catalog/PriceTicker';
import { CategoryFilter } from './components/catalog/CategoryFilter';
import { FishCard } from './components/catalog/FishCard';
import { FishDetailModal } from './components/catalog/FishDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTracker } from './components/tracking/OrderTracker';
import { OrderHistory } from './components/tracking/OrderHistory';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RiderPortal } from './components/rider/RiderPortal';
import { UserProfile } from './components/profile/UserProfile';
import { Search, Sparkles, Filter, Waves } from 'lucide-react';

export function App() {
  const {
    activeTab,
    fishCatalog,
    searchQuery,
    selectedCategory,
    t,
    language
  } = useApp();

  const [selectedFishForModal, setSelectedFishForModal] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutInitialWardId, setCheckoutInitialWardId] = useState('mikocheni');
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort fish catalog
  const filteredFish = useMemo(() => {
    return fishCatalog
      .filter((fish) => {
        // Category filter
        if (selectedCategory !== 'all' && fish.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = fish.name.toLowerCase().includes(q);
          const matchSwahili = fish.swahiliName?.toLowerCase().includes(q);
          const matchDesc = fish.description.toLowerCase().includes(q);
          const matchSource = fish.source.toLowerCase().includes(q);
          if (!matchName && !matchSwahili && !matchDesc && !matchSource) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerKg - b.pricePerKg;
        if (sortBy === 'price-desc') return b.pricePerKg - a.pricePerKg;
        if (sortBy === 'stock') return b.stockKg - a.stockKg;
        return 0; // featured default
      });
  }, [fishCatalog, selectedCategory, searchQuery, sortBy]);

  const handleProceedToCheckout = ({ selectedWardId }) => {
    setCheckoutInitialWardId(selectedWardId);
    setShowCheckoutModal(true);
  };

  return (
    <div className="app-container">
      {/* Desktop Left-Side Navigation */}
      <DesktopSidebar />

      {/* Main Content Layout */}
      <div className="main-content-wrapper">
        <Header />

        <main style={{ padding: '24px 20px', flex: 1 }}>
          {activeTab === 'catalog' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <PriceTicker />
              <CategoryFilter sortBy={sortBy} setSortBy={setSortBy} />

              {filteredFish.length === 0 ? (
                <div
                  className="card"
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    backgroundColor: 'var(--color-surface)'
                  }}
                >
                  <Waves size={40} color="var(--color-primary)" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-navy)', marginBottom: '6px' }}>
                    {language === 'sw' ? 'Hakuna Samaki Waliopatikana' : 'No Fish Found'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {language === 'sw'
                      ? 'Jaribu kubadilisha jina unalotafuta au angalia kundi lingine.'
                      : 'Try adjusting your search terms or filter category.'}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px'
                  }}
                >
                  {filteredFish.map((fish) => (
                    <FishCard
                      key={fish.id}
                      fish={fish}
                      onOpenDetail={(f) => setSelectedFishForModal(f)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cart' && (
            <CartDrawer onProceedToCheckout={handleProceedToCheckout} />
          )}

          {activeTab === 'tracking' && <OrderTracker />}

          {activeTab === 'orders' && <OrderHistory />}

          {activeTab === 'admin' && <AdminDashboard />}

          {activeTab === 'rider' && <RiderPortal />}

          {activeTab === 'profile' && <UserProfile />}
        </main>
      </div>

      {/* Mobile Bottom Navigation (< 1024px) */}
      <MobileBottomNav />

      {/* Fish Cut & Weight Detail Modal */}
      {selectedFishForModal && (
        <FishDetailModal
          fish={selectedFishForModal}
          onClose={() => setSelectedFishForModal(null)}
        />
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          initialWardId={checkoutInitialWardId}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </div>
  );
}

export default App;
