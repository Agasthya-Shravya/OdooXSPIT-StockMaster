import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all transfers
router.get('/', (req, res) => {
  try {
    const { status, fromWarehouse, toWarehouse } = req.query;
    let filtered = [...global.transfers];

    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }

    if (fromWarehouse) {
      filtered = filtered.filter(t => t.fromWarehouseId === fromWarehouse);
    }

    if (toWarehouse) {
      filtered = filtered.filter(t => t.toWarehouseId === toWarehouse);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transfer by ID
router.get('/:id', (req, res) => {
  try {
    const transfer = global.transfers.find(t => t.id === req.params.id);
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transfer
router.post('/', (req, res) => {
  try {
    const { fromWarehouseId, toWarehouseId, items, notes } = req.body;

    if (!fromWarehouseId || !toWarehouseId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Warehouses and items are required' });
    }

    if (fromWarehouseId === toWarehouseId) {
      return res.status(400).json({ error: 'Source and destination warehouses must be different' });
    }

    const transfer = {
      id: uuidv4(),
      fromWarehouseId,
      toWarehouseId,
      items,
      notes: notes || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    global.transfers.push(transfer);
    res.status(201).json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update transfer
router.put('/:id', (req, res) => {
  try {
    const transferIndex = global.transfers.findIndex(t => t.id === req.params.id);
    if (transferIndex === -1) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    const updated = {
      ...global.transfers[transferIndex],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    global.transfers[transferIndex] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate transfer (move stock)
router.post('/:id/validate', (req, res) => {
  try {
    const transferIndex = global.transfers.findIndex(t => t.id === req.params.id);
    if (transferIndex === -1) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    const transfer = global.transfers[transferIndex];
    if (transfer.status === 'done') {
      return res.status(400).json({ error: 'Transfer already validated' });
    }

    // Check stock availability and transfer
    for (const item of transfer.items) {
      const product = global.products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      // Check source warehouse stock
      const fromStock = product.stock?.find(s => s.warehouseId === transfer.fromWarehouseId);
      if (!fromStock || fromStock.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock in source warehouse for product ${product.name}` 
        });
      }

      // Decrease from source
      fromStock.quantity -= item.quantity;

      // Increase in destination
      const toStock = product.stock?.find(s => s.warehouseId === transfer.toWarehouseId);
      if (toStock) {
        toStock.quantity += item.quantity;
      } else {
        if (!product.stock) product.stock = [];
        product.stock.push({
          warehouseId: transfer.toWarehouseId,
          quantity: item.quantity
        });
      }

      // Add to ledger (two entries: out and in)
      global.ledger.push({
        id: uuidv4(),
        type: 'transfer',
        documentId: transfer.id,
        productId: item.productId,
        warehouseId: transfer.fromWarehouseId,
        quantity: -item.quantity,
        date: new Date().toISOString(),
        userId: req.user.id
      });

      global.ledger.push({
        id: uuidv4(),
        type: 'transfer',
        documentId: transfer.id,
        productId: item.productId,
        warehouseId: transfer.toWarehouseId,
        quantity: item.quantity,
        date: new Date().toISOString(),
        userId: req.user.id
      });
    }

    transfer.status = 'done';
    transfer.validatedAt = new Date().toISOString();
    transfer.validatedBy = req.user.id;

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
