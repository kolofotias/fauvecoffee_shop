// src/pages/admin/OrderManagement.js
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
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  Filter
} from 'lucide-react';

function OrderManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const orderStatuses = {
    pending: { label: 'Pending', color: 'text-yellow-500' },
    processing: { label: 'Processing', color: 'text-blue-500' },
    shipped: { label: 'Shipped', color: 'text-green-500' },
    delivered: { label: 'Delivered', color: 'text-purple-500' },
    cancelled: { label: 'Cancelled', color: 'text-red-500' }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      let ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );

      if (filterStatus !== 'all') {
        ordersQuery = query(
          collection(db, 'orders'),
          where('status', '==', filterStatus),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light">Orders</h2>
        
        {/* Filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`pl-4 pr-10 py-2 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } border border-gray-200 dark:border-gray-700 rounded-lg`}
          >
            <option value="all">All Orders</option>
            {Object.entries(orderStatuses).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className={`${
              isDark ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm opacity-70">
                  {new Date(order.createdAt.toDate()).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className={orderStatuses[order.status].color}>
                  {orderStatuses[order.status].label}
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Customer</h4>
                <p>{order.customer.name}</p>
                <p className="text-sm opacity-70">{order.customer.email}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Shipping</h4>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.city}, {order.shipping.country}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Total</h4>
                <p className="text-lg">€{order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h4 className="font-medium mb-4">Products</h4>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm opacity-70">Quantity: {item.quantity}</p>
                    </div>
                    <p>€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end space-x-4">
                {Object.entries(orderStatuses).map(([status, { label }]) => (
                  status !== order.status && (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      className={`px-4 py-2 text-sm rounded-lg ${
                        isDark 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Mark as {label}
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderManagement;