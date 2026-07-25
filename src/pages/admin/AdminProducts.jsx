import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { Plus, Edit3, Trash2, Search, Filter, Download, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import AddProductModal from './AddProductModal';

export default function AdminProducts() {
  const { t } = useLanguage();
  const { products, addProduct, editProduct, deleteProduct } = useApp();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [showModal, setShowModal] = useState(false);
  const [editingProd, setEditingProd] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = new Map();
    products.forEach(p => {
      if (p.category_id && p.category_name) {
        cats.set(p.category_id, { id: p.category_id, name: p.category_name });
      }
    });
    return Array.from(cats.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoryFilter ? p.category_id.toString() === categoryFilter : true;
      const matchStatus = statusFilter === 'all' ? true : 
                          statusFilter === 'active' ? p.active : !p.active;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) return;
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => [
        p.id, `"${p.name}"`, p.sku || '', `"${p.category_name || ''}"`, 
        p.selling_price || p.price, p.stock, p.active ? 'Active' : 'Inactive', p.created_at
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'products_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      for (const id of selectedIds) {
        await deleteProduct(id);
      }
      setSelectedIds([]);
    }
  };

  const handleSaveProduct = async (payload) => {
    if (editingProd) {
      await editProduct(editingProd.id, payload);
    } else {
      await addProduct(payload);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-primary">Products Management</h2>
          <p className="text-xs text-gray-500 font-semibold">{filteredProducts.length} total products</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setEditingProd(null); setShowModal(true); }} className="luxury-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products by name or SKU..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        
        <div className="flex items-center gap-3">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none font-semibold text-gray-700 min-w-[150px]">
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id.toString()}>{c.name}</option>
            ))}
          </select>
          
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none font-semibold text-gray-700 min-w-[130px]">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 px-4 py-3 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
          <span className="text-sm font-bold text-primary">{selectedIds.length} items selected</span>
          <div className="flex items-center gap-3">
            <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 flex items-center gap-1.5 shadow-sm">
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500 font-semibold">No products found.</td>
                </tr>
              ) : (
                paginatedProducts.map(product => {
                  const images = Array.isArray(product.images) ? product.images : [];
                  const thumb = product.thumbnail || images[0];
                  
                  return (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => handleSelect(product.id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                            {thumb ? <img src={thumb.startsWith('http') ? thumb : `http://localhost:5000${thumb}`} alt={product.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{product.name}</p>
                            {product.featured && <span className="text-[9px] font-black uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-gray-600">{product.sku || '-'}</td>
                      <td className="p-4 text-xs font-semibold text-gray-600">{product.category_name || '-'}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-primary">₹{product.selling_price || product.price}</span>
                          {product.mrp && <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        {product.active ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                            <CheckCircle className="w-3.5 h-3.5" /> Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingProd(product); setShowModal(true); }} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if(window.confirm('Delete product?')) deleteProduct(product.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-xs font-semibold text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AddProductModal 
          categories={categories}
          initialData={editingProd}
          onClose={() => setShowModal(false)}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
}
