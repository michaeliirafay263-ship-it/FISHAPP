import express from 'express';
import { ordersStore, fishStore, ridersStore } from '../data/store.js';
import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/orders — List all orders (Admin or Rider filter)
router.get('/', (req, res) => {
  const { riderId, customerPhone, status } = req.query;

  let results = [...ordersStore];

  if (riderId) {
    results = results.filter((o) => o.assignedRiderId === riderId);
  }
  if (customerPhone) {
    results = results.filter((o) => o.customerPhone.replace(/\s+/g, '').includes(customerPhone.replace(/\s+/g, '')));
  }
  if (status) {
    results = results.filter((o) => o.status === status);
  }

  res.json({ success: true, count: results.length, data: results });
});

// GET /api/orders/:id — Specific order tracking
router.get('/:id', (req, res) => {
  const order = ordersStore.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
  res.json({ success: true, data: order });
});

// POST /api/orders — Customer creates order
router.post('/', (req, res) => {
  const payload = req.body;
  const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newOrder = {
    id: newOrderId,
    customerName: payload.customerName || 'Customer',
    customerPhone: payload.customerPhone || '0754 000 000',
    customerType: payload.customerType || 'Household',
    items: payload.items || [],
    itemsSubtotal: payload.itemsSubtotal || 0,
    coldChainFee: payload.coldChainFee || 1500,
    deliveryFee: payload.deliveryFee || 3500,
    grandTotal: payload.grandTotal || 0,
    ward: payload.ward || 'Mikocheni',
    exactAddress: payload.exactAddress || 'Dar es Salaam',
    deliveryTimeSlot: payload.deliveryTimeSlot || '08:30 - 11:30',
    paymentMethod: payload.paymentMethod || 'M-Pesa (Vodacom)',
    paymentStatus: payload.paymentMethod?.includes('Cash') ? 'PENDING_COD' : 'PAID',
    paymentRef: `${(payload.paymentMethod || 'MPESA').split(' ')[0].toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'received',
    createdAt: new Date().toISOString(),
    statusHistory: [
      {
        status: 'received',
        time: timeStr,
        label: 'Order placed and confirmed'
      }
    ],
    assignedRiderId: null,
    riderNotes: payload.notes || '',
    freshnessRating: null
  };

  ordersStore.unshift(newOrder);

  res.status(201).json({ success: true, data: newOrder });
});

// PATCH /api/orders/:id/status — Update order progression (Rider / Admin)
router.patch('/:id/status', verifyRole(['admin', 'rider']), (req, res) => {
  const { status, riderId, note } = req.body;
  const index = ordersStore.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updatedHistory = [
    ...ordersStore[index].statusHistory,
    { status, time: timeStr, label: note || `Order updated to ${status}` }
  ];

  ordersStore[index] = {
    ...ordersStore[index],
    status,
    ...(riderId !== undefined && { assignedRiderId: riderId }),
    ...(note && { riderNotes: note }),
    statusHistory: updatedHistory
  };

  res.json({ success: true, data: ordersStore[index] });
});

// PATCH /api/orders/:id/assign-rider — Admin assigns rider
router.patch('/:id/assign-rider', verifyRole(['admin']), (req, res) => {
  const { riderId } = req.body;
  const index = ordersStore.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  ordersStore[index].assignedRiderId = riderId;
  res.json({ success: true, data: ordersStore[index] });
});

// POST /api/orders/:id/rate — Customer rates freshness
router.post('/:id/rate', (req, res) => {
  const { rating, feedback } = req.body;
  const index = ordersStore.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  ordersStore[index].freshnessRating = rating;
  ordersStore[index].feedbackText = feedback;

  res.json({ success: true, data: ordersStore[index] });
});

export default router;
