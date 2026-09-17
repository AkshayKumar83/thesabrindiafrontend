import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ResponsiveCart from "../../components/cart/ResponsiveCart.jsx";
import Footer from '../components/footer/Footer.jsx'
import Header from '../components/header/Header.jsx'

import './Home.css'
import { useCart } from '../../context/CartContext.jsx';

function Home() {
  const [page, setPage] = useState('home')
  const handleNavigate = useNavigate();
  const [cartVisible, setCartVisible] = useState(false);
   const { items } = useCart();
  function navigate(nextPage) {
    // Account navigation
    if (
      nextPage === 'login' ||
      nextPage === 'register' ||
      nextPage === 'forgot'
    ) {
      setPage('account')
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }

    // Normal React Router navigation
    if (nextPage === 'home') {
      handleNavigate('/')
    } else {
      handleNavigate(`/${nextPage}`)
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // NORMAL PAGES
  return (
    <>
      <Header
        handleNavigate={handleNavigate}
        setCartVisible={setCartVisible}
        cartCount={items?.length || 0}
      />
      <Outlet />
      <Footer onNavigate={navigate} />
        <ResponsiveCart visible={cartVisible} onClose={() => setCartVisible(false)}/>  
    </>
  )
}

export default Home