// src/pages/Shop.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Filter, X } from 'lucide-react';

function Shop() {
  const { dispatch } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const products = [
    {
      id: 1,
      name: "Ethiopia Yirgacheffe",
      price: 16.90,
      description: "Floral and citrus notes with a tea-like body",
      category: "single-origin",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      roastLevel: "Light",
      inStock: true
    },
    {
      id: 2,
      name: "Colombia Supremo",
      price: 15.90,
      description: "Caramel sweetness with a nutty finish",
      category: "single-origin",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      roastLevel: "Medium",
      inStock: true
    },
    {
      id: 3,
      name: "House Blend",
      price: 14.90,
      description: "Balanced and smooth with chocolate notes",
      category: "blend",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      roastLevel: "Medium-Dark",
      inStock: true
    },
    {
      id: 4,
      name: "Kenya AA",
      price: 17.90,
      description: "Bright acidity with berry and citrus notes",
      category: "single-origin",
      images: ["/placeholder.jpg", "/placeholder2.jpg", "/placeholder3.jpg"],
      roastLevel: "Light",
      inStock: false
    }
  ];

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'single-origin', label: 'Single Origin' },
    { value: 'blend', label: 'Blends' },
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <div className="pt-32 pb-24 px-4 animate-fade-in dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-light">Shop</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 opacity-70 hover:opacity-100 transition-opacity md:hidden"
          >
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Filters */}
        <div className={`
          md:flex space-x-8 mb-8 
          ${showFilters ? 'block' : 'hidden md:flex'}
        `}>
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`${
                activeFilter === filter.value 
                  ? 'opacity-100' 
                  : 'opacity-70 hover:opacity-100'
              } transition-opacity`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6 animate-slide-up`}
            >
              <Link to={`/product/${product.id}`} className="block mb-4">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full aspect-square object-cover mb-6 hover:opacity-90 transition-opacity"
                />
                <h3 className="text-xl font-light mb-2">{product.name}</h3>
              </Link>
              <p className="opacity-70 mb-4">{product.description}</p>
              <div className="flex justify-between items-center mb-6">
                <p>€{product.price.toFixed(2)}</p>
                <span className={`text-sm ${
                  product.inStock ? 'text-green-600' : 'text-red-500'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
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