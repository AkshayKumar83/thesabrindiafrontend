import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { eye } from 'src/assets/icons/eye'
import { request } from '../../services/api'

const AdminRegister = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      await request({
        method: 'post',
        url: '/admin/register',
        data: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: formData.get('email'),
          contactNo: formData.get('contactNo'),
          password,
        },
      })
      navigate('/admin/control-panel/admins')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create admin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-2">
      <CRow className="justify-content-center">
        <CCol xs={12} xl={9}>
          <CCard>
            <CCardBody className="p-4 p-lg-5">
              <div className="mb-4">
                <h2 className="h4 mb-1">Create new admin</h2>
                <p className="text-body-secondary mb-0">
                  Add an administrator and assign access to the control panel.
                </p>
              </div>

              <CForm onSubmit={handleSubmit}>
                {error && <CAlert color="danger">{error}</CAlert>}
                <CRow className="g-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="firstName">First name</CFormLabel>
                    <CFormInput
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      autoComplete="given-name"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="lastName">Last name</CFormLabel>
                    <CFormInput
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      autoComplete="family-name"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email address</CFormLabel>
                    <CFormInput
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="contactNo">Contact number</CFormLabel>
                    <CFormInput
                      id="contactNo"
                      name="contactNo"
                      type="tel"
                      placeholder="Enter contact number"
                      autoComplete="tel"
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="password">Password</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required
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
                  <CCol md={6}>
                    <CFormLabel htmlFor="confirmPassword">Confirm password</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        required
                      />
                      <CInputGroupText>
                        <CTooltip content={showConfirmPassword ? 'Hide password' : 'Show password'}>
                          <CButton
                            type="button"
                            color="link"
                            className="p-0 link-secondary"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowConfirmPassword((visible) => !visible)}
                          >
                            <CIcon icon={eye} size="sm" />
                          </CButton>
                        </CTooltip>
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <CButton
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate('/admin/control-panel/admins')}
                  >
                    Cancel
                  </CButton>
                  <CButton color="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Creating admin...' : 'Create admin'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default AdminRegister
