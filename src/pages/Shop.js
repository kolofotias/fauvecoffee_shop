import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

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

  // Example products we'll add to Firestore
  const initialProducts = [
    {
      id: '1',
      name: "Ethiopia Yirgacheffe",
      price: 16.90,
      description: "Floral and citrus notes with a tea-like body",
      longDescription: "Our Ethiopian Yirgacheffe is a delicate and complex coffee that showcases the best of what this renowned region has to offer. Each sip reveals layers of jasmine, bergamot, and fresh citrus, supported by a silky, tea-like body.",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      inStock: true,
      category: "single-origin",
      roastLevel: "Light",
      details: {
        origin: "Yirgacheffe, Ethiopia",
        altitude: "1,800-2,200 meters",
        process: "Washed",
        tastingNotes: ["Jasmine", "Bergamot", "Citrus", "Tea"]
      }
    },
    {
      id: '2',
      name: "Colombia Supremo",
      price: 15.90,
      description: "Caramel sweetness with a nutty finish",
      longDescription: "This Colombian Supremo offers a perfect balance of sweetness and complexity. The carefully selected beans deliver rich notes of caramel and toasted nuts, with a smooth chocolate finish that lingers.",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      inStock: true,
      category: "single-origin",
      roastLevel: "Medium",
      details: {
        origin: "Huila, Colombia",
        altitude: "1,600-1,900 meters",
        process: "Washed",
        tastingNotes: ["Caramel", "Toasted Nuts", "Chocolate", "Smooth"]
      }
    },
    {
      id: '3',
      name: "House Blend",
      price: 14.90,
      description: "Balanced and smooth with chocolate notes",
      longDescription: "Our signature House Blend combines carefully selected beans from Latin America and Africa. The result is a perfectly balanced coffee with rich chocolate notes, medium body, and a clean finish.",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      inStock: true,
      category: "blend",
      roastLevel: "Medium",
      details: {
        origin: "Latin America & Africa Blend",
        altitude: "Various",
        process: "Various",
        tastingNotes: ["Chocolate", "Caramel", "Brown Sugar", "Balanced"]
      }
    },
    {
      id: '4',
      name: "Kenya AA",
      price: 17.90,
      description: "Bright acidity with berry and citrus notes",
      longDescription: "This exceptional Kenya AA features the bright, complex flavors that make these coffees so sought-after. Expect vibrant notes of blackberry and citrus, with a wine-like acidity and a sweet, clean finish.",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      inStock: true,
      category: "single-origin",
      roastLevel: "Medium-Light",
      details: {
        origin: "Nyeri, Kenya",
        altitude: "1,700-2,000 meters",
        process: "Washed",
        tastingNotes: ["Blackberry", "Citrus", "Wine", "Bright"]
      }
    }
  ];

  // If you want to add these products to Firestore, you can use this function:
  const addInitialProducts = async () => {
    try {
      for (const product of initialProducts) {
        const { id, ...productData } = product;
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error adding products:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light mb-12">Shop</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? products.map(product => (
            <div 
              key={product.id} 
              className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}
            >
              <Link 
                to={`/product/${product.id}`}
                className="block group"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-light mb-2">{product.name}</h3>
                <p className="opacity-70 mb-4">{product.description}</p>
                <p className="mb-4">€{product.price.toFixed(2)}</p>
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
          )) : (
            <div className="col-span-full text-center opacity-70">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;