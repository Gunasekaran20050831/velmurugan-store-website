import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { Plus, Edit3, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminProducts() {
  const { t } = useLanguage();
  const { products, addProduct, editProduct, deleteProduct } = useApp();

  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null); 
  
  // Form States
  const [prodName, setProdName] = useState('');
  const [prodNameTa, setProdNameTa] = useState('');
  const [prodCategory, setProdCategory] = useState('Fruits & Veg');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodDescTa, setProdDescTa] = useState('');
  const [prodImages, setProdImages] = useState([
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
  ]);

  const handleOpenAddModal = () => {
    setEditingProd(null);
    setProdName('');
    setProdNameTa('');
    setProdCategory('Fruits & Veg');
    setProdPrice('');
    setProdStock('');
    setProdDesc('');
    setProdDescTa('');
    setProdImages(["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"]);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProd(prod);
    setProdName(prod.name);
    setProdNameTa(prod.nameTa || '');
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdStock(prod.stock);
    setProdDesc(prod.description);
    setProdDescTa(prod.descriptionTa || '');
    setProdImages([...prod.images]);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = {
      id: editingProd ? editingProd.id : Date.now(),
      name: prodName,
      nameTa: prodNameTa,
      category: prodCategory,
      categoryTa: prodCategory === 'Fruits & Veg' ? 'பழங்கள் & காய்கறிகள்' : 'மளிகை பொருட்கள்', 
      price: parseFloat(prodPrice),
      stock: parseInt(prodStock),
      description: prodDesc,
      descriptionTa: prodDescTa,
      images: prodImages,
      rating: editingProd ? editingProd.rating : 5.0,
      ratingCount: editingProd ? editingProd.ratingCount : 0,
      specifications: editingProd ? editingProd.specifications : [],
      reviews: editingProd ? editingProd.reviews : []
    };

    if (editingProd) {
      editProduct(payload);
    } else {
      addProduct(payload);
    }
    setShowProductModal(false);
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex justify-between items-center pl-1">
          <h3 className="text-sm font-extrabold text-primary">Inventory & Stock Manager</h3>
          <div className="flex items-center space-x-3">
            <input 
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="px-4 py-2 rounded-xl text-xs border border-gray-200 glass-input min-w-[200px]"
            />
            <button 
              onClick={handleOpenAddModal}
              className="luxury-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addProdBtn')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products
            .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase()))
            .map((prod) => (
            <div 
              key={prod.id}
              className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-150 shadow-sm flex items-center gap-4 justify-between"
            >
              <img src={prod.images[0]} alt={prod.name} className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0" />
              
              <div className="flex-1 min-w-0 text-left text-xs">
                <span className="text-[9px] font-bold text-accent uppercase tracking-wider block">
                  {prod.category}
                </span>
                <h4 className="font-extrabold text-primary truncate">{prod.name}</h4>
                
                <div className="flex items-center space-x-3 mt-1.5 font-bold">
                  <span className="text-primary">₹{prod.price}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black ${prod.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {t('stockStatus')}: {prod.stock} Qty
                  </span>
                </div>
              </div>

              {/* Edit / Delete triggers */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenEditModal(prod)}
                  className="p-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-xl text-primary transition-colors"
                  title={t('editProdBtn')}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteProduct(prod.id)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 transition-colors"
                  title={t('deleteProdBtn')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-base font-extrabold text-primary font-sans">
                {editingProd ? t('editProdBtn') : t('addProdBtn')}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-5 text-left text-xs">
                
                {/* Image Preview (First image) */}
                {prodImages.length > 0 && (
                  <div className="flex justify-center mb-4">
                    <img src={prodImages[0]} alt="Preview" className="w-32 h-32 object-cover rounded-3xl border border-gray-100 shadow-sm" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Name (English) */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('prodNameInput')} (English)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Red Apples"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900 font-bold"
                    />
                  </div>
                  {/* Name (Tamil) */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('prodNameInput')} (தமிழ்)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ஆப்பிள்"
                      value={prodNameTa}
                      onChange={(e) => setProdNameTa(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('categoryInput')}</label>
                    <select 
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900 font-bold cursor-pointer"
                    >
                      <option value="Fruits & Veg">Fruits & Veg</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Staples">Staples</option>
                      <option value="Personal Care">Personal Care</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('priceInput')}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="120"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900 font-bold"
                    />
                  </div>

                  {/* Initial Stock */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('stockInput')}</label>
                    <input 
                      type="number" 
                      required
                      placeholder="15"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900 font-bold"
                    />
                  </div>
                </div>

                {/* Description (English) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('descInput')} (English)</label>
                  <textarea 
                    rows="3"
                    placeholder="Enter detailed description of the product..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900"
                  ></textarea>
                </div>

                {/* Description (Tamil) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('descInput')} (தமிழ்)</label>
                  <textarea 
                    rows="3"
                    placeholder="தயாரிப்பு பற்றிய விவரங்களை உள்ளிடவும்..."
                    value={prodDescTa}
                    onChange={(e) => setProdDescTa(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900"
                  ></textarea>
                </div>

                {/* Mock Upload Image link */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('uploadImages')}</label>
                  <div className="flex items-center space-x-2">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <input 
                      type="text"
                      placeholder="Paste Image URL"
                      value={prodImages[0]}
                      onChange={(e) => setProdImages([e.target.value])}
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 shrink-0 bg-gray-50/50">
              <button 
                type="submit"
                form="productForm"
                className="w-full luxury-btn-primary py-3.5 rounded-xl text-xs font-bold"
              >
                {t('saveChanges')}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
