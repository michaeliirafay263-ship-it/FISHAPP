import express from 'express';
import { customersStore, ridersStore } from '../data/store.js';

const router = express.Router();

// 1. Customer Authentication (Phone / Demo OTP)
router.post('/customer/login', (req, res) => {
  const { phone, name } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  let customer = customersStore.find((c) => c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
  if (!customer) {
    customer = {
      id: `cust-${Date.now()}`,
      name: name || 'Valued Customer',
      phone,
      userType: 'Household',
      ward: 'Mikocheni A & B',
      address: 'Dar es Salaam',
      totalOrders: 0,
      totalSpent: 0
    };
    customersStore.push(customer);
  }

  res.json({
    success: true,
    user: {
      ...customer,
      role: 'customer',
      token: `cust_token_${customer.id}_${Date.now()}`
    }
  });
});

// 2. Rider Authentication (Phone / PIN)
router.post('/rider/login', (req, res) => {
  const { phone, pin } = req.body;
  const normalizedPhone = (phone || '').replace(/[\s\-\+]/g, '');

  const rider = ridersStore.find((r) => r.phone.replace(/[\s\-\+]/g, '').includes(normalizedPhone) || r.id === phone);
  if (!rider) {
    return res.status(401).json({ success: false, error: 'Rider phone number not registered in Kivukoni fleet' });
  }

  res.json({
    success: true,
    user: {
      ...rider,
      role: 'rider',
      token: `rider_token_${rider.id}_${Date.now()}`
    }
  });
});

// 3. Admin Authentication (Email & Password)
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@samakifresh.co.tz' && (password === 'Admin@2026' || password === 'admin123' || password === 'admin')) {
    return res.json({
      success: true,
      user: {
        id: 'admin-1',
        name: 'Michaeli (Kivukoni Hub Admin)',
        email: 'admin@samakifresh.co.tz',
        role: 'admin',
        permissions: ['all'],
        token: `admin_jwt_${Date.now()}`
      }
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid admin credentials. Use admin@samakifresh.co.tz / Admin@2026 for demo access.'
  });
});

export default router;
