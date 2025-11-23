import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiCheck, FiEdit3 } from 'react-icons/fi';
import AdjustmentModal from '../components/AdjustmentModal';
import { format } from 'date-fns';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdjustment, setEditingAdjustment] = useState(null);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const response = await axios.get('/api/adjustments');
      setAdjustments(response.data);
    } catch (error) {
      console.error('Failed to fetch adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    if (!window.confirm('Apply this adjustment? Stock will be updated.')) return;

    try {
      await axios.post(`/api/adjustments/${id}/apply`);
      fetchAdjustments();
      alert('Adjustment applied successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply adjustment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Stock Adjustments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          New Adjustment
        </button>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : adjustments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiEdit3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No adjustments found. Create a new adjustment to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recorded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Counted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adjustment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {adjustment.productId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {adjustment.warehouseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {adjustment.recordedQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {adjustment.countedQuantity}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      adjustment.adjustment > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {adjustment.adjustment > 0 ? '-' : '+'}{Math.abs(adjustment.adjustment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(adjustment.status)}`}>
                        {adjustment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(adjustment.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {adjustment.status !== 'done' && (
                          <button
                            onClick={() => handleApply(adjustment.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Apply"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AdjustmentModal
          adjustment={editingAdjustment}
          onClose={() => {
            setShowModal(false);
            setEditingAdjustment(null);
            fetchAdjustments();
          }}
        />
      )}
    </div>
  );
}
