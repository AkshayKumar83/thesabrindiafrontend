import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import './fontAwesome'
import App from './App'
import store from './store'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from "./context/AuthContext";
import ToastProvider from "../src/layout/components/toast/Toast"
import { LocationProvider } from './context/LocationContext'

createRoot(document.getElementById('root')).render(
  <ToastProvider position="top-center">
     <Provider store={store}>
      <LocationProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </LocationProvider>
    </Provider>
    </ToastProvider>

)
