import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Coffee } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function CheckoutSuccess() {
    const isDark = theme === 'dark';
    const { theme } = useTheme();


  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-4xl font-light mb-4">Thank You!</h1>
        <p className="text-xl opacity-70 mb-8">Your order has been successfully placed.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <Package className="h-8 w-8 mb-4 mx-auto opacity-70" />
            <h2 className="text-lg font-medium mb-2">What's Next?</h2>
            <p className="opacity-70">
              You'll receive an order confirmation email with tracking details once your order ships.
            </p>
          </div>

          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <Coffee className="h-8 w-8 mb-4 mx-auto opacity-70" />
            <h2 className="text-lg font-medium mb-2">Brewing Tips</h2>
            <p className="opacity-70">
              Check your email for our brewing guide to get the most out of your coffee.
            </p>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            to="/shop"
            className={`inline-block px-6 py-3 ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase`}
          >
            Continue Shopping
          </Link>
          <Link
            to="/account/orders"
            className="inline-block px-6 py-3 border border-current hover:opacity-70 transition-opacity text-sm tracking-wider uppercase"
          >
            View Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;