import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';

function EnhancedCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
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

  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 4.90; // Free shipping over €50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const proceedToCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative hover:opacity-70 transition-opacity"
      >
        <ShoppingCart className="h-5 w-5" />
        {state.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {state.items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`absolute right-0 top-0 h-full w-full max-w-md ${
            isDark ? 'bg-gray-900' : 'bg-white'
          } shadow-lg animate-slide-in-right`}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-light">Shopping Cart</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {state.items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-12 w-12 opacity-30 mb-4" />
                  <p className="opacity-70 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/shop');
                    }}
                    className={`px-6 py-2 ${
                      isDark ? 'bg-white text-black' : 'bg-black text-white'
                    } text-sm tracking-wider uppercase hover:opacity-90`}
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {state.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 mb-6">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-sm opacity-70 mb-2">€{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ml-2"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                        <p className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="opacity-70">Subtotal</span>
                        <span>€{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Shipping</span>
                        <span>{calculateShipping() === 0 ? 'Free' : `€${calculateShipping().toFixed(2)}`}</span>
                      </div>
                      {calculateShipping() > 0 && (
                        <p className="text-sm opacity-70">
                          Free shipping on orders over €50
                        </p>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total</span>
                        <span>€{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={proceedToCheckout}
                      className={`w-full py-3 ${
                        isDark ? 'bg-white text-black' : 'bg-black text-white'
                      } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase`}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EnhancedCart;