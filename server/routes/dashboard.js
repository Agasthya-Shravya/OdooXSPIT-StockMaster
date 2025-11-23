import express from 'express';

const router = express.Router();

// Get dashboard KPIs
router.get('/kpis', (req, res) => {
  try {
    const { warehouseId } = req.query;

    // Total products in stock
    let totalProducts = 0;
    global.products.forEach(product => {
      if (warehouseId) {
        const stock = product.stock?.find(s => s.warehouseId === warehouseId);
        if (stock && stock.quantity > 0) totalProducts++;
      } else {
        const hasStock = product.stock?.some(s => s.quantity > 0);
        if (hasStock) totalProducts++;
      }
    });

    // Low stock items (assuming threshold of 10)
    let lowStockItems = [];
    let outOfStockItems = [];
    global.products.forEach(product => {
      if (warehouseId) {
        const stock = product.stock?.find(s => s.warehouseId === warehouseId);
        const qty = stock?.quantity || 0;
        if (qty === 0) {
          outOfStockItems.push({ ...product, stockQuantity: qty });
        } else if (qty < 10) {
          lowStockItems.push({ ...product, stockQuantity: qty });
        }
      } else {
        product.stock?.forEach(stock => {
          if (stock.quantity === 0) {
            outOfStockItems.push({ ...product, warehouseId: stock.warehouseId, stockQuantity: 0 });
          } else if (stock.quantity < 10) {
            lowStockItems.push({ ...product, warehouseId: stock.warehouseId, stockQuantity: stock.quantity });
          }
        });
      }
    });

    // Pending receipts
    const pendingReceipts = global.receipts.filter(r => 
      r.status !== 'done' && r.status !== 'canceled' &&
      (!warehouseId || r.warehouseId === warehouseId)
    ).length;

    // Pending deliveries
    const pendingDeliveries = global.deliveries.filter(d => 
      d.status !== 'done' && d.status !== 'canceled' &&
      (!warehouseId || d.warehouseId === warehouseId)
    ).length;

    // Pending transfers
    const pendingTransfers = global.transfers.filter(t => 
      t.status !== 'done' && t.status !== 'canceled' &&
      (!warehouseId || t.fromWarehouseId === warehouseId || t.toWarehouseId === warehouseId)
    ).length;

    res.json({
      totalProducts,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers,
      details: {
        lowStockItems: lowStockItems.slice(0, 10),
        outOfStockItems: outOfStockItems.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent activity
router.get('/recent-activity', (req, res) => {
  try {
    const recentLedger = [...global.ledger]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    res.json(recentLedger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
