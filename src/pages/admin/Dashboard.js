// src/pages/admin/Dashboard.js
import React, { useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Store, 
  Package, 
  Users, 
  LogOut, 
  ChevronDown, 
  Settings 
} from 'lucide-react';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import { auth } from '../../firebase/config';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { 
      icon: Store, 
      label: 'Products', 
      path: '/admin/products' 
    },
    { 
      icon: Package, 
      label: 'Orders', 
      path: '/admin/orders' 
    },
    { 
      icon: Users, 
      label: 'Users', 
      path: '/admin/users' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-b px-4`}>
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <h1 className="text-lg font-light">Admin Dashboard</h1>
          
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 opacity-70 hover:opacity-100"
            >
              <span>{user?.email}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-48 py-2 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } rounded-md shadow-lg`}>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar and Content */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className={`fixed w-64 h-full ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } border-r`}>
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg ${
                  location.pathname === item.path
                    ? isDark ? 'bg-gray-800' : 'bg-gray-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                } mb-1`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <Routes>
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;