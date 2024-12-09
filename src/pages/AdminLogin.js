import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, ADMIN_EMAIL } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AlertCircle } from 'lucide-react';

function AdminLogin() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, isAdmin } = useAuth();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      if (user.email !== ADMIN_EMAIL) {
        throw new Error('Unauthorized access');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      setError(
        error.message === 'Unauthorized access'
          ? 'Not authorized as admin'
          : 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="pt-32 pb-24 px-4 animate-fade-in dark:text-white">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-2">Admin Login</h1>
          <p className="opacity-70">Access the admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 mb-6 rounded flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-gray-400`}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-gray-400`}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase disabled:opacity-50`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;