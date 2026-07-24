import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // General / Headers
    brandName: "VELMURUGAN STORE",
    tagline: "Shop • Deliver • Smile",
    searchPlaceholder: "Search for products, categories, brands...",
    deliverTo: "Deliver to",
    selectLocation: "Select Delivery Location",
    languageLabel: "Language",
    english: "English",
    tamil: "தமிழ்",
    searchSuggested: "Suggestions",
    
    // Auth
    welcomeBack: "Welcome Back! 👋",
    loginSubtitle: "Login to continue your premium shopping",
    createAccount: "Create Account",
    signupSubtitle: "Sign up to get started as a luxury customer",
    emailOrPhone: "Email / Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    agreeTerms: "I agree to the Terms & Conditions",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password?",
    loginBtn: "Login",
    signupBtn: "Sign Up",
    logoutBtn: "Logout",
    haveAccount: "Already have an account? Login",
    dontHaveAccount: "Don't have an account? Sign Up",
    otpTitle: "Verify Mobile Number",
    otpSubtitle: "Enter the 4-digit code sent to your phone",
    otpVerify: "Verify & Proceed",
    otpResend: "Resend Code",
    
    // Navigation
    navHome: "Home",
    navCategories: "Categories",
    navOrders: "Orders",
    navWishlist: "Wishlist",
    navProfile: "Profile",
    navAdmin: "Admin Panel",

    // Home Page
    categoriesTitle: "Shop Categories",
    featuredProducts: "Featured Products",
    bestSellers: "Best Sellers",
    recentlyAdded: "Recently Added",
    popularProducts: "Popular Products",
    viewAll: "View All",
    megaSale: "MEGA SALE",
    upTo50Off: "UP TO 50% OFF",
    onAllProducts: "On all grocery & premium staples",
    shopNow: "Shop Now",

    // Product Card / Details
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    outOfStock: "Out of Stock",
    productDesc: "Product Description",
    specifications: "Specifications",
    reviews: "Customer Reviews",
    relatedProducts: "Related Products",
    ratingCount: "ratings",
    verifiedPurchase: "Verified Purchase",
    qty: "Qty",

    // Cart
    myCart: "My Cart",
    cartEmpty: "Your luxury cart is empty",
    startShopping: "Start Shopping",
    itemTotal: "Item Total",
    deliveryCharge: "Delivery Charge",
    totalAmount: "Total Amount",
    proceedToCheckout: "Proceed to Checkout",
    remove: "Remove",
    orderSummary: "Order Summary",
    free: "FREE",

    // Checkout
    checkoutTitle: "Checkout",
    deliveryOption: "Select Delivery Option",
    storePickup: "Store Pickup",
    storePickupDesc: "Pick up your order directly from our store (No Delivery Charge)",
    homeDelivery: "Home Delivery",
    homeDeliveryDesc: "Get your order delivered to your doorstep in minutes",
    pinnedLocation: "Pinned Location",
    distanceFromStore: "Distance from store",
    calculateCharge: "Calculating charge...",
    confirmLocation: "Confirm Location",
    continueCheckout: "Continue to Payment",
    detectCurrentLoc: "Detect Current Location",
    searchLocPlaceholder: "Search area, street or building...",

    // Payments
    paymentTitle: "Select Payment Method",
    cod: "Cash On Delivery",
    codDesc: "Pay cash/UPI when you receive your order",
    upi: "UPI Payment",
    upiDesc: "Pay using any installed UPI application",
    payNow: "Pay Now",
    processingPayment: "Processing Premium Payment...",
    upiSimTitle: "UPI Application Trigger",
    upiSimSubtitle: "Simulating secure application redirection",
    enterUpiPin: "Enter UPI PIN",
    upiPinPlaceholder: "Enter 4 or 6-digit PIN",
    upiConfirmBtn: "Authorize Payment",
    merchantName: "Merchant Name",
    merchantUpi: "Merchant UPI ID",
    orderId: "Order ID",
    amountToPay: "Amount to Pay",

    // Order Success
    orderPlacedSuccess: "Order Placed Successfully!",
    orderSuccessDesc: "Your premium order has been recorded and is being prepared with care.",
    trackOrder: "Track Order",
    continueShopping: "Continue Shopping",

    // Order Tracking
    orderTrackingTitle: "Order Tracking",
    orderPlaced: "Order Placed",
    orderAccepted: "Order Accepted",
    orderPreparing: "Preparing Order",
    outForDelivery: "Out For Delivery",
    delivered: "Delivered",
    orderStatusDesc: "Check your delivery progress below",
    deliveryPartner: "Delivery Partner",
    callPartner: "Call Partner",

    // Profile
    myProfile: "My Profile",
    savedAddresses: "Saved Addresses",
    myOrders: "My Orders",
    settings: "Settings",
    helpSupport: "Help & Support",
    addNewAddress: "Add New Address",

    // Admin Dashboard
    adminTitle: "Admin Dashboard",
    dashboard: "Dashboard",
    revenue: "Revenue",
    totalOrders: "Total Orders",
    customers: "Customers",
    products: "Products",
    analytics: "Analytics & Reports",
    salesOverview: "Sales Overview",
    orderStatus: "Order Status Breakdown",
    recentOrders: "Recent Orders",
    addProdBtn: "Add New Product",
    editProdBtn: "Edit Product",
    deleteProdBtn: "Delete Product",
    manageInventory: "Inventory & Stock",
    stockStatus: "Stock Status",
    inStock: "In Stock",
    adminStockQty: "Visible Stock Level (Admin Only):",
    saveChanges: "Save Changes",
    uploadImages: "Upload Multiple Images",
    prodNameInput: "Product Name",
    priceInput: "Price (₹)",
    categoryInput: "Category",
    stockInput: "Initial Stock",
    descInput: "Description",
  },
  ta: {
    // General / Headers
    brandName: "வேல்முருகன் ஸ்டோர்",
    tagline: "ஷாப் • டெலிவரி • புன்னகை",
    searchPlaceholder: "தயாரிப்புகள், வகைகள், பிராண்டுகளைத் தேடுக...",
    deliverTo: "டெலிவரி செய்யுமிடம்",
    selectLocation: "டெலிவரி இடத்தை தேர்வு செய்க",
    languageLabel: "மொழி",
    english: "English",
    tamil: "தமிழ்",
    searchSuggested: "பரிந்துரைகள்",

    // Auth
    welcomeBack: "மீண்டும் வருக! 👋",
    loginSubtitle: "உங்கள் பிரீமியம் ஷாப்பிங்கைத் தொடர உள்நுழைக",
    createAccount: "கணக்கை உருவாக்கு",
    signupSubtitle: "ஒரு சொகுசு வாடிக்கையாளராக தொடங்க பதிவு செய்க",
    emailOrPhone: "மின்னஞ்சல் / தொலைபேசி எண்",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்து",
    fullName: "முழு பெயர்",
    phoneNumber: "தொலைபேசி எண்",
    agreeTerms: "விதிமுறைகள் மற்றும் நிபந்தனைகளை ஒப்புக்கொள்கிறேன்",
    rememberMe: "என்னை நினைவில் கொள்க",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    loginBtn: "உள்நுழைக",
    signupBtn: "பதிவு செய்க",
    logoutBtn: "வெளியேறு",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    dontHaveAccount: "கணக்கு இல்லையா? பதிவு செய்க",
    otpTitle: "கைபேசி எண்ணை சரிபார்க்கவும்",
    otpSubtitle: "உங்கள் கைபேசிக்கு அனுப்பப்பட்ட 4-இலக்க குறியீட்டை உள்ளிடவும்",
    otpVerify: "சரிபார்த்து தொடரவும்",
    otpResend: "மீண்டும் குறியீட்டை அனுப்பு",

    // Navigation
    navHome: "முகப்பு",
    navCategories: "பிரிவுகள்",
    navOrders: "ஆர்டர்கள்",
    navWishlist: "விருப்பப்பட்டியல்",
    navProfile: "சுயவிவரம்",
    navAdmin: "நிர்வாக குழு",

    // Home Page
    categoriesTitle: "ஷாப்பிங் பிரிவுகள்",
    featuredProducts: "சிறப்பு தயாரிப்புகள்",
    bestSellers: "அதிகம் விற்பனையாகும் தயாரிப்புகள்",
    recentlyAdded: "சமீபத்தில் சேர்க்கப்பட்டவை",
    popularProducts: "பிரபலமான தயாரிப்புகள்",
    viewAll: "அனைத்தையும் காட்டு",
    megaSale: "மெகா தள்ளுபடி விற்பனை",
    upTo50Off: "50% வரை தள்ளுபடி",
    onAllProducts: "அனைத்து மளிகை மற்றும் பிரீமியம் பொருட்களுக்கு",
    shopNow: "இப்போதே வாங்கு",

    // Product Card / Details
    addToCart: "கூடையில் சேர்",
    buyNow: "இப்போதே வாங்கு",
    outOfStock: "இருப்பு இல்லை",
    productDesc: "தயாரிப்பு விவரம்",
    specifications: "விவரக்குறிப்புகள்",
    reviews: "வாடிக்கையாளர் மதிப்புரைகள்",
    relatedProducts: "தொடர்புடைய தயாரிப்புகள்",
    ratingCount: "மதிப்பீடுகள்",
    verifiedPurchase: "சரிபார்க்கப்பட்ட வாங்குதல்",
    qty: "அளவு",

    // Cart
    myCart: "எனது கூடை",
    cartEmpty: "உங்கள் சொகுசு கூடை காலியாக உள்ளது",
    startShopping: "ஷாப்பிங் செய்யத் தொடங்குங்கள்",
    itemTotal: "பொருட்களின் மொத்தம்",
    deliveryCharge: "டெலிவரி கட்டணம்",
    totalAmount: "மொத்த தொகை",
    proceedToCheckout: "செக்அவுட் செய்ய தொடரவும்",
    remove: "நீக்கு",
    orderSummary: "ஆர்டர் சுருக்கம்",
    free: "இலவசம்",

    // Checkout
    checkoutTitle: "செக்அவுட்",
    deliveryOption: "டெலிவரி விருப்பத்தை தேர்வு செய்க",
    storePickup: "கடையில் வந்து வாங்குதல்",
    storePickupDesc: "எங்கள் கடையில் இருந்து நேரடியாக உங்கள் ஆர்டரைப் பெறுங்கள் (டெலிவரி கட்டணம் இல்லை)",
    homeDelivery: "வீட்டுக்கு டெலிவரி",
    homeDeliveryDesc: "சில நிமிடங்களில் உங்கள் ஆர்டரை உங்கள் வீட்டு வாசலில் பெறுங்கள்",
    pinnedLocation: "குறிக்கப்பட்ட இடம்",
    distanceFromStore: "கடையிலிருந்து தூரம்",
    calculateCharge: "கட்டணத்தை கணக்கிடுகிறது...",
    confirmLocation: "இடத்தை உறுதிப்படுத்து",
    continueCheckout: "பணம் செலுத்த தொடரவும்",
    detectCurrentLoc: "தற்போதைய இடத்தை கண்டறிக",
    searchLocPlaceholder: "பகுதி, தெரு அல்லது கட்டிடத்தை தேடுக...",

    // Payments
    paymentTitle: "பணம் செலுத்தும் முறையைத் தேர்ந்தெடுங்கள்",
    cod: "டெலிவரியின் போது பணம் செலுத்துதல்",
    codDesc: "ஆர்டரை பெறும்போது ரொக்கம்/UPI மூலம் செலுத்தவும்",
    upi: "UPI மூலம் பணம் செலுத்துதல்",
    upiDesc: "மொபைலில் உள்ள ஏதேனும் ஒரு UPI செயலியைப் பயன்படுத்தி செலுத்தவும்",
    payNow: "இப்போதே செலுத்து",
    processingPayment: "பிரீமியம் பணம் செலுத்துதல் செயலாக்கப்படுகிறது...",
    upiSimTitle: "UPI செயலி இணைப்பு",
    upiSimSubtitle: "பாதுகாப்பான செயலி திருப்பிவிடல் உருவகப்படுத்துதல்",
    enterUpiPin: "UPI பின்-ஐ உள்ளிடவும்",
    upiPinPlaceholder: "4 அல்லது 6 இலக்க பின்-ஐ உள்ளிடவும்",
    upiConfirmBtn: "பணத்தை அங்கீகரி",
    merchantName: "வணிகர் பெயர்",
    merchantUpi: "வணிகர் UPI ஐடி",
    orderId: "ஆர்டர் ஐடி",
    amountToPay: "செலுத்த வேண்டிய தொகை",

    // Order Success
    orderPlacedSuccess: "ஆர்டர் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    orderSuccessDesc: "உங்கள் பிரீமியம் ஆர்டர் பதிவு செய்யப்பட்டு, மிகுந்த கவனத்துடன் தயாரிக்கப்பட்டு வருகிறது.",
    trackOrder: "ஆர்டரை கண்காணி",
    continueShopping: "ஷாப்பிங் தொடரவும்",

    // Order Tracking
    orderTrackingTitle: "ஆர்டர் கண்காணிப்பு",
    orderPlaced: "ஆர்டர் செய்யப்பட்டது",
    orderAccepted: "ஆர்டர் ஏற்கப்பட்டது",
    orderPreparing: "ஆர்டர் தயாராகிறது",
    outForDelivery: "டெலிவரிக்கு வெளியே உள்ளது",
    delivered: "டெலிவரி செய்யப்பட்டது",
    orderStatusDesc: "உங்கள் டெலிவரி முன்னேற்றத்தை கீழே சரிபார்க்கவும்",
    deliveryPartner: "டெலிவரி நபர்",
    callPartner: "அழைக்க",

    // Profile
    myProfile: "எனது சுயவிவரம்",
    savedAddresses: "சேமிக்கப்பட்ட முகவரிகள்",
    myOrders: "எனது ஆர்டர்கள்",
    settings: "அமைப்புகள்",
    helpSupport: "உதவி & ஆதரவு",
    addNewAddress: "புதிய முகவரியைச் சேர்",

    // Admin Dashboard
    adminTitle: "நிர்வாகி டாஷ்போர்டு",
    dashboard: "டாஷ்போர்டு",
    revenue: "வருவாய்",
    totalOrders: "மொத்த ஆர்டர்கள்",
    customers: "வாடிக்கையாளர்கள்",
    products: "தயாரிப்புகள்",
    analytics: "பகுப்பாய்வு மற்றும் அறிக்கைகள்",
    salesOverview: "விற்பனை கண்ணோட்டம்",
    orderStatus: "ஆர்டர் நிலை பகுப்பாய்வு",
    recentOrders: "சமீபத்திய ஆர்டர்கள்",
    addProdBtn: "புதிய தயாரிப்பு சேர்",
    editProdBtn: "தயாரிப்பை திருத்து",
    deleteProdBtn: "தயாரிப்பை நீக்கு",
    manageInventory: "சரக்கு மற்றும் இருப்பு மேலாண்மை",
    stockStatus: "இருப்பு நிலை",
    inStock: "இருப்பில் உள்ளது",
    adminStockQty: "இருப்பு அளவு (நிர்வாகி மட்டும் பார்க்க முடியும்):",
    saveChanges: "மாற்றங்களைச் சேமி",
    uploadImages: "பல படங்களை பதிவேற்றவும்",
    prodNameInput: "தயாரிப்பு பெயர்",
    priceInput: "விலை (₹)",
    categoryInput: "வகை",
    stockInput: "ஆரம்ப இருப்பு",
    descInput: "விளக்கம்",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('vstore_lang');
    return saved === 'ta' ? 'ta' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('vstore_lang', language);
  }, [language]);

  const t = (key) => {
    if (!translations[language]) return key;
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export { translations };
