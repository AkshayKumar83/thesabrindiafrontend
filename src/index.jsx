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

createRoot(document.getElementById('root')).render(
  <ToastProvider position="center">
     <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </Provider>
    </ToastProvider>

)
