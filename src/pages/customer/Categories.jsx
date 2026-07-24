import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function CategoriesPage({ onNavigate, setActiveCategory }) {
  const { language, t } = useLanguage();

  const categories = [
    { 
      id: 'Fruits & Veg', 
      label: 'Fruits & Veg', 
      labelTa: 'பழங்கள் & காய்கறிகள்', 
      icon: '🍎', 
      desc: 'Fresh farm items, organic greens and juicy imported fruits.',
      descTa: 'பண்ணை காய்கறிகள், கீரைகள் மற்றும் இறக்குமதி பழங்கள்.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      imageUrl: 'https://images.unsplash.com/photo-1610832958506-ee56336191d1?auto=format&fit=crop&q=80&w=300'
    },
    { 
      id: 'Dairy & Eggs', 
      label: 'Dairy & Eggs', 
      labelTa: 'பால் & முட்டை', 
      icon: '🥛', 
      desc: 'Fresh organic cow milk, salted butter, local cheese and eggs.',
      descTa: 'ஆர்கானிக் பசுவின் பால், வெண்ணெய், சீஸ் மற்றும் முட்டைகள்.',
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      imageUrl: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&q=80&w=300'
    },
    { 
      id: 'Staples', 
      label: 'Staples', 
      labelTa: 'மளிகை பொருட்கள்', 
      icon: '🌾', 
      desc: 'Chakki Atta, Basmati rice, cold pressed cooking oils and pulses.',
      descTa: 'கோதுமை மாவு, பாஸ்மதி அரிசி, சமையல் எண்ணெய் மற்றும் பருப்புகள்.',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
    },
    { 
      id: 'Personal Care', 
      label: 'Personal Care', 
      labelTa: 'தனிநபர் பராமரிப்பு', 
      icon: '🧼', 
      desc: 'Sandalwood soaps, natural shampoos, toothpaste and body washes.',
      descTa: 'சந்தன சோப்பு, ஷாம்பு, டூத்பேஸ்ட் மற்றும் உடல் திரவங்கள்.',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=300'
    }
  ];

  const handleCategoryClick = (catId) => {
    if (setActiveCategory) {
      setActiveCategory(catId);
    }
    onNavigate('home');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left space-y-6">
      
      {/* Back button */}
      <button 
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors duration-150 py-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">{t('navHome')}</span>
      </button>

      <h1 className="text-2xl font-extrabold text-primary font-sans">{t('categoriesTitle')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="bg-white/60 backdrop-blur-md rounded-3xl border border-gray-150 overflow-hidden shadow-sm flex items-center cursor-pointer hover:shadow-premium group transition-all duration-200"
          >
            {/* Category Image */}
            <div className="w-1/3 h-32 relative overflow-hidden bg-gray-100 shrink-0">
              <img 
                src={cat.imageUrl} 
                alt={cat.label} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Category Details */}
            <div className="flex-1 p-5 flex items-center justify-between gap-4">
              <div className="space-y-1 text-left min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-extrabold text-sm text-primary leading-tight block truncate">
                    {language === 'ta' ? cat.labelTa : cat.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed line-clamp-2 mt-1">
                  {language === 'ta' ? cat.descTa : cat.desc}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
