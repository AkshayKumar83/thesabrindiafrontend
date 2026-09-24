// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Login from '../components/Login.jsx'
// import Register from '../components/Register.jsx'
// import ForgotPassword from '../components/ForgotPassword.jsx'
// import logoSabr from '../../assets/brand/logoSabr.jpeg'
// const AuthPage = ()=>{
//     const [mode, setMode] = useState('login');
//     const navigate = useNavigate();
//     return (
//          <>
//         <main className="auth-shell">
//           <section className="brand-panel">
//             <div
//               className="brand-mark"
//               aria-hidden="true"
//               onClick={() => {
//                 navigate('/')
//               }}
//             >
//   <img
//     src={logoSabr}
//     alt="The Sabr India"
//     className="store-logo-image"
//   />
//             </div>

//             <div className="brand-copy">
//               <p className="eyebrow">
//                 THE SABR INDIA
//               </p>

//               <h1>
//                 Thoughtful goods.
//                 <br />
//                 <em>Patiently made.</em>
//               </h1>

//               <p className="brand-description">
//                 A considered collection of everyday pieces,
//                 made to stay with you.
//               </p>
//             </div>

//             <p className="brand-footer">
//               Crafted with intention since 2026
//             </p>
//           </section>

//           <section className="form-panel">
//             <div className="form-wrap">

//               <div className="mobile-brand">
//                 THE SABR INDIA
//               </div>

//               <div className="form-heading">
//                 <p className="eyebrow">
//                   YOUR ACCOUNT
//                 </p>

//                 <h2>
//                   {mode === 'register'
//                     ? 'Create your account'
//                     : mode === 'forgot'
//                       ? 'Reset your password'
//                       : 'Welcome back'}
//                 </h2>

//                 <p>
//                   {mode === 'register'
//                     ? 'Join a slower, more thoughtful way to shop.'
//                     : mode === 'forgot'
//                       ? 'We will help you get back into your account.'
//                       : 'Sign in to continue your journey with us.'}
//                 </p>
//               </div>

//               {mode !== 'forgot' && (
//                 <div
//                   className="mode-switch"
//                   role="tablist"
//                   aria-label="Account action"
//                 >
//                   <button
//                     className={mode === 'login' ? 'active' : ''}
//                     onClick={() => setMode('login')}
//                     type="button"
//                   >
//                     Sign in
//                   </button>

//                   <button
//                     className={mode === 'register' ? 'active' : ''}
//                     onClick={() => setMode('register')}
//                     type="button"
//                   >
//                     Create account
//                   </button>
//                 </div>
//               )}

//               {mode === 'register' ? (
//                 <Register />
//               ) : mode === 'forgot' ? (
//                 <ForgotPassword
//                   onBack={() => setMode('login')}
//                 />
//               ) : (
//                 <Login
//                   onForgot={() => setMode('forgot')}
//                 />
//               )}

//               <p className="legal-copy">
//                 By continuing, you agree to our{' '}
//                 <a href="#terms">Terms</a> and{' '}
//                 <a href="#privacy">Privacy Policy</a>.
//               </p>

//             </div>
//           </section>
//         </main>
//       </>
//     );
// }

// export default AuthPage;


import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Login from '../components/Login.jsx'
import Register from '../components/Register.jsx'
import ForgotPassword from '../components/ForgotPassword.jsx'

import logoSabr from '../../assets/brand/logoSabr.png'
import adminImage from '../../assets/images/adminImage.png'

import './AuthPage.css'

const AuthPage = () => {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()

  return (
    <main
      className="auth-page"
      style={{
        backgroundImage: `url(${adminImage})`,
      }}
    >
      <div className="auth-wrapper">

        {/* =========================
            AUTH CARD
        ========================= */}

       <section
  className={`auth-card ${
    mode === 'register' ? 'register-mode' : ''
  }`}
>

          {/* =========================
              LOGO
          ========================= */}

          <div
            className="auth-logo"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                navigate('/')
              }
            }}
          >
            <img
              src={logoSabr}
              alt="The Sabr India"
              className="auth-logo-image"
            />
          </div>


          {/* =========================
              HEADING
          ========================= */}

          <div className="auth-heading">

            <h1>
              {mode === 'register'
                ? 'Create your account'
                : mode === 'forgot'
                  ? 'Reset your password'
                  : 'Welcome back'}
            </h1>

            <p>
              {mode === 'register'
                ? 'Join a slower, more thoughtful way to shop.'
                : mode === 'forgot'
                  ? 'We will help you get back into your account.'
                  : 'Sign in to continue your journey with us.'}
            </p>

          </div>


          {/* =========================
              LOGIN / REGISTER SWITCH
          ========================= */}

          {mode !== 'forgot' && (
            <div
              className="auth-mode-switch"
              role="tablist"
              aria-label="Account action"
            >

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
              >
                Sign in
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={mode === 'register' ? 'active' : ''}
                onClick={() => setMode('register')}
              >
                Sign up
              </button>

            </div>
          )}


          {/* =========================
              PAGE CONTENT
          ========================= */}

          <div className="auth-content">

            {mode === 'register' && (
              <Register />
            )}

            {mode === 'forgot' && (
              <ForgotPassword
                onBack={() => setMode('login')}
              />
            )}

            {mode === 'login' && (
              <Login
                onForgot={() => setMode('forgot')}
              />
            )}

          </div>


          {/* =========================
              LEGAL
          ========================= */}

          <p className="auth-legal">
            By continuing, you agree to our{' '}
            <a href="#/policies/terms">
              Terms
            </a>
            {' '}and{' '}
            <a href="#/policies/privacy">
              Privacy Policy
            </a>.
          </p>

        </section>


        {/* =========================
            COPYRIGHT
        ========================= */}

        <p className="auth-copyright">
          © {new Date().getFullYear()} The Sabr India.
          All rights reserved.
        </p>

      </div>
    </main>
  )
}

export default AuthPage