import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { sendOrderConfirmationEmail } from '../services/emailService';

function Checkout() {
  const navigate = useNavigate();
  const { state: cart, dispatch } = useCart();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: ''
  });

  const generateOrderNumber = () => {
    return 'FAU-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const validateOrder = () => {
    if (cart.items.length === 0) {
      throw new Error('Your cart is empty');
    }
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
      throw new Error('Please fill in all required fields');
    }
  };

  const createOrder = async (paymentDetails) => {
    setIsProcessing(true);
    setError(null);

    try {
      validateOrder();

      const orderData = {
        orderNumber: generateOrderNumber(),
        items: cart.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0]
        })),
        customer: {
          userId: user?.uid || null,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        },
        payment: {
          method: 'paypal',
          transactionId: paymentDetails.id,
          status: paymentDetails.status,
          amount: cart.total,
          currency: 'EUR',
          details: paymentDetails
        },
        status: 'pending',
        subtotal: cart.total,
        shipping: cart.total >= 50 ? 0 : 4.90,
        total: cart.total + (cart.total >= 50 ? 0 : 4.90),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const orderWithId = { ...orderData, id: orderRef.id };

      // Send confirmation email
      await sendOrderConfirmationEmail(orderWithId);

      // Update product inventory (if needed)
      // await updateInventory(cart.items);

      // Clear cart
      dispatch({ type: 'CLEAR_CART' });

      // Redirect to success page
      navigate('/checkout/success', { 
        state: { 
          orderNumber: orderData.orderNumber,
          orderDetails: orderWithId 
        }
      });

    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message || 'There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4">
      {/* ... rest of your checkout UI ... */}
      
      {/* PayPal integration */}
      <PayPalScriptProvider options={{ 
        "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
        currency: "EUR"
      }}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: (cart.total + (cart.total >= 50 ? 0 : 4.90)).toFixed(2),
                    currency_code: "EUR"
                  },
                  description: `Fauve Coffee Order - ${cart.items.length} items`
                }
              ]
            });
          }}
          onApprove={async (data, actions) => {
            // Capture the funds from the transaction
            const details = await actions.order.capture();
            // Create order in your database
            await createOrder(details);
          }}
          onError={(err) => {
            setError('Payment failed. Please try again.');
            console.error('PayPal Error:', err);
          }}
        />
      </PayPalScriptProvider>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default Checkout;