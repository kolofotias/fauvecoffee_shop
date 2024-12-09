import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

function Shop() {
  const { theme } = useTheme();
  const { dispatch } = useCart();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-4 text-center">
        Loading products...
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light mb-12">Shop</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div 
              key={product.id} 
              className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 rounded-lg shadow`}
            >
              <Link 
                to={`/product/${product.id}`}
                className="block group"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={product.images?.[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-light mb-2">{product.name}</h3>
                <p className="opacity-70 mb-4">{product.description}</p>
                <p className="mb-4">€{product.price?.toFixed(2)}</p>
              </Link>
              
              <button 
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                disabled={!product.inStock}
                className={`w-full py-2 ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase disabled:opacity-50`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;