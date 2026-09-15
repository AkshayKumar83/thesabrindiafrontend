// import { Camera, Mail, MapPin, Phone } from 'lucide-react'

// function Footer({ onNavigate }) {
//   return (
//     <footer className="site-footer">
//       <div className="footer-main">
//         <div className="footer-brand">
//           <div className="footer-mark">S</div>
//           <p className="footer-title">The Sabr India</p>
//           <p>Handpicked sarees for the rituals, celebrations, and quiet moments of life.</p>
//           <a className="social-link" href="https://instagram.com" target="_blank" rel="noreferrer"><Camera size={16} /> Follow our drape diary</a>
//         </div>
//         <div className="footer-column"><p className="footer-heading">Explore</p><button onClick={() => onNavigate('home')}>Home</button><button onClick={() => onNavigate('shop')}>Shop sarees</button><button onClick={() => onNavigate('contact')}>Contact us</button></div>
//         <div className="footer-column"><p className="footer-heading">Help</p><button>Shipping & returns</button><button>Care guide</button><button onClick={() => onNavigate('login')}>My account</button></div>
//         <div className="footer-column contact-column"><p className="footer-heading">Come say hello</p><p><MapPin size={15} /> Jaipur, Rajasthan</p><p><Phone size={15} /> +91 98765 43210</p><p><Mail size={15} /> hello@thesabrindia.com</p></div>
//       </div>
//       <div className="footer-bottom"><span>© 2026 The Sabr India</span><span>Made slowly, worn often.</span></div>
//     </footer>
//   )
// }

// export default Footer




import React from 'react'

import {
  CButton,
  CCol,
  CContainer,
  CFooter,
  CLink,
  CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import {
  cibInstagram,
  cibFacebook,
} from '@coreui/icons'

import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import logoSabr from '../../../assets/brand/logoSabr.jpeg'
import footerImage from '../../../assets/brand/footerImage.png'

import './Footer.css'


function Footer({ onNavigate }) {

  /* =====================================================
     SOCIAL LINKS
     ===================================================== */

  const instagramUsername = 'your_username'
  const facebookUsername = 'your_username'

  const instagramUrl = `https://instagram.com/${instagramUsername}`
  const facebookUrl = `https://facebook.com/${facebookUsername}`


  return (
    <CFooter className="sabr-footer d-block p-0">


      {/* =====================================================
          MAIN FOOTER
          ===================================================== */}

      <CContainer fluid className="sabr-footer-main">

        <div className="sabr-footer-container">

          <CRow className="sabr-footer-row">


            {/* =================================================
                BRAND
                ================================================= */}

            <CCol
              xs={12}
              sm={6}
              lg={3}
              className="sabr-footer-col"
            >

              <div className="sabr-footer-brand">

                {/* LOGO */}

                <CLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate('home')
                  }}
                  className="sabr-footer-logo-link"
                >

                  <img
                    src={logoSabr}
                    alt="The Sabr India"
                    className="sabr-footer-logo"
                  />

                </CLink>


                {/* TITLE */}

                <h5 className="sabr-footer-title">
                  The Sabr India
                </h5>


                {/* DESCRIPTION */}

                <p className="sabr-footer-description">
                  Handpicked sarees for the rituals,
                  celebrations, and quiet moments of life.
                </p>


                {/* SOCIAL */}

                <div className="sabr-footer-social">

                  {/* INSTAGRAM */}

                  <CButton
                    component="a"
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sabr-social-btn"
                    aria-label="Instagram"
                    title="Instagram"
                  >

                    <CIcon
                      icon={cibInstagram}
                      size="lg"
                    />

                  </CButton>


                  {/* FACEBOOK */}

                  <CButton
                    component="a"
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sabr-social-btn"
                    aria-label="Facebook"
                    title="Facebook"
                  >

                    <CIcon
                      icon={cibFacebook}
                      size="lg"
                    />

                  </CButton>

                </div>


                <p className="sabr-social-text">
                  Follow our drape diary
                </p>

              </div>

            </CCol>



       {/* =================================================
    EXPLORE
    ================================================= */}

{/* =================================================
    EXPLORE
    ================================================= */}

<CCol
  xs={6}
  sm={3}
  lg={2}
  className="sabr-footer-col"
>
  <div className="sabr-footer-section">

    <h6 className="sabr-footer-heading">
      EXPLORE
    </h6>

    <CButton
      color="link"
      className="sabr-footer-link"
      onClick={() => handleNavigate('/')}
    >
      Home
    </CButton>

    <CButton
      color="link"
      className="sabr-footer-link"
      onClick={() => handleNavigate('/shop')}
    >
      Shop sarees
    </CButton>

    <CButton
      color="link"
      className="sabr-footer-link"
      onClick={() => handleNavigate('/shop/chiffon')}
    >
      Chiffon Sarees
    </CButton>

    <CButton
      color="link"
      className="sabr-footer-link"
      onClick={() => handleNavigate('/shop/georgette')}
    >
      Georgette Sarees
    </CButton>

    <CButton
      color="link"
      className="sabr-footer-link"
      onClick={() => handleNavigate('/contact')}
    >
      Contact us
    </CButton>

  </div>
</CCol>



            {/* =================================================
                HELP
                ================================================= */}

            <CCol
              xs={6}
              sm={3}
              lg={2}
              className="sabr-footer-col"
            >

              <div className="sabr-footer-section">

                <h6 className="sabr-footer-heading">
                  HELP
                </h6>


                <Link
                  to="/policies/shipping"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Shipping & returns
                </Link>


                <Link
                  to="/policies/care"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Care guide
                </Link>


                <CButton
                  color="link"
                  className="sabr-footer-link"
                  onClick={() => onNavigate('login')}
                >
                  My account
                </CButton>

              </div>

            </CCol>



            {/* =================================================
                POLICIES
                ================================================= */}

            <CCol
              xs={6}
              sm={3}
              lg={2}
              className="sabr-footer-col"
            >

              <div className="sabr-footer-section">

                <h6 className="sabr-footer-heading">
                  POLICIES
                </h6>


                <Link
                  to="/policies/return"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Return Policy
                </Link>


                <Link
                  to="/policies/refund"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Refund Policy
                </Link>


                <Link
                  to="/policies/shipping"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Shipping Policy
                </Link>


                <Link
                  to="/policies/cancellation"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Cancellation Policy
                </Link>


                <Link
                  to="/policies/terms"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Terms & Services
                </Link>


                <Link
                  to="/policies/privacy"
                  className="sabr-footer-link sabr-policy-link"
                >
                  Privacy Policy
                </Link>

              </div>

            </CCol>



            {/* =================================================
                CONTACT
                ================================================= */}

            <CCol
              xs={12}
              sm={6}
              lg={3}
              className="sabr-footer-col"
            >

              <div className="sabr-footer-section">

                <h6 className="sabr-footer-heading">
                  COME SAY HELLO
                </h6>


                <div className="sabr-contact-item">

                  <MapPin size={17} />

                  <span>
                    Jaipur, Rajasthan
                  </span>

                </div>


                <div className="sabr-contact-item">

                  <Phone size={17} />

                  <span>
                    +91 98765 43210
                  </span>

                </div>


                <div className="sabr-contact-item">

                  <Mail size={17} />

                  <span>
                    hello@thesabrindia.com
                  </span>

                </div>

              </div>

            </CCol>


          </CRow>

        </div>

      </CContainer>



      {/* =====================================================
          FOOTER ILLUSTRATION
          ===================================================== */}

      {/* <div className="sabr-footer-illustration">

        <img
          src={footerImage}
          alt="The Sabr India saree collection"
        />

      </div> */}



      {/* =====================================================
          BOTTOM
          ===================================================== */}

      <div className="sabr-footer-bottom">

        <div className="sabr-footer-container">

          <div className="sabr-footer-bottom-content">

            <span>
              © 2026 The Sabr India
            </span>

            <span>
              Made slowly, worn often.
            </span>

          </div>

        </div>

      </div>


    </CFooter>
  )
}


export default Footer