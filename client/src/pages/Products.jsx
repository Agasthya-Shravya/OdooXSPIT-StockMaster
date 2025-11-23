import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiBox, FiTrendingUp } from 'react-icons/fi';
import ProductModal from '../components/ProductModal';
import AnimatedCard from '../components/AnimatedCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    fetchCategories();
  }, [categoryFilter, warehouseFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (warehouseFilter) params.warehouseId = warehouseFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
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

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const getStockQuantity = (product, warehouseId) => {
    if (!product.stock) return 0;
    const stock = product.stock.find(s => s.warehouseId === warehouseId);
    return stock ? stock.quantity : 0;
  };

  const getTotalStock = (product) => {
    if (!product.stock) return 0;
    return product.stock.reduce((sum, s) => sum + s.quantity, 0);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (quantity < 10) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiPackage className="w-8 h-8" />
                </div>
                Product Management
              </h1>
              <p className="text-blue-100">Manage your inventory products and stock levels</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <FiPlus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedCard delay={100} borderColor="info" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiBox className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{products.length}</p>
          <p className="text-sm text-gray-600">Total Products</p>
        </AnimatedCard>
        
        <AnimatedCard delay={200} borderColor="success" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
          <p className="text-sm text-gray-600">Categories</p>
        </AnimatedCard>
        
        <AnimatedCard delay={300} borderColor="warning" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <FiPackage className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{warehouses.length}</p>
          <p className="text-sm text-gray-600">Warehouses</p>
        </AnimatedCard>
      </div>

      {/* Filters */}
      <AnimatedCard delay={400} className="glass">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>
      </AnimatedCard>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <AnimatedCard delay={500} className="text-center py-12">
          <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No products found. Add your first product to get started.</p>
        </AnimatedCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const totalStock = getTotalStock(product);
            const status = getStockStatus(totalStock);
            return (
              <AnimatedCard 
                key={product.id} 
                delay={500 + index * 50}
                borderColor={totalStock === 0 ? 'danger' : totalStock < 10 ? 'warning' : 'success'}
                className="group hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-primary-100 rounded-lg group-hover:scale-110 transition-transform">
                        <FiPackage className="w-5 h-5 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">SKU: {product.sku}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                )}

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Stock</span>
                    <span className="text-2xl font-bold text-gray-800">{totalStock}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        totalStock === 0 ? 'bg-red-500' : totalStock < 10 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((totalStock / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          warehouses={warehouses}
        />
      )}
    </div>
  );
}