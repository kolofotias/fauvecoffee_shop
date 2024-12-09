// src/pages/Contact.js
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

function Contact() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    type: null,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setFormStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!'
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      // Error
      setFormStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.'
      });
    }

    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light mb-12">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-light mb-6">Visit Us</h2>
            <div className="space-y-4 opacity-70">
              <p>Prenzlauer Berg</p>
              <p>10405 Berlin</p>
              <p>Germany</p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Get in Touch</h2>
            <div className="space-y-4 opacity-70">
              <p>Email: hello@fauvecoffee.de</p>
              <p>Phone: +49 30 1234 5678</p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Hours</h2>
            <div className="space-y-4 opacity-70">
              <p>Monday - Friday: 8:00 - 18:00</p>
              <p>Saturday - Sunday: 9:00 - 17:00</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
            {formStatus.type && (
              <div className={`mb-6 p-4 flex items-start gap-2 ${
                formStatus.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                {formStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5" />
                )}
                <p>{formStatus.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={4}
                  className={`w-full p-2 ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } border focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                } hover:opacity-90 disabled:opacity-50 text-sm tracking-wider uppercase`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;