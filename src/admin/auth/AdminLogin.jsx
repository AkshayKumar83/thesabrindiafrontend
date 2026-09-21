import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import CIcon from '@coreui/icons-react'

import logoSabr from 'src/assets/brand/logoSabr.png'
import adminImage from 'src/assets/images/adminImage.png'

import { request } from '../../services/api'

import './AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await request({
        method: 'post',
        url: '/admin/login',
        data: {
          email: formData.get('email'),
          password: formData.get('password'),
        },
      })

      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token

      if (!token) {
        throw new Error(
          'Login response did not include an authentication token.',
        )
      }

      localStorage.setItem('etoken', token)

      navigate(
        location.state?.from?.pathname || '/admin/dashboard',
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Unable to sign in. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="admin-login-page"
      style={{
        backgroundImage: `url(${adminImage})`,
      }}
    >
      <CContainer fluid className="admin-login-container">
        <CRow className="justify-content-center">
          <CCol
            xs={12}
            sm={10}
            md={7}
            lg={5}
            xl={4}
            xxl={4}
          >
            <div className="admin-login-wrapper">

             

              {/* LOGIN CARD */}
              <CCard className="admin-login-card">
                <CCardBody>

            {/* BRAND LOGO */}
              <div className="admin-card-logo">
              <img
                src={logoSabr}
                alt="The Sabr India"
                className="admin-logo"
              />
            </div>

                  {/* HEADER */}
                  <div className="admin-login-heading">

                    <div className="admin-login-lock">
                      <LockKeyhole
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <h1>Welcome Back</h1>

                      <p>
                        Sign in to your admin account
                      </p>
                    </div>

                  </div>

                  {/* ERROR */}
                  {error && (
                    <CAlert
                      color="danger"
                      className="admin-login-alert"
                    >
                      {error}
                    </CAlert>
                  )}

                  {/* LOGIN FORM */}
                  <CForm onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <div className="admin-form-group">

                      <CFormLabel htmlFor="email">
                        Email address
                      </CFormLabel>

                      <CInputGroup className="admin-input-group">

                        <CInputGroupText>
                          <Mail size={17} />
                        </CInputGroupText>

                        <CFormInput
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          required
                        />

                      </CInputGroup>

                    </div>

                    {/* PASSWORD */}
                    <div className="admin-form-group">

                      <div className="admin-password-label">
                        <CFormLabel htmlFor="password">
                          Password
                        </CFormLabel>
                      </div>

                      <CInputGroup className="admin-input-group">

                        <CInputGroupText>
                          <LockKeyhole size={17} />
                        </CInputGroupText>

                        <CFormInput
                          id="password"
                          name="password"
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          required
                        />

                        <CInputGroupText
                          className="admin-password-toggle"
                          onClick={() =>
                            setShowPassword(
                              (visible) => !visible,
                            )
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </CInputGroupText>

                      </CInputGroup>

                    </div>

                    {/* REMEMBER ME */}
                    <div className="admin-login-options">

                      <label className="admin-remember">

                        <input
                          type="checkbox"
                          name="rememberMe"
                        />

                        <span>
                          Remember me
                        </span>

                      </label>

                    </div>

                    {/* LOGIN BUTTON */}
                    <CButton
                      type="submit"
                      className="admin-login-button"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <CSpinner
                            size="sm"
                            className="me-2"
                          />

                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </CButton>

                  </CForm>

                  {/* CARD FOOTER */}
                  <div className="admin-login-footer">

                    <span>
                      THE SABR INDIA
                    </span>

                    <small>
                      Admin Portal
                    </small>

                  </div>

                </CCardBody>
              </CCard>

              {/* COPYRIGHT */}
              <p className="admin-login-copyright">
                © {new Date().getFullYear()} The Sabr India.
                All rights reserved.
              </p>

            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default AdminLogin