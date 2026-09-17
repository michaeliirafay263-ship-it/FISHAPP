import React, { useState, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { useCustomerApp } from './context/CustomerAppContext';
import { RoleSelector } from './components/auth/RoleSelector';
import { CustomerSidebar } from './components/layout/CustomerSidebar';
import { CustomerMobileNav } from './components/layout/CustomerMobileNav';
import { CustomerHeader } from './components/layout/CustomerHeader';
import { PriceTicker } from './components/customer/PriceTicker';
import { CategoryFilter } from './components/customer/CategoryFilter';
import { FishCard } from './components/customer/FishCard';
import { FishDetailModal } from './components/customer/FishDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTracker } from './components/customer/OrderTracker';
import { OrderHistory } from './components/customer/OrderHistory';
import { UserProfile } from './components/customer/UserProfile';
import { RiderSidebar } from './components/rider/RiderSidebar';
import { RiderHeader } from './components/rider/RiderHeader';
import { RiderDashboard } from './components/rider/RiderDashboard';
import { RiderHistory } from './components/rider/RiderHistory';
import { RiderProfile } from './components/rider/RiderProfile';
import { Waves } from 'lucide-react';

export function App() {
  const { isAuthenticated, role } = useAuth();
  const {
    activeCustomerTab,
    activeRiderTab,
    fishCatalog,
    searchQuery,
    selectedCategory,
    language
  } = useCustomerApp();

  const [selectedFishForModal, setSelectedFishForModal] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutInitialWardId, setCheckoutInitialWardId] = useState('mikocheni');
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort fish catalog for customer view
  const filteredFish = useMemo(() => {
    return fishCatalog
      .filter((fish) => {
        if (selectedCategory !== 'all' && fish.category !== selectedCategory) {
          return false;
        }
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
        return 0;
      });
  }, [fishCatalog, selectedCategory, searchQuery, sortBy]);

  const handleProceedToCheckout = ({ selectedWardId }) => {
    setCheckoutInitialWardId(selectedWardId);
    setShowCheckoutModal(true);
  };

  // 1. Unauthenticated -> Show Role Selector Landing Page
  if (!isAuthenticated) {
    return <RoleSelector />;
  }

  // 2. Rider Role View
  if (role === 'rider') {
    return (
      <div className="app-container">
        <RiderSidebar />
        <div className="main-content-wrapper">
          <RiderHeader />
          <main style={{ padding: '24px 20px', flex: 1 }}>
            {activeRiderTab === 'dashboard' && <RiderDashboard />}
            {activeRiderTab === 'history' && <RiderHistory />}
            {activeRiderTab === 'profile' && <RiderProfile />}
          </main>
        </div>
      </div>
    );
  }

  // 3. Customer Role View (Default)
  return (
    <div className="app-container">
      {/* Desktop Left-Side Navigation */}
      <CustomerSidebar />

      {/* Main Content Layout */}
      <div className="main-content-wrapper">
        <CustomerHeader />

        <main style={{ padding: '24px 20px', flex: 1 }}>
          {activeCustomerTab === 'market' && (
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

          {activeCustomerTab === 'cart' && (
            <CartDrawer onProceedToCheckout={handleProceedToCheckout} />
          )}

          {activeCustomerTab === 'tracking' && <OrderTracker />}

          {activeCustomerTab === 'orders' && <OrderHistory />}

          {activeCustomerTab === 'profile' && <UserProfile />}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Customer */}
      <CustomerMobileNav />

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
