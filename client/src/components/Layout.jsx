import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome,
  FiPackage,
  FiInbox,
  FiTruck,
  FiRefreshCw,
  FiEdit3,
  FiFileText,
  FiSettings,
  FiUser,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/products', label: 'Products', icon: FiPackage },
    { path: '/receipts', label: 'Receipts', icon: FiInbox },
    { path: '/deliveries', label: 'Delivery Orders', icon: FiTruck },
    { path: '/transfers', label: 'Internal Transfers', icon: FiRefreshCw },
    { path: '/adjustments', label: 'Adjustments', icon: FiEdit3 },
    { path: '/ledger', label: 'Move History', icon: FiFileText },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  // Add Users menu item only for admins
  if (user?.role === 'inventory_manager') {
    navItems.push({ path: '/users', label: 'Users', icon: FiUsers });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden fixed md:static md:translate-x-0 h-full z-30`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-600 to-indigo-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FiPackage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">StockMaster</h1>
                <p className="text-xs text-primary-100">Inventory System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/' 
                  ? location.pathname === '/'
                  : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-medium shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gray-50 hover:transform hover:translate-x-1'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <NavLink
              to="/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 mb-2"
            >
              <FiUser className="w-5 h-5" />
              <span>My Profile</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
            <div className="mt-4 px-4 py-2 text-sm text-gray-500">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden transition-colors"
          >
            {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.name || 'Inventory Management'}
              </h2>
              <p className="text-xs text-gray-500">{user?.role === 'inventory_manager' ? 'Inventory Manager' : 'Warehouse Staff'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
