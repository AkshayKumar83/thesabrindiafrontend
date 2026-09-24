// import { useState } from 'react'
// import { Eye, EyeOff, Mail, UserRound } from 'lucide-react'
// import API_BASE_URL, { API_ROUTES } from '../../config/api.js'
// import { useLocation } from 'react-router-dom';

// function Register() {

//   const location = useLocation();
//   const redirectTo = location.state?.redirectTo || "/";
//   const [form, setForm] = useState({ firstName: '', lastName: '', contactNo: '', email: '', password: '' })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [message, setMessage] = useState(null)

//   function updateField(event) {
//     const { name, value } = event.target
//     setForm((current) => ({ ...current, [name]: value }))
//     setMessage(null)
//   }
//   async function handleSubmit(event) {
//     event.preventDefault();

//     setMessage(null);
//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}${API_ROUTES.signup}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(
//           data.message || "Unable to create account"
//         );
//       }
//       login({
//         token: data.token,
//         user: data.user,
//       });
//       setForm({
//         firstName: "",
//         lastName: "",
//         contactNo: "",
//         email: "",
//         password: "",
//       });
//       await syncGuestCart();
//       navigate(redirectTo, {
//         replace: true,
//       });
//       setMessage({
//         type: "success",
//         text: data.message,
//       });
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="field-row">
//         <label>First name<span className="input-with-icon"><UserRound size={16} aria-hidden="true" /><input name="firstName" value={form.firstName} onChange={updateField} placeholder="Aarav" required /></span></label>
//       </div>
//        <div className="field-row">
//         <label>Last name<span className="input-with-icon"><UserRound size={16} aria-hidden="true" /><input name="lastName" value={form.lastName} onChange={updateField} placeholder="Sharma" required /></span></label>
//       </div>
//       <label>Contact number<input name="contactNo" value={form.contactNo} onChange={updateField} placeholder="98765 43210" inputMode="tel" required /></label>
//       <label>Email address<span className="input-with-icon"><Mail size={16} aria-hidden="true" /><input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" required /></span></label>
//       <label>Password<span className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} placeholder="At least 6 characters" minLength="6" autoComplete="new-password" required /><button className="icon-button" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
//       {message && <p className={`form-message ${message.type}`} role="alert">{message.text}</p>}
//       <button className="submit-button" type="submit" disabled={isLoading}>{isLoading ? 'Please wait...' : 'Create account'} <span aria-hidden="true">-&gt;</span></button>
//     </form>
//   )
// }

// export default Register



import { useState } from 'react'
import { Eye, EyeOff, Mail, UserRound } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import API_BASE_URL, { API_ROUTES } from '../../config/api.js'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

function Register() {
  const location = useLocation()
  const navigate = useNavigate()

  const { login } = useAuth()
  const { syncGuestCart } = useCart()

  const redirectTo = location.state?.redirectTo || '/'

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)


  /* =========================
     FIELD CHANGE
  ========================= */

  function updateField(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setMessage(null)
  }


  /* =========================
     SUBMIT
  ========================= */

  async function handleSubmit(event) {
    event.preventDefault()

    setMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.signup}`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(form),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to create account'
        )
      }


      /* Login */

      login({
        token: data.token,
        user: data.user,
      })


      /* Reset form */

      setForm({
        firstName: '',
        lastName: '',
        contactNo: '',
        email: '',
        password: '',
      })


      /* Sync guest cart */

      await syncGuestCart()


      /* Redirect */

      navigate(redirectTo, {
        replace: true,
      })


      setMessage({
        type: 'success',
        text: data.message,
      })

    } catch (error) {

      setMessage({
        type: 'error',
        text: error.message,
      })

    } finally {

      setIsLoading(false)

    }
  }


  return (
    <form
      className="auth-register-form"
      onSubmit={handleSubmit}
    >

      {/* =========================
          FIRST NAME
      ========================= */}

      <div className="auth-form-field">

        <label htmlFor="register-firstName">
          First name
        </label>

        <div className="auth-input-icon">

          <UserRound
            size={16}
            aria-hidden="true"
          />

          <input
            id="register-firstName"
            name="firstName"
            value={form.firstName}
            onChange={updateField}
            placeholder="Aarav"
            autoComplete="given-name"
            required
          />

        </div>

      </div>


      {/* =========================
          LAST NAME
      ========================= */}

      <div className="auth-form-field">

        <label htmlFor="register-lastName">
          Last name
        </label>

        <div className="auth-input-icon">

          <UserRound
            size={16}
            aria-hidden="true"
          />

          <input
            id="register-lastName"
            name="lastName"
            value={form.lastName}
            onChange={updateField}
            placeholder="Sharma"
            autoComplete="family-name"
            required
          />

        </div>

      </div>


      {/* =========================
          CONTACT
      ========================= */}

      <div className="auth-form-field">

        <label htmlFor="register-contactNo">
          Contact number
        </label>

        <input
          id="register-contactNo"
          name="contactNo"
          value={form.contactNo}
          onChange={updateField}
          placeholder="98765 43210"
          inputMode="tel"
          maxLength={10}
          required
        />

      </div>


      {/* =========================
          EMAIL
      ========================= */}

      <div className="auth-form-field">

        <label htmlFor="register-email">
          Email address
        </label>

        <div className="auth-input-icon">

          <Mail
            size={16}
            aria-hidden="true"
          />

          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

        </div>

      </div>


      {/* =========================
          PASSWORD
      ========================= */}

      <div className="auth-form-field">

        <label htmlFor="register-password">
          Password
        </label>

        <div className="auth-password-field">

          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={updateField}
            placeholder="At least 6 characters"
            minLength={6}
            autoComplete="new-password"
            required
          />

          <button
            className="auth-password-toggle"
            type="button"
            onClick={() =>
              setShowPassword((visible) => !visible)
            }
            aria-label={
              showPassword
                ? 'Hide password'
                : 'Show password'
            }
          >
            {showPassword
              ? <EyeOff size={17} />
              : <Eye size={17} />
            }
          </button>

        </div>

      </div>


      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <p
          className={`auth-form-message ${message.type}`}
          role="alert"
        >
          {message.text}
        </p>
      )}


      {/* =========================
          SUBMIT
      ========================= */}

      <button
        className="auth-submit-button"
        type="submit"
        disabled={isLoading}
      >
        <span>
          {isLoading
            ? 'Please wait...'
            : 'Create account'}
        </span>

        <span aria-hidden="true">
          -&gt;
        </span>

      </button>

    </form>
  )
}

export default Register
