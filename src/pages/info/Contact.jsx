import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CONTACT_INFO } from '@/constants/infoPages';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import logoImage from '@/assets/images/velmurugan_logo.jpg';

export default function Contact() {
  const { language } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
      <div className="text-center space-y-4 mb-12 flex flex-col items-center">
        <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-100 p-1 mb-2">
          <img src={logoImage} alt="Velmurugan Store Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-primary font-sans">
          {language === 'en' ? 'Contact Us' : 'தொடர்பு கொள்ள'}
        </h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        <p className="text-muted font-semibold max-w-xl mx-auto">
          {language === 'en' 
            ? 'We would love to hear from you. Reach out to us for any queries, support, or feedback.' 
            : 'உங்களிடமிருந்து கேட்க நாங்கள் விரும்புகிறோம். ஏதேனும் கேள்விகள், ஆதரவு அல்லது கருத்துகளுக்கு எங்களை தொடர்பு கொள்ளவும்.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Details */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-primary mb-1">
                {language === 'en' ? 'Store Address' : 'கடை முகவரி'}
              </h3>
              <p className="text-text font-medium leading-relaxed">{CONTACT_INFO.address[language]}</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-primary mb-1">
                {language === 'en' ? 'Working Hours' : 'வேலை நேரங்கள்'}
              </h3>
              <p className="text-text font-medium leading-relaxed">{CONTACT_INFO.workingHours[language]}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href={`tel:${CONTACT_INFO.phone}`} className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group">
              <Phone className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-extrabold text-primary">Call Us</h3>
              <p className="text-muted font-bold text-xs mt-1">{CONTACT_INFO.phone}</p>
            </a>

            <a href={`mailto:${CONTACT_INFO.email}`} className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:border-primary transition-colors cursor-pointer group">
              <Mail className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-extrabold text-primary">Email Us</h3>
              <p className="text-muted font-bold text-xs mt-1 break-all">{CONTACT_INFO.email}</p>
            </a>
          </div>
        </div>

        {/* Map Integration */}
        <div className="glass-card p-2 rounded-3xl h-[400px] md:h-full min-h-[400px] relative overflow-hidden border border-border">
          <iframe 
            src={CONTACT_INFO.mapUrl} 
            className="w-full h-full rounded-2xl border-0 filter contrast-125 saturate-150"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Velmurugan Store Location"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
