import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiCheck, FiX, FiSearch, FiPackage, FiInbox } from 'react-icons/fi';
import ReceiptModal from '../components/ReceiptModal';
import { format } from 'date-fns';
import AnimatedCard from '../components/AnimatedCard';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);
  const [filters, setFilters] = useState({ status: '', warehouse: '' });

  useEffect(() => {
    fetchReceipts();
  }, [filters]);

  const fetchReceipts = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.warehouse) params.warehouseId = filters.warehouse;

      const response = await axios.get('/api/receipts', { params });
      setReceipts(response.data);
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    if (!window.confirm('Validate this receipt? Stock will be updated.')) return;

    try {
      await axios.post(`/api/receipts/${id}/validate`);
      fetchReceipts();
      alert('Receipt validated successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to validate receipt');
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiInbox className="w-8 h-8" />
                </div>
                Receipts (Incoming Goods)
              </h1>
              <p className="text-green-100">Manage incoming stock from suppliers</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <FiPlus className="w-5 h-5" />
              New Receipt
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Filters */}
      <AnimatedCard delay={100} className="glass">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="waiting">Waiting</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </AnimatedCard>

      {/* Receipts Table */}
      <AnimatedCard delay={200} className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : receipts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No receipts found. Create a new receipt to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {receipt.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.supplier}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {receipt.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(receipt.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {receipt.status !== 'done' && receipt.status !== 'canceled' && (
                          <button
                            onClick={() => handleValidate(receipt.id)}
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
      </AnimatedCard>

      {showModal && (
        <ReceiptModal
          receipt={editingReceipt}
          onClose={() => {
            setShowModal(false);
            setEditingReceipt(null);
            fetchReceipts();
          }}
        />
      )}
    </div>
  );
}
