import React from 'react'

import { CCol, CContainer, CFooter, CRow } from '@coreui/react'

import CIcon from '@coreui/icons-react'

import { cibInstagram, cibFacebook, cibYoutube } from '@coreui/icons'

import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'

import { Link } from 'react-router-dom'

// import logoSabr from '../../../assets/brand/logoSabr.jpeg'
import logoSabr from '../../../assets/brand/logoSabr.png'
import footerImage from '../../../assets/brand/footerImage.png'

import './Footer.css'

function Footer({ onNavigate }) {
  /* =====================================================
     SOCIAL LINKS
     ===================================================== */

  const instagramUrl = 'https://instagram.com/your_username'
  const facebookUrl = 'https://facebook.com/your_username'
  const youtubeUrl = 'https://youtube.com/'
  const twitterUrl = 'https://twitter.com/'

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path)
    }
  }

  return (
    <CFooter className="sabr-footer d-block p-0">
      {/* =====================================================
          FOOTER MAIN
          ===================================================== */}

      <div className="sabr-footer-main">
        <CContainer className="sabr-footer-container">
          <CRow className="sabr-footer-row">
            {/* =================================================
                BRAND
                ================================================= */}

            <CCol xs={12} sm={6} lg={4} className="sabr-footer-col">
              <div className="sabr-footer-brand">
                {/* LOGO */}

                <button
                  type="button"
                  className="sabr-footer-logo-link"
                  onClick={() => handleNavigate('/')}
                  aria-label="Go to home"
                >
                  <img src={logoSabr} alt="The Sabr India" className="sabr-footer-logo" />
                </button>

                {/* BRAND NAME */}

                <h5 className="sabr-footer-title">THE SABR INDIA</h5>

                {/* <p className="sabr-footer-tagline">
                  HERITAGE SAREES · ESTD 1984
                </p> */}

                {/* DESCRIPTION */}

                <p className="sabr-footer-description">
                  Handpicked sarees for rituals, celebrations, and quiet moments of life. Crafted
                  with care, worn with grace.
                </p>

                {/* SOCIAL */}

                <div className="sabr-footer-social">
                  {/* INSTAGRAM */}

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sabr-social-btn"
                    aria-label="Instagram"
                  >
                    <CIcon icon={cibInstagram} size="lg" />
                  </a>

                  {/* FACEBOOK */}

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sabr-social-btn"
                    aria-label="Facebook"
                  >
                    <CIcon icon={cibFacebook} size="lg" />
                  </a>

                  {/* YOUTUBE */}

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sabr-social-btn"
                    aria-label="YouTube"
                  >
                    <CIcon icon={cibYoutube} size="lg" />
                  </a>
                </div>

                <p className="sabr-social-text">Follow our drape diary</p>
              </div>
            </CCol>

            {/* =================================================
                EXPLORE
                ================================================= */}

            <CCol xs={6} sm={3} lg={2} className="sabr-footer-col">
              <div className="sabr-footer-section">
                <h6 className="sabr-footer-heading">EXPLORE</h6>

                <button className="sabr-footer-link" onClick={() => handleNavigate('/')}>
                  Home
                </button>

                <button className="sabr-footer-link" onClick={() => handleNavigate('/shop')}>
                  Shop Sarees
                </button>

                <button
                  className="sabr-footer-link"
                  onClick={() => handleNavigate('/shop/chiffon')}
                >
                  Chiffon Sarees
                </button>

                <button
                  className="sabr-footer-link"
                  onClick={() => handleNavigate('/shop/georgette')}
                >
                  Georgette Sarees
                </button>

              </div>
            </CCol>

            {/* =================================================
                HELP
                ================================================= */}

            <CCol xs={6} sm={3} lg={2} className="sabr-footer-col">
              <div className="sabr-footer-section">
                <h6 className="sabr-footer-heading">HELP</h6>

                {/* <Link to="/policies/shipping" className="sabr-footer-link">
                  Shipping & Returns
                </Link> */}

                <Link to="/policies/care" className="sabr-footer-link">
                  Care Guide
                </Link>

                <button className="sabr-footer-link" onClick={() => handleNavigate('/login')}>
                  My Account
                </button>

                <button className="sabr-footer-link" onClick={() => handleNavigate('/contact')}>
                  Contact Us
                </button>

                {/* <Link to="/policies/return" className="sabr-footer-link">
                  Return Policy
                </Link> */}
              </div>
            </CCol>

            {/* =================================================
                POLICIES
                ================================================= */}

            <CCol xs={6} sm={3} lg={2} className="sabr-footer-col">
              <div className="sabr-footer-section">
                <h6 className="sabr-footer-heading">POLICIES</h6>

                <Link to="/policies/return" className="sabr-footer-link">
                  Return Policy
                </Link>

                <Link to="/policies/refund" className="sabr-footer-link">
                  Refund Policy
                </Link>

                <Link to="/policies/shipping" className="sabr-footer-link">
                  Shipping Policy
                </Link>

                <Link to="/policies/cancellation" className="sabr-footer-link">
                  Cancellation Policy
                </Link>

                <Link to="/policies/terms" className="sabr-footer-link">
                  Terms & Services
                </Link>

                <Link to="/policies/privacy" className="sabr-footer-link">
                  Privacy Policy
                </Link>
              </div>
            </CCol>

            {/* =================================================
                CONTACT
                ================================================= */}

            <CCol xs={12} sm={6} lg={2} className="sabr-footer-col">
              <div className="sabr-footer-section">
                <h6 className="sabr-footer-heading">COME SAY HELLO</h6>

                <div className="sabr-contact-item">
                  <MapPin size={16} />

                  <span>Jaipur, Rajasthan</span>
                </div>

                <div className="sabr-contact-item">
                  <Phone size={16} />

                  <span>+91 98765 43210</span>
                </div>

                <div className="sabr-contact-item">
                  <Mail size={16} />

                  <span>hello@thesabrindia.com</span>
                </div>
              </div>
            </CCol>
          </CRow>

          {/* =====================================================
              NEWSLETTER
              ===================================================== */}

          {/* <div className="sabr-newsletter">

            <div className="sabr-newsletter-content">

              <div className="sabr-newsletter-copy">

                <div className="sabr-newsletter-title">

                  <Sparkles size={19} />

                  <span>
                    The Inner Circle
                  </span>

                </div>


                <p>
                  10% off your first order, private previews,
                  and weaving stories — twice a month, never more.
                </p>

              </div>


              <form
                className="sabr-newsletter-form"
                onSubmit={(e) => e.preventDefault()}
              >

                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                />

                <button type="submit">
                  JOIN
                </button>

              </form>

            </div>

          </div> */}
        </CContainer>

        {/* =====================================================
            DECORATIVE FOOTER IMAGE
            ===================================================== */}

        {/* <div className="sabr-footer-illustration">

          <img
            src={footerImage}
            alt=""
            aria-hidden="true"
          />

        </div> */}
      </div>

      {/* =====================================================
          BOTTOM
          ===================================================== */}

      <div className="sabr-footer-bottom">
        <CContainer className="sabr-footer-container">
          <div className="sabr-footer-bottom-content">
            <span>© 2026 The Sabr India. All rights reserved.</span>

            <span className="sabr-footer-certified">
              ✦ Handloom Inspired · Secure Payments · UPI · Cards
            </span>
          </div>
        </CContainer>
      </div>
    </CFooter>
  )
}

export default Footer
