// src/pages/Home.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Coffee, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-light tracking-tight leading-tight">
            Specialty Coffee <br/>Roasted in Berlin
          </h1>
          <p className="text-lg tracking-wide opacity-70">
            Small-batch roasted coffee, carefully sourced and expertly prepared
          </p>
          <Link 
            to="/shop"
            className={`inline-block mt-8 px-8 py-3 ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            } hover:opacity-90 text-sm tracking-wider uppercase`}
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Coffee Van Section */}
          <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Truck className="h-12 w-12 mb-8 opacity-70" />
            <h2 className="text-2xl font-light mb-4">Coffee Van</h2>
            <p className="opacity-70 mb-6">
              Find our mobile coffee van serving specialty coffee across Berlin
            </p>
            <button className={`px-6 py-2 ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            } hover:opacity-90`}>
              Find Us
            </button>
          </div>

          {/* Shop Section */}
          <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Coffee className="h-12 w-12 mb-8 opacity-70" />
            <h2 className="text-2xl font-light mb-4">Fresh Roasts</h2>
            <p className="opacity-70 mb-6">
              Weekly roasted beans delivered directly to your door
            </p>
            <Link 
              to="/shop"
              className={`inline-block px-6 py-2 ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              } hover:opacity-90`}
            >
              Shop Coffee
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;