import express from 'express';

const router = express.Router();

// Get ledger entries (move history)
router.get('/', (req, res) => {
  try {
    const { productId, warehouseId, type, startDate, endDate } = req.query;
    let filtered = [...global.ledger];

    if (productId) {
      filtered = filtered.filter(l => l.productId === productId);
    }

    if (warehouseId) {
      filtered = filtered.filter(l => l.warehouseId === warehouseId);
    }

    if (type) {
      filtered = filtered.filter(l => l.type === type);
    }

    if (startDate) {
      filtered = filtered.filter(l => new Date(l.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(l => new Date(l.date) <= new Date(endDate));
    }

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ledger for specific product
router.get('/product/:productId', (req, res) => {
  try {
    const entries = global.ledger
      .filter(l => l.productId === req.params.productId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
