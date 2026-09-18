import React, { useState } from 'react'
import "./Header.css"
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
  ShoppingBag,
  User,
  Menu,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
} from 'lucide-react'

const Header = ({ onNavigate, setCartVisible, cartCount = 0, activePage = 'home', handleNavigate }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
 
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'shop', label: 'Shop' },
    { key: 'contact', label: 'Contact' },
    { key: 'collections', label: 'Colections' },
    { key: 'product-details/123', label: 'PD' },
  ]

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

          {/* Mobile menu toggle */}
          <CCol xs="auto" className="d-md-none">
            <CHeaderToggler
              className="header-icon-button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </CHeaderToggler>
          </CCol>

          {/* Logo */}
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

          {/* Navigation */}
          <CCol
            md={6}
            className="d-none d-md-flex justify-content-center"
          >
            <CHeaderNav className="store-nav">
              {navItems.map((item) => (
                <CNavItem key={item.key}>
                  <CNavLink
                    active={activePage === item.key}
                    onClick={()=>handleNavigate(`/${item.key==='home' ? '' : item.key}`)}
                  >
                    {item.label}
                  </CNavLink>
                </CNavItem>
              ))}
            </CHeaderNav>
          </CCol>

          {/* Header actions */}
          <CCol
            xs={6}
            md={3}
            className="d-flex justify-content-end align-items-center gap-1"
          >
            <CButton
              color="light"
              variant="ghost"
              className="header-icon-button d-none d-sm-inline-flex"
              aria-label="Search"
            >
              <Search size={29} />
            </CButton>

            <CButton
              color="light"
              variant="ghost"
              className="header-icon-button position-relative"
              aria-label="Shopping cart"
              onClick={() => setCartVisible(true)}
            >
              <ShoppingCart  size={29} />

              {cartCount > 0 && (
                <CBadge
                  shape="rounded-pill"
                  className="cart-badge position-absolute"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </CBadge>
              )}
            </CButton>

            <CButton
              color="light"
              variant="ghost"
              className="header-icon-button d-none d-sm-inline-flex"
              aria-label="Account"
              onClick={() => handleNavigate('/auth')}
            >
              <User size={29} />
            </CButton>
          </CCol>
        </CRow>

        {/* Mobile nav collapse */}
        <CCollapse visible={mobileNavOpen} className="d-md-none w-100">
          <CHeaderNav className="store-nav-mobile flex-column pt-3 pb-2">
            {navItems.map((item) => (
              <CNavItem key={item.key} className="w-100">
                <CNavLink
                  active={activePage === item.key}
                  onClick={()=>handleNavigate(`/${item.key}`)}
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