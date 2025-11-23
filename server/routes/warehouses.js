import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all warehouses
router.get('/', (req, res) => {
  try {
    res.json(global.warehouses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get warehouse by ID
router.get('/:id', (req, res) => {
  try {
    const warehouse = global.warehouses.find(w => w.id === req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create warehouse
router.post('/', (req, res) => {
  try {
    const { name, location, description } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const warehouse = {
      id: uuidv4(),
      name,
      location,
      description: description || '',
      createdAt: new Date().toISOString(),
      createdBy: req.user.id
    };

    global.warehouses.push(warehouse);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update warehouse
router.put('/:id', (req, res) => {
  try {
    const warehouseIndex = global.warehouses.findIndex(w => w.id === req.params.id);
    if (warehouseIndex === -1) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const updated = {
      ...global.warehouses[warehouseIndex],
      ...req.body,
      id: req.params.id
    };

    global.warehouses[warehouseIndex] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete warehouse
router.delete('/:id', (req, res) => {
  try {
    const warehouseIndex = global.warehouses.findIndex(w => w.id === req.params.id);
    if (warehouseIndex === -1) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    // Check if warehouse has stock
    const hasStock = global.products.some(p => 
      p.stock?.some(s => s.warehouseId === req.params.id && s.quantity > 0)
    );

    if (hasStock) {
      return res.status(400).json({ error: 'Cannot delete warehouse with existing stock' });
    }

    global.warehouses.splice(warehouseIndex, 1);
    res.json({ message: 'Warehouse deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
