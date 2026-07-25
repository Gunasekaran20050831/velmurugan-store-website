import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_CONTENT } from '@/constants/infoPages';
import { Store, ShieldCheck } from 'lucide-react';
import logoImage from '@/assets/images/velmurugan_logo.jpg';

export default function About() {
  const { language } = useLanguage();
  const content = ABOUT_CONTENT;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-primary font-sans">
          {content.title[language]}
        </h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      <div className="space-y-12">
        {content.sections.map((section, idx) => (
          <section key={idx} className="glass-card p-6 md:p-8 rounded-3xl space-y-4 border border-border hover:shadow-premium transition-shadow duration-300">
            <h2 className="text-xl md:text-2xl font-extrabold text-primary flex items-center gap-3">
              {idx === 0 ? <Store className="w-6 h-6 text-accent" /> : <ShieldCheck className="w-6 h-6 text-accent" />}
              {section.heading[language]}
            </h2>
            <p className="text-text leading-relaxed font-medium md:text-lg">
              {section.content[language]}
            </p>
          </section>
        ))}
      </div>

      {/* Decorative Brand Element */}
      <div className="mt-16 text-center flex flex-col items-center justify-center space-y-3 opacity-80">
        <div className="w-16 h-16 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-100 p-1">
          <img src={logoImage} alt="Velmurugan Store Logo" className="w-full h-full object-contain" />
        </div>
        <p className="text-sm font-bold text-muted uppercase tracking-widest">
          {language === 'en' ? 'Serving Since 1995' : '1995 முதல் சேவையில்'}
        </p>
      </div>
    </div>
  );
}
