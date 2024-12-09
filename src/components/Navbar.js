import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, ShoppingCart, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    // Add admin link conditionally
    ...(isAdmin ? [{ href: '/admin', label: 'Dashboard' }] : []),
    // Add login link if not admin
    ...(!isAdmin ? [{ href: '/admin/login', label: 'Admin Login' }] : [])
  ];

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${
      isDark ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-6 w-6" />
            <span className="text-lg tracking-widest uppercase">Fauve</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`tracking-wider uppercase text-sm hover:opacity-70 transition-opacity ${
                  location.pathname === link.href ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="hover:opacity-70 transition-opacity"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <ShoppingCart className="h-5 w-5 cursor-pointer hover:opacity-70" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ShoppingCart className="h-5 w-5" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:opacity-70 transition-opacity"
            >
              {isMenuOpen ? 
                <Menu className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 ${
            isDark ? 'bg-gray-950' : 'bg-white'
          }`}>
            <div className="flex flex-col space-y-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="tracking-wider uppercase text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="tracking-wider uppercase text-sm">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;