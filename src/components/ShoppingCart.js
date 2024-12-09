// src/components/ShoppingCart.js
import React, { useState } from 'react';
import { ShoppingCart as CartIcon, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export function ShoppingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id, quantity: newQuantity } 
      });
    }
  };

  return (
    <>
      {/* Cart Icon */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="hover:opacity-70 transition-opacity"
        >
          <CartIcon className="h-5 w-5" />
          {state.items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {state.items.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`absolute right-0 top-0 h-full w-full max-w-md ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-lg p-6`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-light">Shopping Cart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:opacity-70"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {state.items.length === 0 ? (
              <p className="text-center opacity-70 my-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  {state.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-light">{item.name}</h3>
                        <p className="opacity-70">€{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-auto">
                  <div className="flex justify-between mb-4">
                    <span>Total</span>
                    <span>€{state.total.toFixed(2)}</span>
                  </div>
                  <button className={`w-full py-2 px-4 ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  } hover:opacity-90`}>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}