import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CONTACT_INFO } from '@/constants/infoPages';
import { MapPin, Phone, Mail } from 'lucide-react';
import logoImage from '@/assets/images/velmurugan_logo.jpg';

export default function Footer({ onNavigate }) {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-primary pt-16 pb-8 border-t border-primary/20 mt-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <img src={logoImage} alt="Velmurugan Store Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-wide text-white">
                  {t('brandName')}
                </h1>
                <p className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none">
                  {t('tagline')}
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-light font-medium leading-relaxed pr-4">
              {language === 'en' 
                ? 'Your trusted neighborhood store bringing premium groceries and daily essentials directly to your doorstep.' 
                : 'உங்கள் நம்பிக்கைக்குரிய அண்டை கடை, தரமான மளிகை மற்றும் அன்றாட தேவைகளை உங்கள் வீட்டு வாசலில் கொண்டு சேர்க்கிறது.'}
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-dark border border-primary-light flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-dark border border-primary-light flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-dark border border-primary-light flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.557z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Quick Links' : 'விரைவு இணைப்புகள்'}
            </h3>
            <ul className="space-y-4 text-sm font-medium text-primary-light">
              <li><button onClick={() => onNavigate('home')} className="hover:text-accent transition-colors">{t('home')}</button></li>
              <li><button onClick={() => onNavigate('categories')} className="hover:text-accent transition-colors">{t('categories')}</button></li>
              <li><button onClick={() => onNavigate('cart')} className="hover:text-accent transition-colors">{t('cart')}</button></li>
              <li><button onClick={() => onNavigate('profile')} className="hover:text-accent transition-colors">{t('profile')}</button></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Legal & Policies' : 'சட்டக் கொள்கைகள்'}
            </h3>
            <ul className="space-y-4 text-sm font-medium text-primary-light">
              <li><button onClick={() => onNavigate('about')} className="hover:text-accent transition-colors">{language === 'en' ? 'About Us' : 'எங்களை பற்றி'}</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-accent transition-colors">{language === 'en' ? 'FAQ' : 'அடிக்கடி கேட்கப்படும் கேள்விகள்'}</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-accent transition-colors">{language === 'en' ? 'Privacy Policy' : 'தனியுரிமை கொள்கை'}</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-accent transition-colors">{language === 'en' ? 'Terms & Conditions' : 'விதிமுறைகள்'}</button></li>
              <li><button onClick={() => onNavigate('shipping')} className="hover:text-accent transition-colors">{language === 'en' ? 'Shipping Policy' : 'கப்பல் கொள்கை'}</button></li>
              <li><button onClick={() => onNavigate('refunds')} className="hover:text-accent transition-colors">{language === 'en' ? 'Refund Policy' : 'பணம் திரும்பப்பெறும் கொள்கை'}</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              {language === 'en' ? 'Contact Us' : 'தொடர்பு கொள்ள'}
            </h3>
            <ul className="space-y-4 text-sm font-medium text-primary-light">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.address[language]}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-accent transition-colors">{CONTACT_INFO.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-accent transition-colors break-all">{CONTACT_INFO.email}</a>
              </li>
            </ul>
            <button 
              onClick={() => onNavigate('contact')}
              className="mt-4 px-6 py-2.5 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              {language === 'en' ? 'Contact Support' : 'ஆதரவைத் தொடர்பு கொள்ள'}
            </button>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-primary-light/20 mb-8"></div>

        {/* Bottom / Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <p className="text-xs text-primary-light font-semibold">
            &copy; {new Date().getFullYear()} Velmurugan Store. {language === 'en' ? 'All Rights Reserved.' : 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'}
          </p>
          <div className="text-[10px] text-primary-light font-bold uppercase tracking-widest flex space-x-4">
            <span>Version 2.1.0</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Made with ❤️ in Chennai</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
