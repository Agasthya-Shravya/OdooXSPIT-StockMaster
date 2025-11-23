import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all adjustments
router.get('/', (req, res) => {
  try {
    const { warehouseId, productId } = req.query;
    let filtered = [...global.adjustments];

    if (warehouseId) {
      filtered = filtered.filter(a => a.warehouseId === warehouseId);
    }

    if (productId) {
      filtered = filtered.filter(a => a.productId === productId);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get adjustment by ID
router.get('/:id', (req, res) => {
  try {
    const adjustment = global.adjustments.find(a => a.id === req.params.id);
    if (!adjustment) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }
    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create adjustment
router.post('/', (req, res) => {
  try {
    const { productId, warehouseId, countedQuantity, reason } = req.body;

    if (!productId || !warehouseId || countedQuantity === undefined) {
      return res.status(400).json({ error: 'Product, warehouse, and counted quantity are required' });
    }

    const product = global.products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const stockEntry = product.stock?.find(s => s.warehouseId === warehouseId);
    const recordedQuantity = stockEntry?.quantity || 0;
    const adjustment = recordedQuantity - countedQuantity;

    const adjustmentRecord = {
      id: uuidv4(),
      productId,
      warehouseId,
      recordedQuantity,
      countedQuantity,
      adjustment,
      reason: reason || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    global.adjustments.push(adjustmentRecord);
    res.status(201).json(adjustmentRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply adjustment (update stock)
router.post('/:id/apply', (req, res) => {
  try {
    const adjustmentIndex = global.adjustments.findIndex(a => a.id === req.params.id);
    if (adjustmentIndex === -1) {
      return res.status(404).json({ error: 'Adjustment not found' });
    }

    const adjustment = global.adjustments[adjustmentIndex];
    if (adjustment.status === 'done') {
      return res.status(400).json({ error: 'Adjustment already applied' });
    }

    const product = global.products.find(p => p.id === adjustment.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update stock
    const stockEntry = product.stock?.find(s => s.warehouseId === adjustment.warehouseId);
    if (stockEntry) {
      stockEntry.quantity = adjustment.countedQuantity;
    } else {
      if (!product.stock) product.stock = [];
      product.stock.push({
        warehouseId: adjustment.warehouseId,
        quantity: adjustment.countedQuantity
      });
    }

    // Add to ledger
    global.ledger.push({
      id: uuidv4(),
      type: 'adjustment',
      documentId: adjustment.id,
      productId: adjustment.productId,
      warehouseId: adjustment.warehouseId,
      quantity: -adjustment.adjustment,
      date: new Date().toISOString(),
      userId: req.user.id
    });

    adjustment.status = 'done';
    adjustment.appliedAt = new Date().toISOString();
    adjustment.appliedBy = req.user.id;

    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
