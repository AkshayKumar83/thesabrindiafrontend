import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { apple } from 'src/assets/brand/apple'
import { google } from 'src/assets/brand/google'
import { logo } from 'src/assets/brand/logo'
import { eye } from 'src/assets/icons/eye'
import { request } from '../../services/api'

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

      const token = response?.token || response?.accessToken || response?.data?.token
      if (!token) {
        throw new Error('Login response did not include an authentication token.')
      }

      localStorage.setItem('token', token)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
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
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5}>
            <div className="d-flex flex-column gap-4">
              <div className="text-center">
                <CIcon icon={logo} height={48} />
              </div>
              <CCard className="p-4">
                <CCardBody className="d-flex flex-column gap-4">
                  <h2 className="h5 text-center mb-0">Login to your account</h2>
                  <CForm className="row gy-3" onSubmit={handleSubmit}>
                    {error && (
                      <CCol xs={12}>
                        <CAlert color="danger" className="mb-0">
                          {error}
                        </CAlert>
                      </CCol>
                    )}
                    <CCol xs={12}>
                      <CFormLabel htmlFor="email">Email address</CFormLabel>
                      <CFormInput
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                      />
                    </CCol>
                    <CCol xs={12}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="password">Password</CFormLabel>
                        <Link to="/authentication/reset-password">I forgot password</Link>
                      </div>
                      <CInputGroup>
                        <CFormInput
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Your password"
                          autoComplete="current-password"
                        />
                        <CInputGroupText>
                          <CTooltip content={showPassword ? 'Hide password' : 'Show password'}>
                            <CButton
                              type="button"
                              color="link"
                              className="p-0 link-secondary"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword((visible) => !visible)}
                            >
                              <CIcon icon={eye} size="sm" />
                            </CButton>
                          </CTooltip>
                        </CInputGroupText>
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12}>
                      <CFormCheck id="rememberMe" label="Remember me on this device" />
                    </CCol>
                    <CCol xs={12}>
                      <CButton
                        color="primary"
                        type="submit"
                        className="w-100"
                        disabled={submitting}
                      >
                        {submitting ? 'Signing in...' : 'Sign in'}
                      </CButton>
                    </CCol>
                  </CForm>
                  <div className="position-relative">
                    <hr />
                    <div className="position-absolute top-50 start-50 translate-middle bg-body px-2 text-body-tertiary text-uppercase small">
                      or
                    </div>
                  </div>
                  <CRow>
                    <CCol>
                      <CButton type="button" variant="outline" className="w-100">
                        <CIcon icon={google} className="me-1" />
                        Login with Google
                      </CButton>
                    </CCol>
                    <CCol>
                      <CButton type="button" variant="outline" className="w-100">
                        <CIcon icon={apple} className="me-1" />
                        Login with Apple
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
              <div className="text-center text-body-secondary">
                Need an account? <Link to="/authentication/register">Sign up</Link>
              </div>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default AdminLogin
