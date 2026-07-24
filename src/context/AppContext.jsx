import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialProducts = [
  {
    id: 1,
    name: "Fresh Red Apples",
    nameTa: "புதிய சிவப்பு ஆப்பிள்கள்",
    category: "Fruits & Veg",
    categoryTa: "பழங்கள் & காய்கறிகள்",
    price: 120,
    rating: 4.6,
    ratingCount: 128,
    description: "Premium crispy royal gala apples imported from fresh orchards, packed with iron and vitamins.",
    descriptionTa: "புதிய பழத்தோட்டங்களில் இருந்து இறக்குமதி செய்யப்பட்ட பிரீமியம் ஆப்பிள்கள், இரும்பு மற்றும் வைட்டமின்கள் நிறைந்தது.",
    images: [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1579613832125-5d34a13ff2a8?auto=format&fit=crop&q=80&w=600"
    ],
    specifications: [
      { key: "Weight", value: "1 kg (approx. 5-6 units)" },
      { key: "Origin", value: "Himachal Pradesh, India" },
      { key: "Shelf Life", value: "7 Days" }
    ],
    reviews: [
      { id: 1, user: "Karthik Raja", rating: 5, comment: "Extremely fresh and crunchy! Worth the premium pricing.", date: "2026-07-20" },
      { id: 2, user: "Meena S.", rating: 4, comment: "Good quality, prompt home delivery.", date: "2026-07-18" }
    ],
    stock: 25
  },
  {
    id: 2,
    name: "Premium Farm Fresh Milk",
    nameTa: "பிரீமியம் பசுவின் பால்",
    category: "Dairy & Eggs",
    categoryTa: "பால் & முட்டை",
    price: 60,
    rating: 4.8,
    ratingCount: 94,
    description: "100% pure organic cow milk pasteurized within hours of milking. Contains essential nutrients.",
    descriptionTa: "100% தூய ஆர்கானிக் பசுவின் பால். அத்தியாவசிய ஊட்டச்சத்துக்கள் நிறைந்தது.",
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600"
    ],
    specifications: [
      { key: "Volume", value: "1 Liter" },
      { key: "Fat Content", value: "3.5% Standardized" },
      { key: "Shelf Life", value: "2 Days (Keep refrigerated)" }
    ],
    reviews: [
      { id: 1, user: "Suresh Kumar", rating: 5, comment: "Taste is very natural, children love it.", date: "2026-07-22" }
    ],
    stock: 12
  },
  {
    id: 3,
    name: "Aashirvaad Shudh Chakki Atta",
    nameTa: "ஆசிர்வாத் கோதுமை மாவு",
    category: "Staples",
    categoryTa: "மளிகை பொருட்கள்",
    price: 265,
    rating: 4.5,
    ratingCount: 210,
    description: "Premium chakki wheat flour milled from robust golden grains to make soft, healthy rotis.",
    descriptionTa: "உயர்தர கோதுமையிலிருந்து தயாரிக்கப்பட்ட மாவு, மென்மையான ரொட்டிகள் செய்ய ஏற்றது.",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
    ],
    specifications: [
      { key: "Weight", value: "5 kg" },
      { key: "Type", value: "Whole Wheat Flour" },
      { key: "Brand", value: "ITC Aashirvaad" }
    ],
    reviews: [
      { id: 1, user: "Vijay V.", rating: 5, comment: "Makes very soft chapatis. Best brand.", date: "2026-07-15" }
    ],
    stock: 18
  },
  {
    id: 4,
    name: "Pure Organic Coconut Oil",
    nameTa: "தூய தேங்காய் எண்ணெய்",
    category: "Staples",
    categoryTa: "மளிகை பொருட்கள்",
    price: 195,
    rating: 4.7,
    ratingCount: 75,
    description: "Cold-pressed coconut oil extracted from sun-dried coconuts. Perfect for luxury cooking and massage.",
    descriptionTa: "வெயிலில் உலர்த்திய தேங்காயில் இருந்து செக்கில் ஆட்டப்பட்ட தேங்காய் எண்ணெய்.",
    images: [
      "https://images.unsplash.com/photo-1622484211148-716598e04041?auto=format&fit=crop&q=80&w=600"
    ],
    specifications: [
      { key: "Volume", value: "500 ml" },
      { key: "Type", value: "Cold Pressed / Virgin" },
      { key: "Packaging", value: "Glass Bottle" }
    ],
    reviews: [
      { id: 1, user: "Anitha M.", rating: 4, comment: "High quality aroma. Highly recommended.", date: "2026-07-12" }
    ],
    stock: 0 // Out of Stock
  },
  {
    id: 5,
    name: "Fresh Farm Tomatoes",
    nameTa: "நாட்டு தக்காளி",
    category: "Fruits & Veg",
    categoryTa: "பழங்கள் & காய்கறிகள்",
    price: 40,
    rating: 4.3,
    ratingCount: 154,
    description: "Organic, pesticide-free ripe red country tomatoes sourced directly from local farmers.",
    descriptionTa: "உள்ளூர் விவசாயிகளிடமிருந்து நேரடியாகப் பெறப்பட்ட ஆர்கானிக் தக்காளி பழங்கள்.",
    images: [
      "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600"
    ],
    specifications: [
      { key: "Weight", value: "1 kg" },
      { key: "Type", value: "Country Ripe" },
      { key: "Shelf Life", value: "4 Days" }
    ],
    reviews: [
      { id: 1, user: "Ramya N.", rating: 4, comment: "Tastes sour and nice, perfect for Rasam.", date: "2026-07-23" }
    ],
    stock: 30
  },
  {
    id: 6,
    name: "Premium Mysore Sandal Soap",
    nameTa: "மைசூர் சாண்டல் சோப்",
    category: "Personal Care",
    categoryTa: "தனிநபர் பராமரிப்பு",
    price: 85,
    rating: 4.9,
    ratingCount: 310,
    description: "Luxury sandalwood soap made from natural sandalwood oil. Leaves skin radiant and glowing.",
    descriptionTa: "இயற்கை சந்தன எண்ணெயில் இருந்து தயாரிக்கப்பட்ட சொகுசு சோப்.",
    images: [
      "https://images.unsplash.com/photo-1607006342411-b0135417926c?auto=format&fit=crop&q=80&w=600"
    ],
    specifications: [
      { key: "Weight", value: "150g" },
      { key: "Fragrance", value: "Natural Sandalwood" },
      { key: "TFM", value: "80% Grade 1" }
    ],
    reviews: [
      { id: 1, user: "Revathi S.", rating: 5, comment: "Nothing beats Mysore Sandal scent. True royalty.", date: "2026-07-21" }
    ],
    stock: 20
  }
];

export const AppProvider = ({ children }) => {
  // Authentication
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vstore_user');
    return saved ? JSON.parse(saved) : null; // { name, email, phone, isAdmin }
  });

  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('vstore_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Delivery configuration (Can be updated by Admin)
  const [deliveryRates, setDeliveryRates] = useState(() => {
    const saved = localStorage.getItem('vstore_delivery_rates');
    return saved ? JSON.parse(saved) : [
      { min: 0, max: 2, charge: 20 },
      { min: 2, max: 5, charge: 40 },
      { min: 5, max: 8, charge: 70 },
      { min: 8, max: 12, charge: 100 }
    ];
  });

  // Active Pinned Location
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    const saved = localStorage.getItem('vstore_location');
    return saved ? JSON.parse(saved) : {
      lat: 13.0827, // Chennai Coordinates Default
      lng: 80.2707,
      address: "Anna Nagar, Chennai, Tamil Nadu 600040",
      distance: 3.2, // km
      charge: 40
    };
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('vstore_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: "VMS12568",
        date: "2026-07-24 10:30 AM",
        items: [
          { id: 1, name: "Fresh Red Apples", price: 120, quantity: 2 },
          { id: 2, name: "Premium Farm Fresh Milk", price: 60, quantity: 1 }
        ],
        subtotal: 300,
        deliveryCharge: 40,
        total: 340,
        address: "Anna Nagar, Chennai, Tamil Nadu 600040",
        distance: 3.2,
        paymentMethod: "UPI (Google Pay)",
        paymentStatus: "Paid",
        status: "Accepted", // Pending, Accepted, Preparing, Out For Delivery, Delivered
        userPhone: "+91 98765 43210"
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vstore_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vstore_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vstore_delivery_rates', JSON.stringify(deliveryRates));
  }, [deliveryRates]);

  useEffect(() => {
    localStorage.setItem('vstore_location', JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    localStorage.setItem('vstore_orders', JSON.stringify(orders));
  }, [orders]);

  // Authenticate user
  const login = (emailOrPhone, password) => {
    // Basic mock authentication
    if (emailOrPhone === 'admin' || emailOrPhone === 'admin@vstore.com') {
      const user = { name: "Store Admin", email: "admin@vstore.com", phone: "+91 99999 99999", isAdmin: true };
      setCurrentUser(user);
      return { success: true, user };
    }
    const user = { name: "Velmurugan", email: "user@example.com", phone: "+91 98876 43210", isAdmin: false };
    setCurrentUser(user);
    return { success: true, user };
  };

  const signup = (name, phone, email, password) => {
    const user = { name, email, phone, isAdmin: false };
    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Product CRUD (Admin operations)
  const addProduct = (product) => {
    setProducts(prev => {
      const newProd = { ...product, id: prev.length + 1 };
      return [...prev, newProd];
    });
  };

  const editProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Distance to delivery fee calculator
  const calculateDeliveryFee = (distance) => {
    const rate = deliveryRates.find(r => distance >= r.min && distance < r.max);
    return rate ? rate.charge : 150; // Default flat rate for >12km
  };

  // Pinned location setter (Updates fee automatically)
  const updatePinnedLocation = (lat, lng, address, distance = 1.5) => {
    const charge = calculateDeliveryFee(distance);
    setDeliveryLocation({ lat, lng, address, distance, charge });
  };

  // Add Order
  const createOrder = (items, subtotal, deliveryOption, paymentMethod) => {
    const newOrderId = `VMS${Math.floor(10000 + Math.random() * 90000)}`;
    const isPickup = deliveryOption === 'pickup';
    const finalCharge = isPickup ? 0 : deliveryLocation.charge;
    const dateStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newOrder = {
      id: newOrderId,
      date: dateStr,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      subtotal,
      deliveryCharge: finalCharge,
      total: subtotal + finalCharge,
      address: isPickup ? "Store Pickup (No Address Required)" : deliveryLocation.address,
      distance: isPickup ? 0 : deliveryLocation.distance,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Pending',
      userPhone: currentUser ? currentUser.phone : "+91 98876 43210"
    };

    // Update stocks (Customer actions)
    setProducts(prevProds => {
      return prevProds.map(p => {
        const ordered = items.find(item => item.id === p.id);
        if (ordered) {
          return { ...p, stock: Math.max(0, p.stock - ordered.quantity) };
        }
        return p;
      });
    });

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Admin order status modifier
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Auto-progress active order simulation (Swiggy flow simulation)
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status !== 'Delivered');
    if (pendingOrders.length === 0) return;

    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const updated = prevOrders.map(order => {
          if (order.status === 'Pending') {
            changed = true;
            return { ...order, status: 'Accepted' };
          } else if (order.status === 'Accepted') {
            changed = true;
            return { ...order, status: 'Preparing' };
          } else if (order.status === 'Preparing') {
            changed = true;
            return { ...order, status: 'Out For Delivery' };
          } else if (order.status === 'Out For Delivery') {
            changed = true;
            return { ...order, status: 'Delivered' };
          }
          return order;
        });
        if (changed) return updated;
        return prevOrders;
      });
    }, 25000); // Progress status every 25 seconds for demonstration

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <AppContext.Provider value={{
      currentUser,
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
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
