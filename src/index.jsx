import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import './fontAwesome'
import App from './App'
import store from './store'
import { CartProvider } from './context/CartContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <CartProvider>
      <App />
     </CartProvider>
  </Provider>,
)
