// src/pages/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { 
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Ban,
  CheckCircle
} from 'lucide-react';

function UserManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filterStatus]);

  const fetchUsers = async () => {
    try {
      let usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );

      if (filterStatus !== 'all') {
        usersQuery = query(
          collection(db, 'users'),
          where('status', '==', filterStatus),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(usersQuery);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: newStatus,
        updatedAt: new Date()
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const viewUserOrders = async (userId) => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(ordersQuery);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSelectedUser({ ...users.find(u => u.id === userId), orders });
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light">Users</h2>
        
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`pl-4 pr-10 py-2 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } border border-gray-200 dark:border-gray-700 rounded-lg`}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="grid gap-6">
        {users.map(user => (
          <div
            key={user.id}
            className={`${
              isDark ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow p-6`}
          >
            <div className="flex justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  isDark ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <div className="flex items-center space-x-2 text-sm opacity-70">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm opacity-70 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt.toDate()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => viewUserOrders(user.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orders</span>
                </button>

                {user.status === 'active' ? (
                  <button
                    onClick={() => updateUserStatus(user.id, 'blocked')}
                    className="flex items-center space-x-2 px-4 py-2 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Ban className="h-4 w-4" />
                    <span>Block</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateUserStatus(user.id, 'active')}
                    className="flex items-center space-x-2 px-4 py-2 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Activate</span>
                  </button>
                )}
              </div>
            </div>

            {selectedUser?.id === user.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-4">Order History</h4>
                {selectedUser.orders.length > 0 ? (
                  <div className="space-y-4">
                    {selectedUser.orders.map(order => (
                      <div
                        key={order.id}
                        className={`p-4 rounded-lg ${
                          isDark ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm opacity-70">
                            {new Date(order.createdAt.toDate()).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{order.total.toFixed(2)}</p>
                            <span className={`text-sm ${
                              order.status === 'delivered' ? 'text-green-500' :
                              order.status === 'cancelled' ? 'text-red-500' :
                              'text-yellow-500'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-4 space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-70">No orders found for this user.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow p-6`}>
          <h4 className="text-sm uppercase tracking-wider opacity-70 mb-2">Total Users</h4>
          <p className="text-3xl font-light">{users.length}</p>
        </div>

        <div className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow p-6`}>
          <h4 className="text-sm uppercase tracking-wider opacity-70 mb-2">Active Users</h4>
          <p className="text-3xl font-light">
            {users.filter(user => user.status === 'active').length}
          </p>
        </div>

        <div className={`${
          isDark ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow p-6`}>
          <h4 className="text-sm uppercase tracking-wider opacity-70 mb-2">Blocked Users</h4>
          <p className="text-3xl font-light">
            {users.filter(user => user.status === 'blocked').length}
          </p>
        </div>
      </div>

      {/* Export Users Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            const csv = users.map(user => ({
              ID: user.id,
              Name: user.name,
              Email: user.email,
              Status: user.status,
              'Join Date': new Date(user.createdAt.toDate()).toLocaleDateString(),
              'Total Orders': user.orders?.length || 0
            }));
            
            const csvContent = "data:text/csv;charset=utf-8," + 
              Object.keys(csv[0]).join(",") + "\n" +
              csv.map(row => Object.values(row).join(",")).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "users.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className={`px-4 py-2 ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          } rounded-lg hover:opacity-90 transition-opacity`}
        >
          Export Users
        </button>
      </div>
    </div>
  );
}

export default UserManagement;