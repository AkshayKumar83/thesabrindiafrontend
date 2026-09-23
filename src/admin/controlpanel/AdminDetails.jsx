import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  CSpinner,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
// import { eye  } from 'src/assets/icons/eye'
import { request } from '../../services/api'
import './AdminDetails.css'

import { Eye, EyeOff } from 'lucide-react'

const AdminRegister = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('isEditMode:', isEditMode, 'id:', id) // Debugging log
    if (!isEditMode) return

    const loadAdmin = async () => {
      try {
        const response = await request({ url: `/admin/${id}` })
        const admin = response?.admin || response?.data || response

        setForm((current) => ({
          ...current,
          firstName: admin.firstName || '',
          lastName: admin.lastName || '',
          email: admin.email || '',
          contactNo: admin.contactNo || '',
        }))
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load admin.')
      } finally {
        setLoading(false)
      }
    }

    loadAdmin()
  }, [id, isEditMode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const { firstName, lastName, email, contactNo, password, confirmPassword } = form

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      const data = { firstName, lastName, email, contactNo }
      if (password) data.password = password

      await request({
        method: isEditMode ? 'put' : 'post',
        url: isEditMode ? `/admin/${id}` : '/admin/register',
        data,
      })
      navigate('/admin/control-panel/admins')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (isEditMode ? 'Unable to update admin.' : 'Unable to create admin.'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-register-page py-2">
      <CRow className="justify-content-center">
       <CCol xs={12} xl={9}>
        <CCard className="admin-register-card">
          <CCardBody className="admin-register-body">
              <div className="admin-register-header mb-4">
                <h2 className="admin-register-title">
                  {isEditMode ? 'Update admin' : 'Create new admin'}
                </h2>

                <p className="admin-register-subtitle mb-0">
                  {isEditMode
                    ? 'Update administrator account details.'
                    : 'Add an administrator and assign access to the control panel.'}
                </p>
              </div>

              {loading && <CSpinner color="primary" />}
             <CForm className="admin-register-form" onSubmit={handleSubmit}>
                {error && <CAlert color="danger">{error}</CAlert>}
                <CRow className="g-3">
                  <CCol xs={12} md={6} lg={6}>
                   <CFormLabel className="admin-register-label" htmlFor="firstName">First name</CFormLabel>
                    <CFormInput
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      autoComplete="given-name"
                      required
                    />
                  </CCol>
                  <CCol  xs={12} md={6}  lg={6}>
                    <CFormLabel className="admin-register-label" htmlFor="lastName">Last name</CFormLabel>
                    <CFormInput
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      autoComplete="family-name"
                      required
                    />
                  </CCol>
                  </CRow>
                    <CRow className="g-3">
                  <CCol  xs={12}  md={6}  lg={6}>
                    <CFormLabel className="admin-register-label"  htmlFor="email">Email address</CFormLabel>
                    <CFormInput
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      required
                    />
                  </CCol>
                  <CCol  xs={12} md={6}  lg={6}>
                    <CFormLabel className="admin-register-label" htmlFor="contactNo">Contact number</CFormLabel>
                    <CFormInput
                      id="contactNo"
                      name="contactNo"
                      value={form.contactNo}
                      onChange={handleChange}
                      type="tel"
                      placeholder="Enter contact number"
                      autoComplete="tel"
                      required
                    />
                  </CCol>
                  </CRow>
                    <CRow className="g-3">
                  <CCol  xs={12} md={6}  lg={6}>
                    <CFormLabel className="admin-register-label" htmlFor="password">Password</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        required={!isEditMode}
                      />
                      <CInputGroupText>
                        {/* <CTooltip  content={showPassword ? 'Hide password' : 'Show password'}> */}
                         <CButton
                          type="button"
                          color="link"
                          className="admin-register-eye-btn p-0"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((visible) => !visible)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </CButton>
                        {/* </CTooltip> */}
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                  <CCol  xs={12} md={6}  lg={6}>
                    <CFormLabel className="admin-register-label"  htmlFor="confirmPassword">Confirm password</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        required={!isEditMode}
                      />
                      <CInputGroupText>
                        {/* <CTooltip content={showConfirmPassword ? 'Hide password' : 'Show password'}> */}
                          <CButton
                            type="button"
                            color="link"
                            className="admin-register-eye-btn p-0"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowConfirmPassword((visible) => !visible)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </CButton>
                        {/* </CTooltip> */}
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

               <div className="admin-register-actions d-flex justify-content-end gap-5 mt-3">
                  <CButton
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate('/admin/control-panel/admins')}
                  >
                    Cancel
                  </CButton>
                  <CButton   className="sabr-maroon-btn" type="submit" disabled={submitting || loading} >
                    {submitting
                      ? isEditMode
                        ? 'Updating admin...'
                        : 'Creating admin...'
                      : isEditMode
                        ? 'Update admin'
                        : 'Create admin'}
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
