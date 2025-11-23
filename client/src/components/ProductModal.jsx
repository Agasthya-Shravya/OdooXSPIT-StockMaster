import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

export default function ProductModal({ product, onClose, warehouses }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitOfMeasure: '',
    description: '',
    initialStock: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        unitOfMeasure: product.unitOfMeasure || '',
        description: product.description || '',
        initialStock: warehouses.map(wh => ({
          warehouseId: wh.id,
          quantity: product.stock?.find(s => s.warehouseId === wh.id)?.quantity || 0
        }))
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        unitOfMeasure: '',
        description: '',
        initialStock: warehouses.map(wh => ({ warehouseId: wh.id, quantity: 0 }))
      });
    }
  }, [product, warehouses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStockChange = (warehouseId, quantity) => {
    setFormData({
      ...formData,
      initialStock: formData.initialStock.map(s =>
        s.warehouseId === warehouseId ? { ...s, quantity: parseFloat(quantity) || 0 } : s
      )
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (product) {
        await axios.put(`/api/products/${product.id}`, formData);
      } else {
        const initialStock = formData.initialStock.filter(s => s.quantity > 0);
        await axios.post('/api/products', {
          ...formData,
          initialStock: initialStock.length > 0 ? initialStock : undefined
        });
      }
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU / Code</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Electronics, Furniture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit of Measure *
              </label>
              <input
                type="text"
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., kg, pcs, boxes"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {!product && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Stock (Optional)
              </label>
              <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                {warehouses.map((warehouse) => {
                  const stock = formData.initialStock.find(s => s.warehouseId === warehouse.id);
                  return (
                    <div key={warehouse.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{warehouse.name}:</span>
                      <input
                        type="number"
                        min="0"
                        value={stock?.quantity || 0}
                        onChange={(e) => handleStockChange(warehouse.id, e.target.value)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
