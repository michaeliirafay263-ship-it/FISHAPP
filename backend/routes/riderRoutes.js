import express from 'express';
import { ridersStore, customersStore } from '../data/store.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/riders — List riders
router.get('/riders', (req, res) => {
  res.json({ success: true, data: ridersStore });
});

// GET /api/riders/:id
router.get('/riders/:id', (req, res) => {
  const rider = ridersStore.find((r) => r.id === req.params.id);
  if (!rider) return res.status(404).json({ success: false, error: 'Rider not found' });
  res.json({ success: true, data: rider });
});

// GET /api/customers — List customers (Admin only)
router.get('/customers', verifyRole(['admin']), (req, res) => {
  res.json({ success: true, data: customersStore });
});

export default router;
