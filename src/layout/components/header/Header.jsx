// import React, { useState } from 'react'
// import "./Header.css"
// import logoSabr from '../../../assets/brand/logoSabr.png'

// import {
//   CButton,
//   CContainer,
//   CHeader,
//   CHeaderBrand,
//   CHeaderNav,
//   CHeaderToggler,
//   CNavItem,
//   CNavLink,
//   CRow,
//   CCol,
//   CCollapse,
//   CBadge,
// } from '@coreui/react'

// import {
//   Search,
//   ShoppingBag,
//   User,
//   Menu,
//   MapPin,
//   Phone,
//   Mail,
//   ShoppingCart,
// } from 'lucide-react'

// const Header = ({ onNavigate, setCartVisible, cartCount = 0, activePage = 'home', handleNavigate }) => {
//   const [mobileNavOpen, setMobileNavOpen] = useState(false)
 
//   const navItems = [
//     { key: 'home', label: 'Home' },
//     { key: 'shop', label: 'Shop' },
//     { key: 'contact', label: 'Contact' },
//     { key: 'collections', label: 'Colections' },
//     { key: 'product-details/123', label: 'PD' },
//   ]

//  return (
//   <>
//     {/* ================= PRE HEADER ================= */}
//     <div className="store-preheader">
//       <CContainer fluid="xxl">
//         <CRow className="align-items-center">
//           {/* Location + Mobile */}
//           <CCol
//             xs={12}
//             md={6}
//             className="d-flex align-items-center gap-4"
//           >
//             <span className="preheader-item">
//               <MapPin size={16} />
//               Jaipur, Rajasthan (302001)
//             </span>

//             <span className="preheader-item">
//               <Phone size={16} />
//               +91 987654210
//             </span>
//           </CCol>

//           {/* Email */}
//           <CCol
//             xs={12}
//             md={6}
//             className="d-flex justify-content-md-end"
//           >
//             <span className="preheader-item">
//               <Mail size={16} />
//               contact@thesabrindia.com
//             </span>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>

//     {/* ================= MAIN HEADER ================= */}
//     <CHeader
//       className="store-header border-bottom sticky-top"
//       position="sticky"
//     >
//       <CContainer fluid="xxl">
//         <CRow className="w-100 align-items-center flex-nowrap">

//           {/* Mobile menu toggle */}
//           <CCol xs="auto" className="d-md-none">
//             <CHeaderToggler
//               className="header-icon-button"
//               onClick={() => setMobileNavOpen(!mobileNavOpen)}
//               aria-label="Toggle navigation"
//             >
//               <Menu size={20} />
//             </CHeaderToggler>
//           </CCol>

//           {/* Logo */}
//           <CCol xs={6} md={3}>
//           <CHeaderBrand
//             as="button"
//             className="store-logo border-0 bg-transparent p-0"
//             onClick={() => handleNavigate('/')}
//           >
//   <img
//     src={logoSabr}
//     alt="The Sabr India"
//     className="store-logo-image"
//   /> 
// </CHeaderBrand>
//           </CCol>

//           {/* Navigation */}
//           <CCol
//             md={6}
//             className="d-none d-md-flex justify-content-center"
//           >
//             <CHeaderNav className="store-nav">
//               {navItems.map((item) => (
//                 <CNavItem key={item.key}>
//                   <CNavLink
//                     active={activePage === item.key}
//                     onClick={()=>handleNavigate(`/${item.key==='home' ? '' : item.key}`)}
//                   >
//                     {item.label}
//                   </CNavLink>
//                 </CNavItem>
//               ))}
//             </CHeaderNav>
//           </CCol>

//           {/* Header actions */}
//           <CCol
//             xs={6}
//             md={3}
//             className="d-flex justify-content-end align-items-center gap-1"
//           >
//             <CButton
//               color="light"
//               variant="ghost"
//               className="header-icon-button d-none d-sm-inline-flex"
//               aria-label="Search"
//             >
//               <Search size={29} />
//             </CButton>

//             <CButton
//               color="light"
//               variant="ghost"
//               className="header-icon-button position-relative"
//               aria-label="Shopping cart"
//               onClick={() => setCartVisible(true)}
//             >
//               <ShoppingCart  size={29} />

//               {cartCount > 0 && (
//                 <CBadge
//                   shape="rounded-pill"
//                   className="cart-badge position-absolute"
//                 >
//                   {cartCount > 99 ? '99+' : cartCount}
//                 </CBadge>
//               )}
//             </CButton>

//             <CButton
//               color="light"
//               variant="ghost"
//               className="header-icon-button d-none d-sm-inline-flex"
//               aria-label="Account"
//               onClick={() => handleNavigate('/auth')}
//             >
//               <User size={29} />
//             </CButton>
//           </CCol>
//         </CRow>

//         {/* Mobile nav collapse */}
//         <CCollapse visible={mobileNavOpen} className="d-md-none w-100">
//           <CHeaderNav className="store-nav-mobile flex-column pt-3 pb-2">
//             {navItems.map((item) => (
//               <CNavItem key={item.key} className="w-100">
//                 <CNavLink
//                   active={activePage === item.key}
//                   onClick={()=>handleNavigate(`/${item.key}`)}
//                 >
//                   {item.label}
//                 </CNavLink>
//               </CNavItem>
//             ))}
//           </CHeaderNav>
//         </CCollapse>
//       </CContainer>
//     </CHeader>
//   </>
// )
// }

// export default Header




import React, { useEffect, useRef, useState } from 'react'
import './Header.css'
import logoSabr from '../../../assets/brand/logoSabr.png'

import {
  CButton,
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  CRow,
  CCol,
  CCollapse,
  CBadge,
} from '@coreui/react'

import {
  Search,
  ShoppingCart,
  User,
  Menu,
  MapPin,
  Phone,
  Mail,
  UserRound,
  Package,
  LogOut,
  LogIn,
} from 'lucide-react'

import { useAuth } from '../../../context/AuthContext.jsx'

const Header = ({
  onNavigate,
  setCartVisible,
  cartCount = 0,
  activePage = 'home',
  handleNavigate,
}) => {
  const { user, isLoggedIn, logout } = useAuth()

  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  const accountMenuRef = useRef(null)

  /*
   * Close account dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /*
   * Navigation items
   */
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'shop', label: 'Shop' },
    { key: 'contact', label: 'Contact' },
    { key: 'collections', label: 'Collections' },
    { key: 'product-details/123', label: 'PD' },
  ]

  /*
   * Handle normal navigation
   */
  const handleNavClick = (item) => {
    setMobileNavOpen(false)

    handleNavigate(
      `/${item.key === 'home' ? '' : item.key}`
    )
  }

  /*
   * Handle account menu navigation
   */
  const handleAccountNavigation = (path) => {
    setAccountMenuOpen(false)
    handleNavigate(path)
  }

  /*
   * Handle logout
   */
  const handleLogout = () => {
    logout()
    setAccountMenuOpen(false)
    setMobileNavOpen(false)

    handleNavigate('/')
  }

  return (
    <>
      {/* ================= PRE HEADER ================= */}

      <div className="store-preheader">
        <CContainer fluid="xxl">
          <CRow className="align-items-center">

            {/* Location + Mobile */}

            <CCol
              xs={12}
              md={6}
              className="d-flex align-items-center gap-4"
            >
              <span className="preheader-item">
                <MapPin size={16} />
                Jaipur, Rajasthan (302001)
              </span>

              <span className="preheader-item">
                <Phone size={16} />
                +91 987654210
              </span>
            </CCol>

            {/* Email */}

            <CCol
              xs={12}
              md={6}
              className="d-flex justify-content-md-end"
            >
              <span className="preheader-item">
                <Mail size={16} />
                contact@thesabrindia.com
              </span>
            </CCol>

          </CRow>
        </CContainer>
      </div>

      {/* ================= MAIN HEADER ================= */}

      <CHeader
        className="store-header border-bottom sticky-top"
        position="sticky"
      >
        <CContainer fluid="xxl">

          <CRow className="w-100 align-items-center flex-nowrap">

            {/* ================= MOBILE MENU ================= */}

            <CCol xs="auto" className="d-md-none">
              <CHeaderToggler
                className="header-icon-button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                aria-label="Toggle navigation"
              >
                <Menu size={20} />
              </CHeaderToggler>
            </CCol>

            {/* ================= LOGO ================= */}

            <CCol xs={6} md={3}>
              <CHeaderBrand
                as="button"
                className="store-logo border-0 bg-transparent p-0"
                onClick={() => handleNavigate('/')}
              >
                <img
                  src={logoSabr}
                  alt="The Sabr India"
                  className="store-logo-image"
                />
              </CHeaderBrand>
            </CCol>

            {/* ================= DESKTOP NAVIGATION ================= */}

            <CCol
              md={6}
              className="d-none d-md-flex justify-content-center"
            >
              <CHeaderNav className="store-nav">

                {navItems.map((item) => (
                  <CNavItem key={item.key}>

                    <CNavLink
                      active={activePage === item.key}
                      onClick={() => handleNavClick(item)}
                    >
                      {item.label}
                    </CNavLink>

                  </CNavItem>
                ))}

              </CHeaderNav>
            </CCol>

            {/* ================= HEADER ACTIONS ================= */}

            <CCol
              xs={6}
              md={3}
              className="d-flex justify-content-end align-items-center gap-1"
            >

              {/* Search */}

              <CButton
                color="light"
                variant="ghost"
                className="header-icon-button d-none d-sm-inline-flex"
                aria-label="Search"
              >
                <Search size={29} />
              </CButton>

              {/* ================= CART ================= */}

              <CButton
                color="light"
                variant="ghost"
                className="header-icon-button position-relative"
                aria-label="Shopping cart"
                onClick={() => setCartVisible(true)}
              >
                <ShoppingCart size={29} />

                {cartCount > 0 && (
                  <CBadge
                    shape="rounded-pill"
                    className="cart-badge position-absolute"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </CBadge>
                )}
              </CButton>

              {/* ================= ACCOUNT ================= */}

            {/* ================= ACCOUNT ================= */}

<div className="account-menu-wrapper d-none d-sm-block">
  <CButton
    color="light"
    variant="ghost"
    className="header-icon-button"
    aria-label="Account"
  >
    <User size={29} />
  </CButton>

  <div className="account-dropdown">

    {isLoggedIn ? (
      <>
        {/* User information */}
        <div className="account-user-info">
          <div className="account-user-icon">
            <UserRound size={18} />
          </div>

          <div className="account-user-details">
            <span className="account-user-label">
              Account
            </span>

            <span className="account-user-name">
              {user?.name || user?.email || 'User'}
            </span>
          </div>
        </div>

        <div className="account-dropdown-divider" />

        {/* Profile */}
        <button
          type="button"
          className="account-dropdown-item"
          onClick={() => handleNavigate('/profile')}
        >
          <UserRound size={17} />
          <span>Profile</span>
        </button>

        {/* Orders */}
        <button
          type="button"
          className="account-dropdown-item"
          onClick={() => handleNavigate('/orders')}
        >
          <Package size={17} />
          <span>Orders</span>
        </button>

        <div className="account-dropdown-divider" />

        {/* Logout */}
        <button
          type="button"
          className="account-dropdown-item logout-item"
          onClick={() => {
            logout()
            handleNavigate('/')
          }}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </>
    ) : (
      <button
        type="button"
        className="account-dropdown-item"
        onClick={() => handleNavigate('/auth')}
      >
        <LogIn size={17} />
        <span>Login</span>
      </button>
    )}

  </div>
</div>

            </CCol>

          </CRow>

          {/* ================= MOBILE NAV ================= */}

          <CCollapse
            visible={mobileNavOpen}
            className="d-md-none w-100"
          >
            <CHeaderNav className="store-nav-mobile flex-column pt-3 pb-2">

              {navItems.map((item) => (
                <CNavItem
                  key={item.key}
                  className="w-100"
                >
                  <CNavLink
                    active={activePage === item.key}
                    onClick={() => handleNavClick(item)}
                  >
                    {item.label}
                  </CNavLink>
                </CNavItem>
              ))}

            </CHeaderNav>
          </CCollapse>

        </CContainer>
      </CHeader>
    </>
  )
}

export default Header

