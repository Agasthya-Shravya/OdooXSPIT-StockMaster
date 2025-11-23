import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

export default function Profile() {
  const { user } = useAuth();

  const getRoleLabel = (role) => {
    switch (role) {
      case 'inventory_manager': return 'Inventory Manager';
      case 'warehouse_staff': return 'Warehouse Staff';
      default: return role;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <FiUser className="w-12 h-12 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
            <p className="text-gray-600">{getRoleLabel(user?.role)}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <FiMail className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-800">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <FiShield className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-lg font-medium text-gray-800">{getRoleLabel(user?.role)}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Profile editing functionality can be added here. 
            Contact your administrator to update your profile information.
          </p>
        </div>
      </div>
    </div>
  );
}
