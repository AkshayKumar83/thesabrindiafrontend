import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'


import Footer from '../components/footer/Footer.jsx'
import Header from '../components/header/Header.jsx'

import './Home.css'

function Home() {
  const [page, setPage] = useState('home')
  const handleNavigate = useNavigate();

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
      />
      <Outlet />
      <Footer onNavigate={navigate} />
    </>
  )
}

export default Home