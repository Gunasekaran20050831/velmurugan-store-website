import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import logoImage from '@/assets/images/velmurugan_logo.jpg';

export default function Auth({ onNavigate }) {
  const { t } = useLanguage();
  const { login, signup, loginWithOtp } = useApp();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // OTP Fields
  const [otpCodes, setOtpCodes] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    const res = await login(emailOrPhone, password);
    setIsLoading(false);
    
    if (res.success) {
      if (res.user.isAdmin) {
        onNavigate('admin');
      } else {
        onNavigate('home');
      }
    } else {
      setErrorMsg(res.message || "Invalid credentials.");
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setErrorMsg('');
    setIsOtpLogin(false);
    setShowOtpModal(true); // Open OTP flow
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtpCodes([...otpCodes.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otpCodes.join('');
    if (code.length < 4) {
      setErrorMsg("Please enter 4 digits.");
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    let res;
    if (isOtpLogin) {
      res = await loginWithOtp(emailOrPhone, code);
    } else {
      res = await signup(fullName, phone, email, password);
    }
    
    setIsLoading(false);
    
    if (res.success) {
      setShowOtpModal(false);
      if (res.user?.isAdmin) {
        onNavigate('admin');
      } else {
        onNavigate('home');
      }
    } else {
      setErrorMsg(res.message || (isOtpLogin ? "OTP Login failed." : "Signup failed."));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-premium border border-white/60">
        
        {/* Toggle Switcher */}
        <div className="flex bg-primary/5 p-1.5 rounded-full mb-8">
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${isLogin ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'}`}
          >
            {t('loginBtn')}
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${!isLogin ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'}`}
          >
            {t('signupBtn')}
          </button>
        </div>

        {/* Title & Logo */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 p-1">
            <img src={logoImage} alt="Velmurugan Store Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-xl font-extrabold text-primary font-sans">
            {isLogin ? t('welcomeBack') : t('createAccount')}
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-semibold">
            {isLogin ? t('loginSubtitle') : t('signupSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {isLogin ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('emailOrPhone')}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="admin or customer@example.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs glass-input text-gray-900 placeholder-gray-400"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-xs glass-input text-gray-900 placeholder-gray-400"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5" />
                <span className="text-[10px] text-gray-400 font-bold">{t('rememberMe')}</span>
              </label>
              <button 
                type="button" 
                onClick={() => {
                  if (!emailOrPhone) {
                    setErrorMsg("Please enter your Mobile number first to login with OTP.");
                    return;
                  }
                  setErrorMsg('');
                  setIsOtpLogin(true);
                  setShowOtpModal(true);
                }}
                className="text-[10px] text-accent font-bold hover:underline"
              >
                Login with OTP
              </button>
            </div>

            <button type="submit" className="w-full luxury-btn-primary py-3.5 rounded-xl text-xs font-bold mt-6">
              {t('loginBtn')}
            </button>
            
            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 mt-4">
              <span className="text-[9px] text-primary/70 font-semibold block text-center">
                💡 Admin Bypass: Type <strong className="text-accent-dark">admin</strong> as Username/Email to access Admin Panel.
              </span>
            </div>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('fullName')}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Velmurugan Store User"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs glass-input text-gray-900 placeholder-gray-400"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('phoneNumber')}</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs glass-input text-gray-900 placeholder-gray-400"
                />
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="user@vstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs glass-input text-gray-900 placeholder-gray-400"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('password')}</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs glass-input text-gray-900"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('confirmPassword')}</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs glass-input text-gray-900"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <label className="flex items-center space-x-2 pt-2 cursor-pointer">
              <input type="checkbox" required className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5" />
              <span className="text-[9px] text-gray-400 font-bold">{t('agreeTerms')}</span>
            </label>

            <button type="submit" className="w-full luxury-btn-primary py-3.5 rounded-xl text-xs font-bold mt-6">
              {t('signupBtn')}
            </button>
          </form>
        )}

      </div>

      {/* OTP Verification ready modal overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-full mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h4 className="text-xl font-extrabold text-primary mb-1">Verify Mobile</h4>
            <p className="text-xs text-gray-500 font-semibold mb-6">
              {isOtpLogin ? 'Enter demo OTP 1234 to login.' : 'Enter demo OTP 1234 to verify your number.'}
            </p>

            <div className="flex justify-center gap-3 my-6">
              {otpCodes.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-gray-50"
                />
              ))}
            </div>

            <button 
              onClick={handleOtpSubmit}
              className="w-full luxury-btn-primary py-3 rounded-xl text-xs font-bold"
            >
              {t('otpVerify')}
            </button>

            <button 
              type="button" 
              onClick={() => setOtpCodes(['', '', '', ''])}
              className="text-xs font-bold text-accent hover:underline mt-4 block mx-auto"
            >
              {t('otpResend')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
