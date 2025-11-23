import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiCheck, FiSearch, FiTruck } from 'react-icons/fi';
import DeliveryModal from '../components/DeliveryModal';
import { format } from 'date-fns';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [filters, setFilters] = useState({ status: '', warehouse: '' });

  useEffect(() => {
    fetchDeliveries();
  }, [filters]);

  const fetchDeliveries = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.warehouse) params.warehouseId = filters.warehouse;

      const response = await axios.get('/api/deliveries', { params });
      setDeliveries(response.data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    if (!window.confirm('Validate this delivery? Stock will be decreased.')) return;

    try {
      await axios.post(`/api/deliveries/${id}/validate`);
      fetchDeliveries();
      alert('Delivery validated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to validate delivery');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Delivery Orders (Outgoing Goods)</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          New Delivery
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="waiting">Waiting</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiTruck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No deliveries found. Create a new delivery order to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {delivery.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {delivery.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {delivery.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(delivery.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {delivery.status !== 'done' && delivery.status !== 'canceled' && (
                          <button
                            onClick={() => handleValidate(delivery.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Validate"
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
        <DeliveryModal
          delivery={editingDelivery}
          onClose={() => {
            setShowModal(false);
            setEditingDelivery(null);
            fetchDeliveries();
          }}
        />
      )}
    </div>
  );
}
