// src/components/EventForm.js
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

function EventForm({ isOpen, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventDate: '',
    eventType: '',
    guestCount: '',
    duration: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-2xl p-8 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } animate-slide-up mx-4`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 opacity-70 hover:opacity-100"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-light mb-6">Book Our Coffee Van</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}
                required
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}
                required
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}
                required
              >
                <option value="">Select Event Type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate Event</option>
                <option value="private">Private Party</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Guest Count
              </label>
              <input
                type="number"
                value={formData.guestCount}
                onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}
                required
              />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className={`w-full p-2 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                } border`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Additional Details
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={4}
              className={`w-full p-2 ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              } border`}
            />
          </div>

          <button 
            type="submit"
            className={`w-full py-3 ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            } hover:opacity-90 text-sm tracking-wider uppercase`}
          >
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventForm;