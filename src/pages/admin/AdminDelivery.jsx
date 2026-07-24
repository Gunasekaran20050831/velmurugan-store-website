import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';

export default function AdminDelivery() {
  const { t } = useLanguage();
  const { deliveryRates, setDeliveryRates } = useApp();
  const [ratesForm, setRatesForm] = useState([...deliveryRates]);

  const handleRateFieldChange = (index, value) => {
    const updated = [...ratesForm];
    updated[index].charge = parseInt(value) || 0;
    setRatesForm(updated);
  };

  const handleSaveRates = (e) => {
    e.preventDefault();
    setDeliveryRates(ratesForm);
    // Note: Can add a toast notification here in the future
  };

  return (
    <form onSubmit={handleSaveRates} className="max-w-md bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm text-left space-y-5 animate-in fade-in duration-200">
      <h3 className="text-sm font-extrabold text-primary font-sans">Edit Distance Charges</h3>
      <p className="text-xs text-gray-400 font-semibold leading-relaxed">
        Configure delivery fees applied to customer checkout orders based on geographic distance tiers.
      </p>

      <div className="space-y-4">
        {ratesForm.map((rate, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <label className="text-xs font-bold text-primary block w-32 shrink-0">
              {rate.min} – {rate.max} km:
            </label>
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-xs text-gray-400 font-bold">₹</span>
              <input
                type="number"
                value={rate.charge}
                onChange={(e) => handleRateFieldChange(idx, e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl text-xs glass-input text-gray-900"
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        type="submit"
        className="w-full luxury-btn-gold py-3.5 rounded-xl text-xs font-bold"
      >
        {t('saveChanges')}
      </button>
    </form>
  );
}
