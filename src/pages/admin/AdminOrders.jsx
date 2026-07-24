import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Download, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All'); // 'All', 'Today', 'Week', 'Month'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ord => 
        ord.id.toString().toLowerCase().includes(query) ||
        (ord.paymentId && ord.paymentId.toLowerCase().includes(query)) ||
        ord.paymentMethod.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(ord => ord.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'All') {
      const now = new Date();
      result = result.filter(ord => {
        const orderDate = new Date(ord.date); // Assuming ord.date is ISO or parseable
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (dateFilter === 'Today') return diffDays <= 1;
        if (dateFilter === 'Week') return diffDays <= 7;
        if (dateFilter === 'Month') return diffDays <= 30;
        return true;
      });
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, searchQuery, statusFilter, dateFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    if (filteredOrders.length === 0) return alert("No data to export!");
    
    // Headers
    const headers = ['Order ID', 'Date', 'Customer Phone', 'Status', 'Payment Method', 'Payment ID', 'Total Items', 'Total Amount', 'Delivery Distance', 'Delivery Charge'];
    
    // Rows
    const csvRows = filteredOrders.map(ord => {
      const itemsCount = ord.items.reduce((sum, item) => sum + item.quantity, 0);
      return [
        ord.id,
        ord.date,
        ord.userPhone,
        ord.status,
        ord.paymentMethod,
        ord.paymentId || 'N/A',
        itemsCount,
        ord.total,
        ord.distance,
        ord.deliveryCharge
      ].join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `orders_export_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface/50 p-4 rounded-3xl border border-border shadow-sm backdrop-blur-md">
        <div>
          <h3 className="text-sm font-extrabold text-primary">Order Manager</h3>
          <p className="text-[10px] text-muted font-semibold mt-0.5">Showing {filteredOrders.length} results</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-grow lg:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text"
              placeholder="Search ID, Txn..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 w-full lg:w-48 rounded-xl text-xs border border-border glass-input"
            />
          </div>

          {/* Filters */}
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl text-xs border border-border glass-input bg-transparent font-semibold text-text"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Preparing">Preparing</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select 
            value={dateFilter} 
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl text-xs border border-border glass-input bg-transparent font-semibold text-text"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="Week">Last 7 Days</option>
            <option value="Month">Last 30 Days</option>
          </select>

          {/* Export */}
          <button 
            onClick={exportCSV}
            className="luxury-btn-primary flex items-center space-x-1.5 px-4 py-2 rounded-xl text-[10px] font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="space-y-4">
        {paginatedOrders.length === 0 ? (
          <EmptyState 
            title="No orders found" 
            message="No orders match your current filters. Try clearing the search or changing the date range."
            actionLabel={searchQuery || statusFilter !== 'All' ? "Clear Filters" : null}
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setDateFilter('All');
            }}
          />
        ) : (
          paginatedOrders.map((ord) => (
            <div 
              key={ord.id}
              className="glass-card p-6 rounded-3xl text-xs text-left space-y-4 transition-all duration-300"
            >
              {/* Header info */}
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-primary text-sm">#{ord.id}</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${ord.paymentMethod.includes('Razorpay') ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-surface border border-border text-muted'}`}>
                      {ord.paymentMethod}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted block mt-1">{new Date(ord.date).toLocaleString()}</span>
                  {ord.paymentId && (
                    <span className="text-[9px] text-primary font-mono block mt-1 bg-primary/5 inline-block px-2 py-0.5 rounded border border-primary/10">Txn: {ord.paymentId}</span>
                  )}
                </div>
                
                {/* Status Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-muted text-[10px] uppercase tracking-wider">Status:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-primary focus:outline-none cursor-pointer text-[10px] bg-surface border border-border shadow-sm`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Items list */}
                <div className="space-y-2">
                  <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">Ordered Items</span>
                  <div className="divide-y divide-border">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 font-semibold text-text">
                        <span className="truncate pr-2">{item.name} <span className="text-muted text-[10px]">(x{item.quantity})</span></span>
                        <span className="shrink-0 text-primary">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer details & address */}
                <div className="space-y-1.5 text-left border-l md:border-t-0 md:border-l border-border pl-0 md:pl-6 pt-4 md:pt-0">
                  <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">Customer Details</span>
                  <div className="space-y-1 mt-2">
                    <span className="font-bold text-primary block">{ord.userPhone}</span>
                    <span className="text-text block leading-relaxed line-clamp-3">{ord.address}</span>
                  </div>
                </div>

                {/* Location distance rates calculation */}
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-border pl-0 md:pl-6 pt-4 md:pt-0">
                  <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">Calculations</span>
                  <div className="space-y-1 font-semibold bg-surface/50 p-3 rounded-xl border border-border">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted">Distance:</span>
                      <span className="text-text">{ord.distance} km</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted">Delivery Charge:</span>
                      <span className="text-text">₹{ord.deliveryCharge}</span>
                    </div>
                    <hr className="border-border my-2" />
                    <div className="flex justify-between text-primary font-black text-sm">
                      <span>Total:</span>
                      <span>₹{ord.total}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full glass-input disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-muted">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full glass-input disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
}
