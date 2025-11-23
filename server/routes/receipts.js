import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all receipts
router.get('/', (req, res) => {
  try {
    const { status, warehouseId } = req.query;
    let filtered = [...global.receipts];

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    if (warehouseId) {
      filtered = filtered.filter(r => r.warehouseId === warehouseId);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get receipt by ID
router.get('/:id', (req, res) => {
  try {
    const receipt = global.receipts.find(r => r.id === req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create receipt
router.post('/', (req, res) => {
  try {
    const { supplier, warehouseId, items, notes } = req.body;

    if (!supplier || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Supplier, warehouse, and items are required' });
    }

    const receipt = {
      id: uuidv4(),
      supplier,
      warehouseId,
      items,
      notes: notes || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    global.receipts.push(receipt);
    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update receipt
router.put('/:id', (req, res) => {
  try {
    const receiptIndex = global.receipts.findIndex(r => r.id === req.params.id);
    if (receiptIndex === -1) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const updated = {
      ...global.receipts[receiptIndex],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    global.receipts[receiptIndex] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate receipt (update stock)
router.post('/:id/validate', (req, res) => {
  try {
    const receiptIndex = global.receipts.findIndex(r => r.id === req.params.id);
    if (receiptIndex === -1) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const receipt = global.receipts[receiptIndex];
    if (receipt.status === 'done') {
      return res.status(400).json({ error: 'Receipt already validated' });
    }

    // Update stock for each item
    receipt.items.forEach(item => {
      const product = global.products.find(p => p.id === item.productId);
      if (product) {
        const stockEntry = product.stock?.find(s => s.warehouseId === receipt.warehouseId);
        
        if (stockEntry) {
          stockEntry.quantity += item.quantity;
        } else {
          if (!product.stock) product.stock = [];
          product.stock.push({
            warehouseId: receipt.warehouseId,
            quantity: item.quantity
          });
        }

        // Add to ledger
        global.ledger.push({
          id: uuidv4(),
          type: 'receipt',
          documentId: receipt.id,
          productId: item.productId,
          warehouseId: receipt.warehouseId,
          quantity: item.quantity,
          date: new Date().toISOString(),
          userId: req.user.id
        });
      }
    });

    receipt.status = 'done';
    receipt.validatedAt = new Date().toISOString();
    receipt.validatedBy = req.user.id;

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
