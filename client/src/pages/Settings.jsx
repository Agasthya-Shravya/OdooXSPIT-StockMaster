import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';
import WarehouseModal from '../components/WarehouseModal';

export default function Settings() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/api/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      await axios.delete(`/api/warehouses/${id}`);
      fetchWarehouses();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete warehouse');
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWarehouse(null);
    fetchWarehouses();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Settings - Warehouses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Add Warehouse
        </button>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">Loading...</div>
        ) : warehouses.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <FiMapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No warehouses found. Add your first warehouse to get started.</p>
          </div>
        ) : (
          warehouses.map((warehouse) => (
            <div key={warehouse.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{warehouse.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    {warehouse.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(warehouse)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(warehouse.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {warehouse.description && (
                <p className="text-sm text-gray-600 mb-4">{warehouse.description}</p>
              )}
              <p className="text-xs text-gray-400">
                Created: {new Date(warehouse.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <WarehouseModal
          warehouse={editingWarehouse}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
