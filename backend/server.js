import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import riderRoutes from './routes/riderRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for customer app (5174) and admin app (5175)
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', riderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Samaki Fresh Dar es Salaam API',
    time: new Date().toISOString(),
    endpoints: [
      '/api/auth/customer/login',
      '/api/auth/rider/login',
      '/api/auth/admin/login',
      '/api/products',
      '/api/orders',
      '/api/riders',
      '/api/customers'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🐟 Samaki Fresh Backend API running on http://localhost:${PORT}`);
});
