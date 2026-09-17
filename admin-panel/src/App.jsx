import React from 'react';
import { useAdminAuth } from './context/AdminAuthContext';
import { useAdminData } from './context/AdminDataContext';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { StockPriceManager } from './components/stock/StockPriceManager';
import { OrdersPipeline } from './components/orders/OrdersPipeline';
import { RiderDispatchManager } from './components/riders/RiderDispatchManager';
import { CustomerManager } from './components/customers/CustomerManager';
import { SalesAnalyticsView } from './components/analytics/SalesAnalyticsView';
import { AdminSettings } from './components/settings/AdminSettings';

export function App() {
  const { isAuthenticated } = useAdminAuth();
  const { activeAdminRoute } = useAdminData();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="app-container">
      {/* Admin Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content View */}
      <div className="main-content-wrapper" style={{ marginLeft: '270px' }}>
        <AdminHeader />

        <main style={{ padding: '24px 20px', flex: 1, backgroundColor: 'var(--color-bg)' }}>
          {activeAdminRoute === 'dashboard' && <DashboardOverview />}
          {activeAdminRoute === 'stock' && <StockPriceManager />}
          {activeAdminRoute === 'orders' && <OrdersPipeline />}
          {activeAdminRoute === 'riders' && <RiderDispatchManager />}
          {activeAdminRoute === 'customers' && <CustomerManager />}
          {activeAdminRoute === 'analytics' && <SalesAnalyticsView />}
          {activeAdminRoute === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

export default App;
