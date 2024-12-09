import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

function Checkout() {
  const navigate = useNavigate();
  const { state: cart, dispatch } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrder = async (details) => {
    try {
      const order = {
        items: cart.items,
        total: cart.total,
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        },
        paymentDetails: details,
        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), order);
      dispatch({ type: 'CLEAR_CART' });
      navigate('/checkout/success');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-32 pb-24 px-4 text-center">
        <p>Your cart is empty</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 underline hover:opacity-70"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-12">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Customer Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-light mb-6">Customer Information</h2>
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                  required
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-light mb-6">Order Summary</h2>
            <div className={`${
              isDark ? 'bg-gray-900' : 'bg-gray-50'
            } p-6 rounded-lg`}>
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between mb-4">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm opacity-70">Quantity: {item.quantity}</p>
                  </div>
                  <p>€{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>€{cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* PayPal Button */}
              <div className="mt-6">
                <PayPalScriptProvider options={{ 
                  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID 
                }}>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: cart.total.toFixed(2),
                              currency_code: "EUR"
                            }
                          }
                        ]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        createOrder(details);
                      });
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;