import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

export default function AddProductModal({ onClose, onSave, categories = [], initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    name: '', name_ta: '', category_id: categories[0]?.id || '', slug: '',
    brand: '', sku: '', weight: '', dimensions: '', short_description: '', short_description_ta: '',
    description: '', description_ta: '', mrp: '', selling_price: '', discount_percent: 0, stock: 0,
    featured: false, trending: false, best_seller: false, active: true, tags: ''
  });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      let val = formData[key];
      if (key === 'tags') {
        val = JSON.stringify(val.split(',').map(t => t.trim()).filter(t => t));
      }
      payload.append(key, val);
    });
    
    files.forEach(file => payload.append('files', file));
    if (existingImages.length > 0) {
      payload.append('images', JSON.stringify(existingImages));
    }
    if (thumbnail) {
      payload.append('thumbnail', thumbnail);
    }
    
    await onSave(payload);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-black text-primary">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
          <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Primary Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">General Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Product Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter product name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Name (Tamil)</label>
                    <input type="text" name="name_ta" value={formData.name_ta} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter product name in Tamil" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Short Description</label>
                  <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Brief summary of the product..." />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Full Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Detailed product description..." />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Media</h3>
                
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:bg-primary/5 hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload').click()}>
                  <Upload className="w-8 h-8 text-primary/60 mb-2" />
                  <p className="text-sm font-bold text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                
                {/* Previews */}
                {(files.length > 0 || existingImages.length > 0) && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-4">
                    {existingImages.map((img, idx) => (
                      <div key={`ext-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={`http://localhost:5000${img}`} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {files.map((file, idx) => (
                      <div key={`file-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Organization & Pricing */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Organization</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Category *</label>
                  <select name="category_id" value={formData.category_id} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Nestle" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Tags (comma separated)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="organic, fresh, imported" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Pricing & Inventory</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Selling Price (₹) *</label>
                    <input type="number" step="0.01" name="selling_price" value={formData.selling_price} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">MRP (₹)</label>
                    <input type="number" step="0.01" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Stock Qty *</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">SKU</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Status & Badges</h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                  <span className="text-sm font-bold text-gray-700">Active (Visible in store)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                  <span className="text-sm font-bold text-gray-700">Featured Product</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" name="best_seller" checked={formData.best_seller} onChange={handleChange} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                  <span className="text-sm font-bold text-gray-700">Best Seller</span>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-4 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button type="submit" form="productForm" disabled={loading} className="luxury-btn-primary px-8 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 disabled:opacity-50">
            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <Plus className="w-4 h-4" />}
            <span>{initialData ? 'Update Product' : 'Save Product'}</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}
