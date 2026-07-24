import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { 
  BarChart3, Package, ClipboardList, Users, ShieldAlert, 
  Map, Trash2, Edit3, Plus, ArrowLeft, TrendingUp, DollarSign, 
  ChevronRight, RefreshCw, X, Image as ImageIcon 
} from 'lucide-react';

export default function AdminPanel({ onNavigate }) {
  const { language, t } = useLanguage();
  const { 
    products, orders, deliveryRates, setDeliveryRates, 
    addProduct, editProduct, deleteProduct, updateOrderStatus, currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, orders, products, delivery
  
  // Product CRUD modals/form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null); // null means adding
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

  // Product Search/Filter
  const [productSearch, setProductSearch] = useState('');

  // Delivery rate state
  const [ratesForm, setRatesForm] = useState([...deliveryRates]);

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
    setProdNameTa(prod.nameTa);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdStock(prod.stock);
    setProdDesc(prod.description);
    setProdDescTa(prod.descriptionTa);
    setProdImages(prod.images);
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || prodStock === '') return;

    const priceVal = parseFloat(prodPrice);
    const stockVal = parseInt(prodStock);

    if (editingProd) {
      // Edit mode
      const updated = {
        ...editingProd,
        name: prodName,
        nameTa: prodNameTa || prodName,
        category: prodCategory,
        price: priceVal,
        stock: stockVal,
        description: prodDesc,
        descriptionTa: prodDescTa || prodDesc,
        images: prodImages
      };
      editProduct(updated);
    } else {
      // Add mode
      const newProd = {
        name: prodName,
        nameTa: prodNameTa || prodName,
        category: prodCategory,
        price: priceVal,
        stock: stockVal,
        description: prodDesc,
        descriptionTa: prodDescTa || prodDesc,
        images: prodImages,
        rating: 4.5,
        ratingCount: 1,
        specifications: [
          { key: "Origin", value: "Local Store" },
          { key: "Type", value: "Fresh Pack" }
        ],
        reviews: []
      };
      addProduct(newProd);
    }
    setShowProductModal(false);
  };

  const handleSaveRates = (e) => {
    e.preventDefault();
    setDeliveryRates(ratesForm);
    alert("Delivery rates updated successfully!");
  };

  const handleRateFieldChange = (index, value) => {
    const updated = ratesForm.map((rate, idx) => 
      idx === index ? { ...rate, charge: parseInt(value) || 0 } : rate
    );
    setRatesForm(updated);
  };

  // If not logged in as Admin, block access
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-primary font-sans">Restricted Access</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            This dashboard is reserved for verified Store Administrators. Please login with admin privileges to proceed.
          </p>
        </div>
        <button
          onClick={() => onNavigate('auth')}
          className="luxury-btn-primary px-8 py-3.5 rounded-xl text-xs font-bold w-full"
        >
          {t('loginBtn')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left space-y-8 animate-in fade-in duration-300 pb-24">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-accent font-black uppercase tracking-wider block">Security Layer Authenticated</span>
          <h1 className="text-2xl font-extrabold text-primary font-sans">{t('adminTitle')}</h1>
        </div>
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-1.5 text-primary hover:text-accent font-bold text-xs bg-primary/5 px-4 py-2 rounded-full border border-primary/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Panel</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-150 shadow-sm flex flex-col space-y-2 h-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: ClipboardList },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'delivery', label: 'Delivery Fees', icon: Map }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-transparent text-gray-500 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">

      {/* Tab: Dashboard Panel */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat: Orders */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</span>
                <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black">+12%</span>
              </div>
              <h3 className="text-xl font-extrabold text-primary mt-2">1,245</h3>
              <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span>vs previous week</span>
              </div>
            </div>

            {/* Stat: Revenue */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revenue</span>
                <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black">+18%</span>
              </div>
              <h3 className="text-xl font-extrabold text-primary mt-2">₹2,45,680</h3>
              <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span>vs previous month</span>
              </div>
            </div>

            {/* Stat: Customers */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customers</span>
                <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black">+4.2%</span>
              </div>
              <h3 className="text-xl font-extrabold text-primary mt-2">856</h3>
              <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span>Active customers</span>
              </div>
            </div>

            {/* Stat: Products */}
            <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Products</span>
                <span className="text-[9px] bg-primary/5 text-primary px-2 py-0.5 rounded font-black">Active</span>
              </div>
              <h3 className="text-xl font-extrabold text-primary mt-2">{products.length}</h3>
              <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
                <Package className="w-3.5 h-3.5 text-primary" />
                <span>Items in catalog</span>
              </div>
            </div>
          </div>

          {/* Sales chart representation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales overview */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-primary font-sans">{t('salesOverview')}</h3>
              
              {/* Premium abstract SVG mock chart graph */}
              <div className="h-56 w-full relative flex items-end">
                <svg className="w-full h-full text-primary" viewBox="0 0 500 150">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(10, 35, 92, 0.05)" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(10, 35, 92, 0.05)" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(10, 35, 92, 0.05)" />
                  
                  {/* Gradient Area Fill */}
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 130 C 50 110, 100 140, 150 90 C 200 40, 250 85, 300 50 C 350 15, 400 65, 450 30 C 480 10, 500 15, 500 15 L 500 150 L 0 150 Z" fill="url(#chartGlow)" />
                  
                  {/* Spline line */}
                  <path d="M 0 130 C 50 110, 100 140, 150 90 C 200 40, 250 85, 300 50 C 350 15, 400 65, 450 30 C 480 10, 500 15, 500 15" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
                </svg>

                {/* X labels */}
                <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[9px] text-gray-400 font-bold uppercase">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Pie Chart: Status break */}
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="text-sm font-extrabold text-primary font-sans">{t('orderStatus')}</h3>
              
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                {/* SVG circular donut segment visual */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Empty base */}
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(10, 35, 92, 0.05)" strokeWidth="3" />
                  {/* Segment: Delivered 60% */}
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="#0A235C" strokeWidth="3.2" strokeDasharray="60 40" strokeDashoffset="0" />
                  {/* Segment: Pending 25% */}
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="#D4AF37" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="-60" />
                  {/* Segment: Cancelled/Returned 15% */}
                  <circle cx="18" cy="18" r="15.91" fill="none" stroke="#F87171" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-85" />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-xs font-black text-primary">85%</span>
                  <span className="block text-[8px] text-gray-400 font-black uppercase">Success</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-primary"></span><span className="text-gray-500">Delivered</span></span>
                  <span className="text-primary">60%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-accent"></span><span className="text-gray-500">In Progress</span></span>
                  <span className="text-primary">25%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-red-400"></span><span className="text-gray-500">Cancelled</span></span>
                  <span className="text-primary">15%</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab: Orders Panel */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-extrabold text-primary pl-1">Customer Order Manager</h3>
          
          <div className="space-y-3.5">
            {orders.map((ord) => (
              <div 
                key={ord.id}
                className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm text-xs text-left space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-primary text-sm">Order ID: #{ord.id}</span>
                      <span className="bg-gray-100 text-gray-500 font-bold px-2.5 py-0.5 rounded text-[10px]">{ord.paymentMethod}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Date: {ord.date}</span>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-400 text-[10px]">Change Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl font-bold text-primary focus:outline-none focus:border-primary cursor-pointer text-[10px]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Items list */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Ordered Items</span>
                    <div className="divide-y divide-gray-50">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 font-semibold text-primary">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer details & address */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Customer Details</span>
                    <div className="space-y-1">
                      <span className="font-bold text-primary block">Phone: {ord.userPhone}</span>
                      <span className="text-gray-500 block leading-relaxed">{ord.address}</span>
                    </div>
                  </div>

                  {/* Location distance rates calculation */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Delivery Calculations</span>
                    <div className="space-y-1 font-semibold">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Distance:</span>
                        <span className="text-primary">{ord.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delivery Charge:</span>
                        <span className="text-primary">₹{ord.deliveryCharge}</span>
                      </div>
                      <hr className="border-gray-100 my-1" />
                      <div className="flex justify-between text-primary font-black text-sm">
                        <span>Invoice Total:</span>
                        <span>₹{ord.total}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Products catalog Panel */}
      {activeTab === 'products' && (
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
                    {/* Stock level visible ONLY to Admin */}
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
      )}

      {/* Tab: Delivery Fees config */}
      {activeTab === 'delivery' && (
        <form onSubmit={handleSaveRates} className="max-w-md bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm text-left space-y-5 animate-in fade-in duration-200">
          <h3 className="text-sm font-extrabold text-primary font-sans">Edit Distance Charges</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            Configure delivery fees applied to customer checkout orders based on geographic distance tiers.
          </p>

          <div className="space-y-4">
            {ratesForm.map((rate, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <label className="text-xs font-bold text-primary block w-32 shrink-0">
                  {rate.min} – {rate.max} km:
                </label>
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={rate.charge}
                    onChange={(e) => handleRateFieldChange(idx, e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl text-xs glass-input text-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full luxury-btn-gold py-3.5 rounded-xl text-xs font-bold"
          >
            {t('saveChanges')}
          </button>
        </form>
      )}

      </div> {/* End of Content Area */}
      </div> {/* End of Main Layout Grid */}

      {/* Add / Edit Product Modal Drawer */}
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
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-left">
              
              {/* Product Name (English) */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('prodNameInput')} (English)</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Fresh Red Apples"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900"
                />
              </div>

              {/* Product Name (Tamil) */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('prodNameInput')} (தமிழ்)</label>
                <input 
                  type="text"
                  placeholder="எ.கா. புதிய ஆப்பிள்கள்"
                  value={prodNameTa}
                  onChange={(e) => setProdNameTa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900"
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('categoryInput')}</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-bold text-primary focus:outline-none focus:border-primary"
                >
                  <option value="Fruits & Veg">Fruits & Veg</option>
                  <option value="Dairy & Eggs">Dairy & Eggs</option>
                  <option value="Staples">Staples</option>
                  <option value="Personal Care">Personal Care</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('priceInput')}</label>
                  <input 
                    type="number"
                    required
                    placeholder="120"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-gray-900"
                  />
                </div>

                {/* Stock Level (Admin controls) */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('stockInput')} *</label>
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

              <button 
                type="submit"
                className="w-full luxury-btn-gold py-3.5 rounded-xl text-xs font-bold mt-4"
              >
                {t('saveChanges')}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
