// src/pages/admin/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

function ProductManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const initialFormData = {
    name: '',
    price: '',
    description: '',
    longDescription: '',
    category: '',
    roastLevel: '',
    inStock: true,
    details: {
      origin: '',
      altitude: '',
      process: '',
      tastingNotes: []
    },
    images: []
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Instead of uploading, just use the file paths
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };
//     setUploading(true);
//     const uploadedUrls = [];

//     try {
//       for (const file of files) {
//         const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
//         await uploadBytes(storageRef, file);
//         const url = await getDownloadURL(storageRef);
//         uploadedUrls.push(url);
//       }

//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, ...uploadedUrls]
//       }));
//     } catch (error) {
//       console.error('Error uploading images:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), formData);
      } else {
        await addDoc(collection(db, 'products'), formData);
      }
      
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

    const handleDelete = async (product) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
          try {
            await deleteDoc(doc(db, 'products', product.id));
            fetchProducts();
          } catch (error) {
            console.error('Error deleting product:', error);
          }
        }
      };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light">Products</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingProduct(null);
            setFormData(initialFormData);
          }}
          className={`flex items-center space-x-2 px-4 py-2 ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          } rounded-lg`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className={`${
              isDark ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow p-4`}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-medium mb-2">{product.name}</h3>
            <p className="text-sm opacity-70 mb-4">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium">€{product.price}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowForm(false)}
          />
          <div className={`relative w-full max-w-2xl p-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl`}>
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 opacity-70 hover:opacity-100"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-xl font-light mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full p-2 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    } border border-gray-200 dark:border-gray-600`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className={`w-full p-2 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    } border border-gray-200 dark:border-gray-600`}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className={`w-full p-2 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  } border border-gray-200 dark:border-gray-600`}
                  required
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Long Description
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                  rows={4}
                  className={`w-full p-2 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  } border border-gray-200 dark:border-gray-600`}
                  required
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                  className={`w-full p-2 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  } border border-gray-200 dark:border-gray-600`}
                  disabled={uploading}
                />
                {uploading && <p className="mt-2 text-sm">Uploading images...</p>}
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-2 ${
                  isDark ? 'bg-white text-black' : 'bg-black text-white'
                } rounded hover:opacity-90 transition-opacity disabled:opacity-50`}
              >
                {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
              </button>

              {/* Product Details Section */}
              <div className="border-t pt-6 mt-6">
                <h4 className="text-lg font-light mb-4">Product Details</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      value={formData.details.origin}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: {
                          ...formData.details,
                          origin: e.target.value
                        }
                      })}
                      className={`w-full p-2 rounded ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      } border border-gray-200 dark:border-gray-600`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">
                      Altitude
                    </label>
                    <input
                      type="text"
                      value={formData.details.altitude}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: {
                          ...formData.details,
                          altitude: e.target.value
                        }
                      })}
                      className={`w-full p-2 rounded ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      } border border-gray-200 dark:border-gray-600`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">
                      Process
                    </label>
                    <select
                      value={formData.details.process}
                      onChange={(e) => setFormData({
                        ...formData,
                        details: {
                          ...formData.details,
                          process: e.target.value
                        }
                      })}
                      className={`w-full p-2 rounded ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      } border border-gray-200 dark:border-gray-600`}
                    >
                      <option value="">Select Process</option>
                      <option value="Washed">Washed</option>
                      <option value="Natural">Natural</option>
                      <option value="Honey">Honey</option>
                      <option value="Anaerobic">Anaerobic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm uppercase tracking-wider mb-2">
                      Roast Level
                    </label>
                    <select
                      value={formData.roastLevel}
                      onChange={(e) => setFormData({
                        ...formData,
                        roastLevel: e.target.value
                      })}
                      className={`w-full p-2 rounded ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      } border border-gray-200 dark:border-gray-600`}
                    >
                      <option value="">Select Roast Level</option>
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>
                </div>

                {/* Tasting Notes */}
                <div className="mt-6">
                  <label className="block text-sm uppercase tracking-wider mb-2">
                    Tasting Notes (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.details.tastingNotes.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      details: {
                        ...formData.details,
                        tastingNotes: e.target.value.split(',').map(note => note.trim())
                      }
                    })}
                    placeholder="e.g., Chocolate, Berries, Citrus"
                    className={`w-full p-2 rounded ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    } border border-gray-200 dark:border-gray-600`}
                  />
                </div>

                {/* Stock Status */}
                <div className="mt-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({
                        ...formData,
                        inStock: e.target.checked
                      })}
                      className="form-checkbox"
                    />
                    <span className="text-sm uppercase tracking-wider">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({
                    ...formData,
                    category: e.target.value
                  })}
                  className={`w-full p-2 rounded ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  } border border-gray-200 dark:border-gray-600`}
                >
                  <option value="">Select Category</option>
                  <option value="single-origin">Single Origin</option>
                  <option value="blend">Blend</option>
                  <option value="espresso">Espresso</option>
                  <option value="decaf">Decaf</option>
                </select>
              </div>

              {/* Preview Images */}
              {formData.images.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm uppercase tracking-wider mb-2">
                    Current Images
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index)
                          })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;