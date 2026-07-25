import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ_CONTENT } from '@/constants/infoPages';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

export default function FAQ() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
      
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircleQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-primary font-sans">
          {FAQ_CONTENT.title[language]}
        </h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      <div className="space-y-4">
        {FAQ_CONTENT.faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer
                ${isOpen ? 'border-primary shadow-premium' : 'border-border hover:border-primary/50'}`}
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <div className="p-5 md:p-6 flex justify-between items-center bg-surface">
                <h3 className="font-extrabold text-primary text-sm md:text-base pr-4">
                  {faq.q[language]}
                </h3>
                <ChevronDown className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              
              <div 
                className={`transition-all duration-300 ease-in-out px-5 md:px-6
                  ${isOpen ? 'max-h-40 pb-5 md:pb-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
              >
                <div className="w-full h-px bg-border mb-4"></div>
                <p className="text-text font-medium text-sm md:text-base leading-relaxed">
                  {faq.a[language]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
