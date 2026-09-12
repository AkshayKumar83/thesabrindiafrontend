import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CImage,
  CAlert,
  CSpinner,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import { request } from '../../services/api'

const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith('http')) return imageUrl || ''
  return `http://localhost:8090${imageUrl}`
}

const CategoryDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('1')
  const [image, setImage] = useState(null) // File object
  const [imagePreview, setImagePreview] = useState('') // URL for preview
  const [existingImage, setExistingImage] = useState('') // image URL from backend (edit mode)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, color) => {
    setToast(
      <CToast autohide color={color} visible>
        <CToastBody className="text-white">{message}</CToastBody>
      </CToast>,
    )
  }

  // Load category data when editing
  useEffect(() => {
    if (!isEditMode) return

    const loadCategory = async () => {
      try {
        const response = await request({ url: `/categories/${id}` })
        const category = response?.category || response?.data || response

        setName(category.name || '')
        setDescription(category.description || '')
        setStatus(String(category.status ?? 1))
        setExistingImage(getImageUrl(category.imageUrl || category.image))
      } catch (requestError) {
        const message = requestError.response?.data?.message || 'Unable to load category.'
        setError(message)
        showToast(message, 'danger')
      } finally {
        setLoading(false)
      }
    }

    loadCategory()
  }, [id, isEditMode])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview('')
    // Optionally clear existing image as well if you want to delete it on update
    // setExistingImage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const categoryData = {
      name,
      description,
      status: Number(status),
    }

    try {
      let data = categoryData
      const headers = {}

      if (image) {
        data = new FormData()
        Object.entries(categoryData).forEach(([key, value]) => data.append(key, value))
        data.append('image', image)
        headers['Content-Type'] = 'multipart/form-data'
      }

      if (isEditMode) {
        await request({ method: 'put', url: `/categories/${id}`, data, headers })
      } else {
        await request({ method: 'post', url: '/categories', data, headers })
      }

      showToast(
        isEditMode ? 'Category updated successfully.' : 'Category created successfully.',
        'success',
      )
      setTimeout(() => navigate('/admin/categories'), 800)
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to save category.'
      setError(message)
      showToast(message, 'danger')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <CToaster placement="top-end" push={toast} />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{isEditMode ? 'Update Category' : 'Add Category'}</strong>
            </CCardHeader>

            <CCardBody>
              {loading && <CSpinner color="primary" />}
              {error && <CAlert color="danger">{error}</CAlert>}
              <CForm onSubmit={handleSubmit}>
                {/* Category Name */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Category Name</CFormLabel>
                    <CFormInput
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                {/* Description */}
                <CRow className="mb-3">
                  <CCol md={8}>
                    <CFormLabel>Description</CFormLabel>
                    <CFormTextarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter category description"
                    />
                  </CCol>
                </CRow>

                {/* Image Upload */}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Category Image</CFormLabel>
                    <CFormInput type="file" accept="image/*" onChange={handleImageChange} />

                    {/* Image Preview */}
                    {(imagePreview || existingImage) && (
                      <div className="mt-3">
                        <CImage
                          src={imagePreview || existingImage}
                          alt="Category preview"
                          width={180}
                          height={180}
                          className="border rounded"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="mt-2">
                          <CButton
                            color="danger"
                            size="sm"
                            variant="outline"
                            onClick={handleRemoveImage}
                          >
                            Remove Image
                          </CButton>
                        </div>
                      </div>
                    )}
                  </CCol>
                </CRow>

                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  <CButton color="primary" type="submit" disabled={loading || saving}>
                    {saving ? 'Saving...' : isEditMode ? 'Update Category' : 'Add Category'}
                  </CButton>

                  <CButton
                    color="secondary"
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CategoryDetails
