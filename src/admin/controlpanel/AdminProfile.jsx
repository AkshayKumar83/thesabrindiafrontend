import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'

import { request } from '../../services/api'
import './AdminDetails.css'
import { useAuth } from "../../context/AuthContext";
import toast from 'react-hot-toast';

const AdminProfile = () => {
    
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
  })
const { isLoggedIn, user, logout } = useAuth();  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ==========================================================
  // GET LOGGED-IN ADMIN PROFILE
  // ==========================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await request({
          url: '/admin/'+user?.id,
          method: 'get',
        })

        const admin = response?.admin || response?.data || response

        setForm({
          firstName: admin?.firstName || '',
          lastName: admin?.lastName || '',
          email: admin?.email || '',
          contactNo: admin?.contactNo || '',
        })
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            'Unable to load profile.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ==========================================================
  // UPDATE PROFILE
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await request({
        method: 'put',
        url: '/admin/'+user?.id,
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          contactNo: form.contactNo,
        },
      })
      console.log("response",response)

      toast.success(response?.message||'Profile updated successfully.')
    } catch (requestError) {
      console.log("requestError",requestError)
      setError(
        requestError.response?.data?.message ||
          'Unable to update profile.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="admin-register-page py-2">
      <CRow className="justify-content-center">
        <CCol xs={12} xl={9}>
          <CCard className="admin-register-card">
            <CCardBody className="admin-register-body">

              <div className="admin-register-header mb-4">
                <h2 className="admin-register-title">
                  Admin Profile
                </h2>

                <p className="admin-register-subtitle mb-0">
                  Update your profile information.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CForm
                  className="admin-register-form"
                  onSubmit={handleSubmit}
                >
                  {error && (
                    <CAlert color="danger">
                      {error}
                    </CAlert>
                  )}

                  {success && (
                    <CAlert color="success">
                      {success}
                    </CAlert>
                  )}

                  {/* First Name / Last Name */}

                  <CRow className="g-3">
                    <CCol xs={12} md={6}>
                      <CFormLabel
                        className="admin-register-label"
                        htmlFor="firstName"
                      >
                        First Name
                      </CFormLabel>

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

                    <CCol xs={12} md={6}>
                      <CFormLabel
                        className="admin-register-label"
                        htmlFor="lastName"
                      >
                        Last Name
                      </CFormLabel>

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

                  {/* Email / Contact */}

                  <CRow className="g-3 mt-1">
                    <CCol xs={12} md={6}>
                      <CFormLabel
                        className="admin-register-label"
                        htmlFor="email"
                      >
                        Email Address
                      </CFormLabel>

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

                    <CCol xs={12} md={6}>
                      <CFormLabel
                        className="admin-register-label"
                        htmlFor="contactNo"
                      >
                        Contact Number
                      </CFormLabel>

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

                  {/* Update Button */}

                  <div className="admin-register-actions d-flex justify-content-end mt-4">
                    <CButton
                      className="sabr-maroon-btn"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Updating...'
                        : 'Update Profile'}
                    </CButton>
                  </div>
                </CForm>
              )}

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default AdminProfile