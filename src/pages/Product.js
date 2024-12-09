import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import ImageGallery from '../components/ImageGallery';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const isDark = theme === 'dark';
  
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleAddToCart = () => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: product 
    });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = async (updatedData) => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, updatedData);
      setProduct({ ...product, ...updatedData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleProductDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        navigate('/shop');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <div className="pt-32 pb-24 px-4">Loading...</div>;
  }

  if (!product) {
    return <div className="pt-32 pb-24 px-4">Product not found</div>;
  }

  return (
    <div className="pt-32 pb-24 px-4 animate-fade-in dark:text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center space-x-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shop</span>
          </button>

          {isAdmin && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 opacity-70 hover:opacity-100"
              >
                <Edit className="h-4 w-4" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
              <button
                onClick={handleProductDelete}
                className="flex items-center space-x-2 text-red-500 hover:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="animate-slide-up">
            <ImageGallery images={product.images} />
          </div>

          <div className="animate-slide-in-right space-y-6">
            {isEditing ? (
              <ProductEditForm 
                product={product} 
                onSubmit={handleProductUpdate}
                isDark={isDark}
              />
            ) : (
              <>
                <h1 className="text-4xl font-light">{product.name}</h1>
                <p className="text-2xl">€{product.price.toFixed(2)}</p>
                <p className="opacity-70">{product.longDescription}</p>

                <div className="space-y-4">
                  <h2 className="text-xl font-light">Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="opacity-70">Origin</p>
                      <p>{product.details.origin}</p>
                    </div>
                    <div>
                      <p className="opacity-70">Altitude</p>
                      <p>{product.details.altitude}</p>
                    </div>
                    <div>
                      <p className="opacity-70">Process</p>
                      <p>{product.details.process}</p>
                    </div>
                    <div>
                      <p className="opacity-70">Roast Level</p>
                      <p>{product.roastLevel}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-light mb-2">Tasting Notes</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.details.tastingNotes.map((note, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full ${
                          isDark ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                      onClick={handleAddToCart}
                      //onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                  className={`w-full py-3 ${
                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                  } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase`}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductEditForm({ product, onSubmit, isDark }) {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm uppercase tracking-wider mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
          required
        />
      </div>

      <div>
        <label className="block text-sm uppercase tracking-wider mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          className={`w-full p-2 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
          required
        />
      </div>

      <div>
        <label className="block text-sm uppercase tracking-wider mb-2">Description</label>
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          rows={4}
          className={`w-full p-2 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
          required
        />
      </div>

      <div>
        <label className="block text-sm uppercase tracking-wider mb-2">Image URLs (comma-separated)</label>
        <input
          type="text"
          name="images"
          value={formData.images.join(', ')}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            images: e.target.value.split(',').map(url => url.trim())
          }))}
          className={`w-full p-2 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
          required
        />
      </div>

      <div>
        <label className="block text-sm uppercase tracking-wider mb-2">Stock Status</label>
        <select
          name="inStock"
          value={formData.inStock}
          onChange={handleChange}
          className={`w-full p-2 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}
        >
          <option value={true}>In Stock</option>
          <option value={false}>Out of Stock</option>
        </select>
      </div>

      <button 
        type="submit"
        className={`w-full py-3 ${
          isDark ? 'bg-white text-black' : 'bg-black text-white'
        } hover:opacity-90 transition-opacity text-sm tracking-wider uppercase`}
      >
        Save Changes
      </button>
    </form>
  );
}

export default Product;