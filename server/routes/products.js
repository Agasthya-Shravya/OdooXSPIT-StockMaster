import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, warehouseId, search } = req.query;
    let filtered = [...global.products];

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (warehouseId) {
      filtered = filtered.filter(p => 
        p.stock && p.stock.some(s => s.warehouseId === warehouseId)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower)
      );
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = global.products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/', (req, res) => {
  try {
    const { name, sku, category, unitOfMeasure, description, initialStock } = req.body;

    if (!name || !category || !unitOfMeasure) {
      return res.status(400).json({ error: 'Name, category, and unit of measure are required' });
    }

    const product = {
      id: uuidv4(),
      name,
      sku: sku || `SKU-${Date.now()}`,
      category,
      unitOfMeasure,
      description: description || '',
      stock: initialStock || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    global.products.push(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', (req, res) => {
  try {
    const productIndex = global.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated = {
      ...global.products[productIndex],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    global.products[productIndex] = updated;
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', (req, res) => {
  try {
    const productIndex = global.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    global.products.splice(productIndex, 1);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(global.products.map(p => p.category))].filter(Boolean);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
