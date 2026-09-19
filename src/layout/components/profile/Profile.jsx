import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'

import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  LockKeyhole,
  Check,
  X,
} from 'lucide-react'

import { useAuth } from '../../../context/AuthContext.jsx'
import API_BASE_URL, { API_ROUTES } from '../../../config/api.js'

import './Profile.css'
import { getAddressesApi } from '../../../services/address.api.js'


const Profile = () => {

  const {
    user,
    token,
    login,
  } = useAuth()


  /* =========================================================
     PROFILE STATE
  ========================================================= */

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    contactNo: '',
    email: '',
  })

  const [profileLoading, setProfileLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)

  const [profileMessage, setProfileMessage] = useState(null)


  /* =========================================================
     ADDRESS STATE
  ========================================================= */

  const [addresses, setAddresses] = useState([])

  const [addressLoading, setAddressLoading] = useState(true)

  const [addressMode, setAddressMode] = useState(null)

  const [selectedAddress, setSelectedAddress] = useState(null)

  const [addressSaving, setAddressSaving] = useState(false)

  const [addressMessage, setAddressMessage] = useState(null)


  /* =========================================================
     ADDRESS FORM
  ========================================================= */

  const emptyAddress = {
    name: '',
    phoneNo: '',
    addressLine1: '',
    addressLine2: '',
    addressType: 'Home',
    city: '',
    pincode: '',
    state: '',
    country: 'India',
    isDefault: false,
  }

  const [addressForm, setAddressForm] = useState(emptyAddress)


  /* =========================================================
     PASSWORD STATE
  ========================================================= */

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [passwordSaving, setPasswordSaving] = useState(false)

  const [passwordMessage, setPasswordMessage] = useState(null)


  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {

    loadProfile()

  }, [])


  /* =========================================================
     LOAD PROFILE + ADDRESSES
  ========================================================= */

  const loadProfile = async () => {

    setProfileLoading(true)
    setAddressLoading(true)

    try {

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.profile}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      const addressData = await getAddressesApi();
      setAddresses(addressData?.data || []);
      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load profile'
        )
      }


      /*
       * Expected backend response:
       *
       * {
       *   user: {...},
       *   addresses: [...]
       * }
       */

      const profileUser = data.user || data

      setProfile({
        firstName: profileUser.firstName || '',
        lastName: profileUser.lastName || '',
        contactNo: profileUser.contactNo || '',
        email: profileUser.email || '',
      })

    } catch (error) {

      setProfileMessage({
        type: 'danger',
        text: error.message,
      })

    } finally {

      setProfileLoading(false)
      setAddressLoading(false)

    }
  }


  /* =========================================================
     PROFILE FIELD CHANGE
  ========================================================= */

  const handleProfileChange = (event) => {

    const {
      name,
      value,
    } = event.target

    setProfile((current) => ({
      ...current,
      [name]: value,
    }))

    setProfileMessage(null)
  }


  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleProfileSubmit = async (event) => {

    event.preventDefault()

    setProfileSaving(true)
    setProfileMessage(null)

    try {

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.profile}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            firstName: profile.firstName,
            lastName: profile.lastName,
            contactNo: profile.contactNo,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to update profile'
        )
      }


      /*
       * Update AuthContext user as well
       */

      if (data.user) {

        login({
          token,
          user: data.user,
        })

      } else if (user) {

        login({
          token,

          user: {
            ...user,

            firstName: profile.firstName,
            lastName: profile.lastName,
            contactNo: profile.contactNo,
          },
        })
      }


      setProfileMessage({
        type: 'success',
        text: data.message || 'Profile updated successfully.',
      })

    } catch (error) {

      setProfileMessage({
        type: 'danger',
        text: error.message,
      })

    } finally {

      setProfileSaving(false)

    }
  }


  /* =========================================================
     ADDRESS FIELD CHANGE
  ========================================================= */

  const handleAddressChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setAddressForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    setAddressMessage(null)
  }


  /* =========================================================
     OPEN ADD ADDRESS
  ========================================================= */

  const handleAddAddress = () => {

    setSelectedAddress(null)

    setAddressForm(emptyAddress)

    setAddressMode('add')

    setAddressMessage(null)
  }


  /* =========================================================
     OPEN EDIT ADDRESS
  ========================================================= */

  const handleEditAddress = (address) => {

    setSelectedAddress(address)

    setAddressForm({
      name: address.name || '',
      phoneNo: address.phoneNo || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      addressType: address.addressType || 'Home',
      city: address.city || '',
      pincode: address.pincode || '',
      state: address.state || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false,
    })

    setAddressMode('edit')

    setAddressMessage(null)
  }


  /* =========================================================
     CLOSE ADDRESS FORM
  ========================================================= */

  const handleCancelAddress = () => {

    setAddressMode(null)

    setSelectedAddress(null)

    setAddressForm(emptyAddress)

    setAddressMessage(null)
  }


  /* =========================================================
     SAVE ADDRESS
  ========================================================= */

  const handleAddressSubmit = async (event) => {

    event.preventDefault()

    setAddressSaving(true)
    setAddressMessage(null)

    try {

      const isEdit = addressMode === 'edit'

      const url = isEdit
        ? `${API_BASE_URL}${API_ROUTES.addresses}/${selectedAddress.id}`
        : `${API_BASE_URL}${API_ROUTES.addresses}`

      const response = await fetch(
        url,
        {
          method: isEdit ? 'PUT' : 'POST',

          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...addressForm,

            pincode: Number(addressForm.pincode),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to save address'
        )
      }


      /*
       * Backend can return:
       *
       * data.address
       */

      if (isEdit) {

        setAddresses((current) =>
          current.map((address) =>
            address.id === selectedAddress.id
              ? data.address
              : address
          )
        )

      } else {

        setAddresses((current) => [
          ...current,
          data.address,
        ])
      }


      /*
       * If new address is default,
       * update other addresses locally.
       */

      if (addressForm.isDefault) {

        const savedId = data.address?.id

        setAddresses((current) =>
          current.map((address) => ({
            ...address,

            isDefault:
              address.id === savedId,
          }))
        )
      }


      setAddressMessage({
        type: 'success',
        text:
          data.message ||
          `Address ${
            isEdit ? 'updated' : 'added'
          } successfully.`,
      })

      setAddressMode(null)

      setSelectedAddress(null)

    } catch (error) {

      setAddressMessage({
        type: 'danger',
        text: error.message,
      })

    } finally {

      setAddressSaving(false)

    }
  }


  /* =========================================================
     DELETE ADDRESS
  ========================================================= */

  const handleDeleteAddress = async (addressId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    )

    if (!confirmed) {
      return
    }

    try {

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.addresses}/${addressId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to delete address'
        )
      }

      setAddresses((current) =>
        current.filter(
          (address) => address.id !== addressId
        )
      )

      setAddressMessage({
        type: 'success',
        text:
          data.message ||
          'Address deleted successfully.',
      })

    } catch (error) {

      setAddressMessage({
        type: 'danger',
        text: error.message,
      })
    }
  }


  /* =========================================================
     PASSWORD FIELD CHANGE
  ========================================================= */

  const handlePasswordChange = (event) => {

    const {
      name,
      value,
    } = event.target

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }))

    setPasswordMessage(null)
  }


  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

  const handlePasswordSubmit = async (event) => {

    event.preventDefault()

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {

      setPasswordMessage({
        type: 'danger',
        text: 'New password and confirm password do not match.',
      })

      return
    }

    setPasswordSaving(true)
    setPasswordMessage(null)

    try {

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.changePassword}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword:
              passwordForm.currentPassword,

            newPassword:
              passwordForm.newPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to change password'
        )
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setPasswordMessage({
        type: 'success',
        text:
          data.message ||
          'Password updated successfully.',
      })

    } catch (error) {

      setPasswordMessage({
        type: 'danger',
        text: error.message,
      })

    } finally {

      setPasswordSaving(false)

    }
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (profileLoading) {

    return (
      <div className="profile-page-loading">

        <CSpinner />

        <p>
          Loading your profile...
        </p>

      </div>
    )
  }


  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="profile-page">

      <CContainer>

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="profile-page-header">

          <div>

            <p className="profile-eyebrow">
              MY ACCOUNT
            </p>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal information,
              addresses and account security.
            </p>

          </div>

          <div className="profile-avatar">

            <UserRound size={28} />

          </div>

        </div>


        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <CCard className="profile-card">

          <CCardHeader className="profile-card-header">

            <div className="profile-section-title">

              <UserRound size={19} />

              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Update your personal details.
                </p>
              </div>

            </div>

          </CCardHeader>


          <CCardBody>

            {profileMessage && (
              <CAlert
                color={profileMessage.type}
                className="profile-alert"
              >
                {profileMessage.text}
              </CAlert>
            )}


            <CForm onSubmit={handleProfileSubmit}>

              <CRow className="g-4">

                <CCol md={6}>

                  <CFormLabel>
                    First Name
                  </CFormLabel>

                  <CFormInput
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    placeholder="First name"
                    required
                  />

                </CCol>


                <CCol md={6}>

                  <CFormLabel>
                    Last Name
                  </CFormLabel>

                  <CFormInput
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    placeholder="Last name"
                    required
                  />

                </CCol>


                <CCol md={6}>

                  <CFormLabel>
                    Contact Number
                  </CFormLabel>

                  <div className="profile-input-icon">

                    <Phone size={16} />

                    <CFormInput
                      name="contactNo"
                      value={profile.contactNo}
                      onChange={handleProfileChange}
                      placeholder="Contact number"
                      maxLength={10}
                      required
                    />

                  </div>

                </CCol>


                <CCol md={6}>

                  <CFormLabel>
                    Email Address
                  </CFormLabel>

                  <div className="profile-input-icon">

                    <Mail size={16} />

                    <CFormInput
                      value={profile.email}
                      disabled
                    />

                  </div>

                  <small className="profile-field-note">
                    Email cannot be changed here.
                  </small>

                </CCol>

              </CRow>


              <div className="profile-form-actions">

                <CButton
                  type="submit"
                  className="profile-primary-button"
                  disabled={profileSaving}
                >

                  {profileSaving ? (
                    <>
                      <CSpinner
                        size="sm"
                        className="me-2"
                      />

                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}

                </CButton>

              </div>

            </CForm>

          </CCardBody>

        </CCard>


        {/* =====================================================
            ADDRESSES
        ===================================================== */}

        <CCard className="profile-card">

          <CCardHeader className="profile-card-header">

            <div className="profile-section-title">

              <MapPin size={19} />

              <div>
                <h2>
                  My Addresses
                </h2>

                <p>
                  Manage your delivery addresses.
                </p>
              </div>

            </div>


            {!addressMode && (
              <CButton
                className="profile-outline-button"
                onClick={handleAddAddress}
              >

                <Plus size={17} />

                Add Address

              </CButton>
            )}

          </CCardHeader>


          <CCardBody>

            {addressMessage && (
              <CAlert
                color={addressMessage.type}
                className="profile-alert"
              >
                {addressMessage.text}
              </CAlert>
            )}


            {/* ADDRESS FORM */}

            {addressMode && (

              <div className="address-form-wrapper">

                <div className="address-form-heading">

                  <div>

                    <h3>
                      {addressMode === 'edit'
                        ? 'Edit Address'
                        : 'Add New Address'}
                    </h3>

                    <p>
                      Enter your delivery details.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="address-close-button"
                    onClick={handleCancelAddress}
                  >
                    <X size={19} />
                  </button>

                </div>


                <CForm onSubmit={handleAddressSubmit}>

                  <CRow className="g-3">

                    <CCol md={6}>

                      <CFormLabel>
                        Full Name
                      </CFormLabel>

                      <CFormInput
                        name="name"
                        value={addressForm.name}
                        onChange={handleAddressChange}
                        placeholder="Full name"
                        required
                      />

                    </CCol>


                    <CCol md={6}>

                      <CFormLabel>
                        Phone Number
                      </CFormLabel>

                      <CFormInput
                        name="phoneNo"
                        value={addressForm.phoneNo}
                        onChange={handleAddressChange}
                        placeholder="Phone number"
                        maxLength={10}
                        required
                      />

                    </CCol>


                    <CCol md={6}>

                      <CFormLabel>
                        Address Type
                      </CFormLabel>

                      <CFormSelect
                        name="addressType"
                        value={addressForm.addressType}
                        onChange={handleAddressChange}
                      >
                        <option value="Home">
                          Home
                        </option>

                        <option value="Work">
                          Work
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </CFormSelect>

                    </CCol>


                    <CCol md={6}>

                      <CFormLabel>
                        Pincode
                      </CFormLabel>

                      <CFormInput
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressChange}
                        placeholder="Pincode"
                        maxLength={6}
                        required
                      />

                    </CCol>


                    <CCol xs={12}>

                      <CFormLabel>
                        Address Line 1
                      </CFormLabel>

                      <CFormInput
                        name="addressLine1"
                        value={addressForm.addressLine1}
                        onChange={handleAddressChange}
                        placeholder="House / Flat / Street"
                        required
                      />

                    </CCol>


                    <CCol xs={12}>

                      <CFormLabel>
                        Address Line 2
                      </CFormLabel>

                      <CFormInput
                        name="addressLine2"
                        value={addressForm.addressLine2}
                        onChange={handleAddressChange}
                        placeholder="Area / Landmark (optional)"
                      />

                    </CCol>


                    <CCol md={4}>

                      <CFormLabel>
                        City
                      </CFormLabel>

                      <CFormInput
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        required
                      />

                    </CCol>


                    <CCol md={4}>

                      <CFormLabel>
                        State
                      </CFormLabel>

                      <CFormInput
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        required
                      />

                    </CCol>


                    <CCol md={4}>

                      <CFormLabel>
                        Country
                      </CFormLabel>

                      <CFormInput
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        disabled
                      />

                    </CCol>


                    <CCol xs={12}>

                      <label className="default-address-check">

                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={addressForm.isDefault}
                          onChange={handleAddressChange}
                        />

                        <span>
                          Make this my default address
                        </span>

                      </label>

                    </CCol>

                  </CRow>


                  <div className="address-form-actions">

                    <CButton
                      type="button"
                      className="profile-cancel-button"
                      onClick={handleCancelAddress}
                    >
                      Cancel
                    </CButton>

                    <CButton
                      type="submit"
                      className="profile-primary-button"
                      disabled={addressSaving}
                    >

                      {addressSaving ? (
                        <>
                          <CSpinner
                            size="sm"
                            className="me-2"
                          />

                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={16} />

                          {addressMode === 'edit'
                            ? 'Update Address'
                            : 'Save Address'}
                        </>
                      )}

                    </CButton>

                  </div>

                </CForm>

              </div>
            )}


            {/* ADDRESS LIST */}

            {!addressMode && (

              <>

                {addressLoading ? (

                  <div className="address-loading">

                    <CSpinner size="sm" />

                    <span>
                      Loading addresses...
                    </span>

                  </div>

                ) : addresses.length === 0 ? (

                  <div className="empty-address">

                    <MapPin size={30} />

                    <h3>
                      No addresses yet
                    </h3>

                    <p>
                      Add an address to make checkout
                      faster.
                    </p>

                    <CButton
                      className="profile-primary-button"
                      onClick={handleAddAddress}
                    >
                      <Plus size={17} />
                      Add Address
                    </CButton>

                  </div>

                ) : (

                  <div className="address-grid">

                    {addresses.map((address) => (

                      <div
                        className="address-card"
                        key={address.id}
                      >

                        <div className="address-card-top">

                          <div className="address-type">

                            <MapPin size={17} />

                            <strong>
                              {address.addressType}
                            </strong>

                          </div>


                          {address.isDefault && (
                            <CBadge
                              className="default-badge"
                            >
                              Default
                            </CBadge>
                          )}

                        </div>


                        <div className="address-card-content">

                          <h3>
                            {address.name}
                          </h3>

                          <p className="address-phone">
                            {address.phoneNo}
                          </p>

                          <p>
                            {address.addressLine1}
                          </p>

                          {address.addressLine2 && (
                            <p>
                              {address.addressLine2}
                            </p>
                          )}

                          <p>
                            {address.city},{' '}
                            {address.state}
                            {' - '}
                            {address.pincode}
                          </p>

                          <p>
                            {address.country}
                          </p>

                        </div>


                        <div className="address-card-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditAddress(address)
                            }
                          >
                            <Pencil size={15} />
                            Edit
                          </button>


                          <button
                            type="button"
                            className="delete-address-button"
                            onClick={() =>
                              handleDeleteAddress(
                                address.id
                              )
                            }
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </>
            )}

          </CCardBody>

        </CCard>


        {/* =====================================================
            SECURITY
        ===================================================== */}

        <CCard className="profile-card">

          <CCardHeader className="profile-card-header">

            <div className="profile-section-title">

              <LockKeyhole size={19} />

              <div>

                <h2>
                  Security
                </h2>

                <p>
                  Keep your account secure.
                </p>

              </div>

            </div>

          </CCardHeader>


          <CCardBody>

            {passwordMessage && (
              <CAlert
                color={passwordMessage.type}
                className="profile-alert"
              >
                {passwordMessage.text}
              </CAlert>
            )}


            <CForm onSubmit={handlePasswordSubmit}>

              <CRow className="g-3">

                <CCol md={4}>

                  <CFormLabel>
                    Current Password
                  </CFormLabel>

                  <CFormInput
                    type="password"
                    name="currentPassword"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Current password"
                    required
                  />

                </CCol>


                <CCol md={4}>

                  <CFormLabel>
                    New Password
                  </CFormLabel>

                  <CFormInput
                    type="password"
                    name="newPassword"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="New password"
                    minLength={6}
                    required
                  />

                </CCol>


                <CCol md={4}>

                  <CFormLabel>
                    Confirm Password
                  </CFormLabel>

                  <CFormInput
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={handlePasswordChange}
                    placeholder="Confirm password"
                    minLength={6}
                    required
                  />

                </CCol>

              </CRow>


              <div className="profile-form-actions">

                <CButton
                  type="submit"
                  className="profile-primary-button"
                  disabled={passwordSaving}
                >

                  {passwordSaving ? (
                    <>
                      <CSpinner
                        size="sm"
                        className="me-2"
                      />

                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}

                </CButton>

              </div>

            </CForm>

          </CCardBody>

        </CCard>

      </CContainer>

    </main>
  )
}

export default Profile