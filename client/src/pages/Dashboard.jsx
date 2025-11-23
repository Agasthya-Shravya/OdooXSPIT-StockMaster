import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPackage, FiAlertTriangle, FiInbox, FiTruck, FiRefreshCw, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';
import { WarehouseIllustration, ChartIllustration } from '../components/StockIllustration';
import AnimatedCard from '../components/AnimatedCard';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    documentType: 'all',
    status: 'all',
    warehouse: 'all'
  });

  useEffect(() => {
    fetchKPIs();
  }, [filters.warehouse]);

  const fetchKPIs = async () => {
    try {
      const params = filters.warehouse !== 'all' ? { warehouseId: filters.warehouse } : {};
      const response = await axios.get('/api/dashboard/kpis', { params });
      setKpis(response.data);
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Products in Stock',
      value: kpis?.totalProducts || 0,
      icon: FiPackage,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'primary',
      trend: '+12%'
    },
    {
      title: 'Low Stock Items',
      value: kpis?.lowStockItems || 0,
      icon: FiAlertTriangle,
      gradient: 'from-yellow-500 to-orange-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      borderColor: 'warning',
      trend: 'Needs attention'
    },
    {
      title: 'Out of Stock Items',
      value: kpis?.outOfStockItems || 0,
      icon: FiAlertTriangle,
      gradient: 'from-red-500 to-pink-500',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'danger',
      trend: 'Urgent'
    },
    {
      title: 'Pending Receipts',
      value: kpis?.pendingReceipts || 0,
      icon: FiInbox,
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'success',
      trend: 'Incoming'
    },
    {
      title: 'Pending Deliveries',
      value: kpis?.pendingDeliveries || 0,
      icon: FiTruck,
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'purple',
      trend: 'Outgoing'
    },
    {
      title: 'Scheduled Transfers',
      value: kpis?.pendingTransfers || 0,
      icon: FiRefreshCw,
      gradient: 'from-indigo-500 to-blue-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      borderColor: 'info',
      trend: 'Active'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Illustration */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FiActivity className="animate-pulse" />
                Inventory Dashboard
              </h1>
              <p className="text-primary-100 text-lg">Real-time overview of your stock operations</p>
            </div>
            <div className="hidden md:block w-48 h-48 opacity-20">
              <WarehouseIllustration />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Filters */}
      <AnimatedCard delay={100} className="glass">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">All</option>
              <option value="receipts">Receipts</option>
              <option value="delivery">Delivery</option>
              <option value="internal">Internal Transfers</option>
              <option value="adjustments">Adjustments</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="ready">Ready</option>
              <option value="done">Done</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
            <select
              value={filters.warehouse}
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">All Warehouses</option>
            </select>
          </div>
        </div>
      </AnimatedCard>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <AnimatedCard 
              key={index} 
              delay={index * 100}
              borderColor={kpi.borderColor}
              className="relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${kpi.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-500">{kpi.trend}</span>
                    {kpi.trend.includes('%') && (
                      <FiTrendingUp className="inline-block ml-1 text-green-500" />
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{kpi.title}</p>
                  <p className="text-4xl font-bold text-gray-800 mb-1">{kpi.value}</p>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${kpi.gradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${Math.min((kpi.value / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      {/* Chart Section */}
      <AnimatedCard delay={600} className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <FiTrendingUp />
            Stock Trends
          </h2>
          <p className="text-indigo-100">Visual representation of inventory movements</p>
        </div>
        <div className="p-6">
          <ChartIllustration />
        </div>
      </AnimatedCard>

      {/* Low Stock & Out of Stock Alerts */}
      {(kpis?.details?.lowStockItems?.length > 0 || kpis?.details?.outOfStockItems?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {kpis.details.lowStockItems.length > 0 && (
            <AnimatedCard delay={700} borderColor="warning" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <FiAlertTriangle className="text-yellow-600 w-6 h-6" />
                  </div>
                  Low Stock Items
                </h2>
                <div className="space-y-3">
                  {kpis.details.lowStockItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 group-hover:text-yellow-700">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-700 font-bold text-lg">{item.stockQuantity}</span>
                        <span className="text-xs text-gray-500">units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}

          {kpis.details.outOfStockItems.length > 0 && (
            <AnimatedCard delay={800} borderColor="danger" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <FiAlertTriangle className="text-red-600 w-6 h-6 animate-pulse" />
                  </div>
                  Out of Stock Items
                </h2>
                <div className="space-y-3">
                  {kpis.details.outOfStockItems.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 group-hover:text-red-700">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.sku}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-700 font-bold text-lg">0</span>
                        <span className="text-xs text-gray-500">units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}
        </div>
      )}
    </div>
  );
}