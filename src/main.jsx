import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from '@/context/AppContext.jsx'
import { LanguageProvider } from '@/context/LanguageContext.jsx'
import { CartProvider } from '@/context/CartContext.jsx'
import ErrorBoundary from '@/components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <LanguageProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LanguageProvider>
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
)
