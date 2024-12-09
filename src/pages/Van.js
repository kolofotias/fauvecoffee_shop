// src/pages/Van.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Clock, Coffee, Instagram } from 'lucide-react';

function Van() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const weeklyLocations = [
    { day: 'Monday', location: 'Mauerpark', time: '8:00 - 16:00' },
    { day: 'Tuesday', location: 'Boxhagener Platz', time: '8:00 - 16:00' },
    { day: 'Wednesday', location: 'Volkspark Friedrichshain', time: '8:00 - 16:00' },
    { day: 'Thursday', location: 'Tempelhof Field', time: '8:00 - 16:00' },
    { day: 'Friday', location: 'Kreuzberg', time: '8:00 - 16:00' },
    { day: 'Saturday', location: 'Prenzlauer Berg', time: '9:00 - 17:00' },
    { day: 'Sunday', location: 'Warschauer Straße', time: '9:00 - 17:00' },
  ];

  const menuItems = [
    { name: 'Espresso', price: 2.50 },
    { name: 'Americano', price: 3.00 },
    { name: 'Flat White', price: 3.50 },
    { name: 'Cappuccino', price: 3.50 },
    { name: 'Latte', price: 3.80 },
    { name: 'Filter Coffee', price: 3.00 },
    { name: 'Cold Brew', price: 4.00 },
  ];

  return (
    <div className="pt-32 pb-24 px-4 animate-fade-in dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-light mb-4">Coffee Van</h1>
          <p className="opacity-70 max-w-2xl mx-auto">
            Find our mobile coffee van serving specialty coffee across Berlin. 
            Follow us on Instagram for daily location updates and special offers.
          </p>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 mt-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Instagram className="h-5 w-5" />
            <span>@fauvecoffee</span>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} animate-slide-up`}>
            <h2 className="text-2xl font-light mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-2" />
              Weekly Locations
            </h2>
            <div className="space-y-4">
              {weeklyLocations.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.day}</p>
                    <p className="opacity-70">{item.location}</p>
                  </div>
                  <p className="opacity-70">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} animate-slide-up delay-100`}>
            <h2 className="text-2xl font-light mb-6 flex items-center">
              <Coffee className="h-6 w-6 mr-2" />
              Menu
            </h2>
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p>{item.name}</p>
                  <p className="opacity-70">€{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center animate-slide-up delay-200">
          <h2 className="text-2xl font-light mb-4">Private Events</h2>
          <p className="opacity-70 mb-6">
            Looking to have our coffee van at your event? We offer special packages
            for private events, corporate functions, and weddings.
          </p>
          <button className={`px-8 py-3 ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase`}>
            Inquire Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Van;