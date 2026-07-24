import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ord.id.toLowerCase().includes(query) ||
      (ord.paymentId && ord.paymentId.toLowerCase().includes(query)) ||
      ord.paymentMethod.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-1">
        <h3 className="text-sm font-extrabold text-primary">Customer Order Manager</h3>
        <input 
          type="text"
          placeholder="Search Order ID, Payment ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-xl text-xs border border-gray-200 glass-input min-w-[250px]"
        />
      </div>
      
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-gray-150 text-center">
            <span className="text-gray-400 font-bold text-xs block">No orders found.</span>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div 
              key={ord.id}
              className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm text-xs text-left space-y-4"
            >
              {/* Header info */}
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-primary text-sm">Order ID: #{ord.id}</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${ord.paymentMethod.includes('Razorpay') ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {ord.paymentMethod}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Date: {ord.date}</span>
                  {ord.paymentId && (
                    <span className="text-[10px] text-primary font-mono block mt-1 bg-primary/5 inline-block px-2 py-0.5 rounded">Txn ID: {ord.paymentId}</span>
                  )}
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
          ))
        )}
      </div>
    </div>
  );
}
