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
  CButton,
  CImage,
} from '@coreui/react'

const CategoryDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)          // File object
  const [imagePreview, setImagePreview] = useState('') // URL for preview
  const [existingImage, setExistingImage] = useState('') // image URL from backend (edit mode)

  // Load category data when editing
  useEffect(() => {
    if (isEditMode) {
      // TODO: Replace with actual API call
      // fetch(`/api/categories/${id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     setName(data.name || '')
      //     setDescription(data.description || '')
      //     setExistingImage(data.image || '')
      //     setImagePreview(data.image || '')
      //   })

      console.log('Edit mode - Category ID:', id)
    }
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

    // Use FormData because of the image file
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)

    if (image) {
      formData.append('image', image)
    }

    // If you want to explicitly remove the image on update, you can send a flag
    // if (isEditMode && !image && !imagePreview) {
    //   formData.append('removeImage', true)
    // }

    try {
      if (isEditMode) {
        console.log('Updating category...')
        // await axios.put(`/api/categories/${id}`, formData, {
        //   headers: { 'Content-Type': 'multipart/form-data' },
        // })
      } else {
        console.log('Creating category...')
        // await axios.post('/api/categories', formData, {
        //   headers: { 'Content-Type': 'multipart/form-data' },
        // })
      }

      // navigate('/admin/categories')
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{isEditMode ? 'Update Category' : 'Add Category'}</strong>
          </CCardHeader>

          <CCardBody>
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
                  <CFormInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

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
                <CButton color="primary" type="submit">
                  {isEditMode ? 'Update Category' : 'Add Category'}
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
  )
}

export default CategoryDetails