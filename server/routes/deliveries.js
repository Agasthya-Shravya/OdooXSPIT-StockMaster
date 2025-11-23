import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all deliveries
router.get('/', (req, res) => {
  try {
    const { status, warehouseId } = req.query;
    let filtered = [...global.deliveries];

    if (status) {
      filtered = filtered.filter(d => d.status === status);
    }

    if (warehouseId) {
      filtered = filtered.filter(d => d.warehouseId === warehouseId);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get delivery by ID
router.get('/:id', (req, res) => {
  try {
    const delivery = global.deliveries.find(d => d.id === req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create delivery
router.post('/', (req, res) => {
  try {
    const { customer, warehouseId, items, notes } = req.body;

    if (!customer || !warehouseId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer, warehouse, and items are required' });
    }

    const delivery = {
      id: uuidv4(),
      customer,
      warehouseId,
      items,
      notes: notes || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    global.deliveries.push(delivery);
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery
router.put('/:id', (req, res) => {
  try {
    const deliveryIndex = global.deliveries.findIndex(d => d.id === req.params.id);
    if (deliveryIndex === -1) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const updated = {
      ...global.deliveries[deliveryIndex],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    global.deliveries[deliveryIndex] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate delivery (decrease stock)
router.post('/:id/validate', (req, res) => {
  try {
    const deliveryIndex = global.deliveries.findIndex(d => d.id === req.params.id);
    if (deliveryIndex === -1) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const delivery = global.deliveries[deliveryIndex];
    if (delivery.status === 'done') {
      return res.status(400).json({ error: 'Delivery already validated' });
    }

    // Check stock availability and update
    for (const item of delivery.items) {
      const product = global.products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      const stockEntry = product.stock?.find(s => s.warehouseId === delivery.warehouseId);
      if (!stockEntry || stockEntry.quantity < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ${product.name}` 
        });
      }

      stockEntry.quantity -= item.quantity;

      // Add to ledger
      global.ledger.push({
        id: uuidv4(),
        type: 'delivery',
        documentId: delivery.id,
        productId: item.productId,
        warehouseId: delivery.warehouseId,
        quantity: -item.quantity,
        date: new Date().toISOString(),
        userId: req.user.id
      });
    }

    delivery.status = 'done';
    delivery.validatedAt = new Date().toISOString();
    delivery.validatedBy = req.user.id;

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
