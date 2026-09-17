import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAppProvider } from './context/CustomerAppContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CustomerAppProvider>
          <App />
        </CustomerAppProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);
