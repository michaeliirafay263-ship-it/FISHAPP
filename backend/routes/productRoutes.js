import express from 'express';
import { fishStore } from '../data/store.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/products — Public/Customer/Admin catalog
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: fishStore
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const fish = fishStore.find((f) => f.id === req.params.id);
  if (!fish) return res.status(404).json({ success: false, error: 'Fish species not found' });
  res.json({ success: true, data: fish });
});

// POST /api/products — Admin Only (Add new fish)
router.post('/', verifyRole(['admin']), (req, res) => {
  const newFish = {
    id: `fish-${Date.now()}`,
    ...req.body,
    inStock: Number(req.body.stockKg) > 0
  };
  fishStore.unshift(newFish);
  res.status(201).json({ success: true, data: newFish });
});

// PATCH /api/products/:id/daily-price — Admin Only (Update price and stock)
router.patch('/:id/daily-price', verifyRole(['admin']), (req, res) => {
  const { pricePerKg, stockKg, inStock } = req.body;
  const index = fishStore.findIndex((f) => f.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Fish species not found' });
  }

  fishStore[index] = {
    ...fishStore[index],
    ...(pricePerKg !== undefined && { pricePerKg: Number(pricePerKg) }),
    ...(stockKg !== undefined && { stockKg: Number(stockKg) }),
    ...(inStock !== undefined && { inStock: Boolean(inStock) })
  };

  res.json({ success: true, data: fishStore[index] });
});

export default router;
