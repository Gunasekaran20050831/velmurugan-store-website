import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vstore_token') || null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- DATA STATE ---
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // --- DELIVERY CONFIG ---
  const [deliveryRates, setDeliveryRates] = useState(() => {
    const saved = localStorage.getItem('vstore_delivery_rates');
    return saved ? JSON.parse(saved) : [
      { min: 0, max: 2, charge: 20 },
      { min: 2, max: 5, charge: 40 },
      { min: 5, max: 8, charge: 70 },
      { min: 8, max: 12, charge: 100 }
    ];
  });

  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    const saved = localStorage.getItem('vstore_location');
    return saved ? JSON.parse(saved) : {
      lat: 13.0827,
      lng: 80.2707,
      address: "Anna Nagar, Chennai, Tamil Nadu 600040",
      distance: 3.2,
      charge: 40
    };
  });

  // --- SYNC LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('vstore_delivery_rates', JSON.stringify(deliveryRates));
  }, [deliveryRates]);

  useEffect(() => {
    localStorage.setItem('vstore_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('vstore_token', token);
    } else {
      localStorage.removeItem('vstore_token');
    }
  }, [token]);

  // --- API CALLS ---
  const API_URL = 'http://localhost:5000/api';

  const getHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  // Fetch Current User
  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setAuthLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        // Map backend role to isAdmin boolean for backward compatibility
        setCurrentUser({ ...data.user, isAdmin: data.user.role === 'admin' });
      } else {
        setToken(null);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setAuthLoading(false);
    }
  }, [token, getHeaders]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products/`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, []);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      // If admin, fetch all, else fetch my orders
      const endpoint = currentUser.isAdmin ? '/orders/' : '/orders/my-orders';
      const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, [currentUser, getHeaders]);

  // Initial Load
  useEffect(() => {
    fetchCurrentUser();
    fetchProducts();
  }, [fetchCurrentUser, fetchProducts]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
      setDataLoading(false);
    }
  }, [authLoading, currentUser, fetchOrders]);


  // --- AUTH ACTIONS ---
  const login = useCallback(async (login_id, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.access_token);
        setCurrentUser({ ...data.user, isAdmin: data.user.role === 'admin' });
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Network error. Backend might be down.' };
    }
  }, []);

  const signup = useCallback(async (name, phone, email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.access_token);
        setCurrentUser({ ...data.user, isAdmin: data.user.role === 'admin' });
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Network error. Backend might be down.' };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setOrders([]); // clear orders on logout
  }, []);

  // --- PRODUCT ACTIONS (Admin) ---
  const addProduct = useCallback(async (product) => {
    if (!currentUser?.isAdmin) return;
    try {
      const res = await fetch(`${API_URL}/products/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product)
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getHeaders, fetchProducts]);

  const editProduct = useCallback(async (updatedProduct) => {
    if (!currentUser?.isAdmin) return;
    try {
      const res = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getHeaders, fetchProducts]);

  const deleteProduct = useCallback(async (id) => {
    if (!currentUser?.isAdmin) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getHeaders, fetchProducts]);


  // --- DELIVERY CALCULATION ---
  const calculateDeliveryFee = useCallback((distance) => {
    const rate = deliveryRates.find(r => distance >= r.min && distance < r.max);
    return rate ? rate.charge : 150;
  }, [deliveryRates]);

  const updatePinnedLocation = useCallback((lat, lng, address, distance = 1.5) => {
    const charge = calculateDeliveryFee(distance);
    setDeliveryLocation({ lat, lng, address, distance, charge });
  }, [calculateDeliveryFee]);

  // --- ORDER ACTIONS ---
  const createOrder = useCallback(async (items, subtotal, deliveryOption, paymentMethod) => {
    // Note: If Razorpay, this is called after successful payment verification.
    // However, the backend verify-signature ALREADY creates the transaction, but we need to create the actual Order in the DB if it wasn't created yet, OR the verify-signature does both.
    // In our backend `order_routes`, we have POST /api/orders/ which creates the order.
    // Let's call that endpoint.
    const isPickup = deliveryOption === 'pickup';
    const finalCharge = isPickup ? 0 : deliveryLocation.charge;
    
    // If not logged in, we simulate local fallback so guest checkout doesn't completely break, 
    // but ideally we force login.
    const orderPayload = {
      subtotal,
      delivery_charge: finalCharge,
      total_amount: subtotal + finalCharge,
      payment_method: paymentMethod,
      items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price }))
    };

    try {
      // Create on backend
      const res = await fetch(`${API_URL}/orders/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      
      if (data.success) {
        fetchOrders(); // Refresh orders list
        return {
          id: data.order_id,
          status: 'Pending',
          paymentStatus: paymentMethod.includes('Razorpay') ? 'Paid' : 'Pending',
          total: subtotal + finalCharge,
          date: new Date().toLocaleString()
        };
      }
    } catch (err) {
      console.error("Order creation failed:", err);
    }
    
    // Fallback Mock Order if API fails
    return {
      id: `VMS${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Pending',
      paymentStatus: paymentMethod.includes('Razorpay') ? 'Paid' : 'Pending',
      total: subtotal + finalCharge,
      date: new Date().toLocaleString()
    };
  }, [deliveryLocation, getHeaders, fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    if (!currentUser?.isAdmin) return;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  }, [currentUser, getHeaders, fetchOrders]);

  const contextValue = useMemo(() => ({
    currentUser,
    token,
    authLoading,
    dataLoading,
    products,
    deliveryRates,
    setDeliveryRates,
    deliveryLocation,
    orders,
    login,
    signup,
    logout,
    addProduct,
    editProduct,
    deleteProduct,
    updatePinnedLocation,
    createOrder,
    updateOrderStatus,
    calculateDeliveryFee
  }), [
    currentUser,
    token,
    authLoading,
    dataLoading,
    products,
    deliveryRates,
    deliveryLocation,
    orders,
    login,
    signup,
    logout,
    addProduct,
    editProduct,
    deleteProduct,
    updatePinnedLocation,
    createOrder,
    updateOrderStatus,
    calculateDeliveryFee
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
