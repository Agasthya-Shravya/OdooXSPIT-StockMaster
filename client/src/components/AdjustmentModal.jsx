import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

export default function AdjustmentModal({ adjustment, onClose }) {
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    countedQuantity: 0,
    reason: ''
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [recordedQuantity, setRecordedQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (formData.productId && formData.warehouseId) {
      fetchRecordedQuantity();
    }
  }, [formData.productId, formData.warehouseId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/api/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const fetchRecordedQuantity = async () => {
    try {
      const response = await axios.get(`/api/products/${formData.productId}`);
      const product = response.data;
      const stock = product.stock?.find(s => s.warehouseId === formData.warehouseId);
      setRecordedQuantity(stock?.quantity || 0);
    } catch (error) {
      setRecordedQuantity(0);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.productId || !formData.warehouseId || formData.countedQuantity === undefined) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/adjustments', formData);
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create adjustment');
    } finally {
      setLoading(false);
    }
  };

  const adjustmentValue = recordedQuantity - parseFloat(formData.countedQuantity || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">New Stock Adjustment</h2>
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
                Product *
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warehouse *
              </label>
              <select
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select warehouse</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.id}>
                    {wh.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recorded Quantity
                </label>
                <input
                  type="number"
                  value={recordedQuantity}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Counted Quantity *
                </label>
                <input
                  type="number"
                  name="countedQuantity"
                  value={formData.countedQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjustment
              </label>
              <input
                type="text"
                value={`${adjustmentValue > 0 ? '-' : '+'}${Math.abs(adjustmentValue)}`}
                disabled
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white font-semibold ${
                  adjustmentValue > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Physical count discrepancy, damaged items"
            />
          </div>

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
              {loading ? 'Creating...' : 'Create Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
