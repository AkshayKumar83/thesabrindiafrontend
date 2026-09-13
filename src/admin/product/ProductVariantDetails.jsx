import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { request } from '../../services/api'

const getImageUrl = (imageUrl) => {
  if (
    !imageUrl ||
    imageUrl.startsWith('http') ||
    imageUrl.startsWith('blob:') ||
    imageUrl.startsWith('data:')
  ) {
    return imageUrl || ''
  }
  return `http://localhost:8090${imageUrl}`
}

const ProductVariantDetails = () => {
  const { productId, variantId } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(variantId)
  const [variant, setVariant] = useState({
    name: '',
    color: '',
    price: '',
    inStock: 1,
    description: '',
    isPrimary: 0,
    images: [],
  })
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode) return
    const loadVariant = async () => {
      try {
        const response = await request({ url: `/products/${productId}/variants/${variantId}` })
        const data = response?.variant || response?.data || response
        setVariant({
          name: data.name || '',
          color: data.color || '',
          price: data.price ?? '',
          inStock: data.inStock ?? 1,
          description: data.description || '',
          isPrimary: Number(data.isPrimary) || 0,
          images: (data.images || []).map((image) => ({
            image_url: image.image_url || image.imageUrl || image.url || '',
            imageFile: null,
            isPrimary: Number(image.isPrimary) || 0,
          })),
        })
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load variant.')
      } finally {
        setLoading(false)
      }
    }
    loadVariant()
  }, [productId, variantId, isEditMode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setVariant((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setVariant((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index
          ? { ...image, imageFile: file, image_url: URL.createObjectURL(file) }
          : image,
      ),
    }))
  }

  const setPrimaryImage = (index) => {
    setVariant((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => ({
        ...image,
        isPrimary: imageIndex === index ? 1 : 0,
      })),
    }))
  }

  const addImage = () => {
    setVariant((current) => ({
      ...current,
      images: [...current.images, { image_url: '', imageFile: null, isPrimary: 0 }],
    }))
  }

  const removeImage = (index) => {
    setVariant((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const getUploadedImageUrls = (response) => {
    const images = Array.isArray(response)
      ? response
      : response?.images || response?.imageUrls || response?.data || []
    return images
      .map((image) =>
        typeof image === 'string' ? image : image.image_url || image.imageUrl || image.url,
      )
      .filter(Boolean)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const files = variant.images.filter((image) => image.imageFile)
      let uploadedUrls = []
      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((image) => formData.append('images', image.imageFile))
        uploadedUrls = getUploadedImageUrls(
          await request({ method: 'post', url: '/products/images', data: formData }),
        )
        if (uploadedUrls.length !== files.length) {
          throw new Error('Image upload response did not include all uploaded images.')
        }
      }

      let uploadedIndex = 0
      const payload = {
        ...(isEditMode ? {} : { productId: Number(productId) }),
        name: variant.name,
        color: variant.color,
        price: Number(variant.price),
        inStock: Number(variant.inStock),
        description: variant.description,
        isPrimary: Number(variant.isPrimary),
        images: variant.images.map((image) => ({
          image_url: image.imageFile ? uploadedUrls[uploadedIndex++] : image.image_url,
          isPrimary: Number(image.isPrimary),
        })),
      }

      await request({
        method: isEditMode ? 'put' : 'post',
        url: isEditMode
          ? `/products/${productId}/variants/${variantId}`
          : `/products/${productId}/variants`,
        data: payload,
      })
      navigate(`/admin/product-variants/${productId}`)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          (isEditMode ? 'Unable to update variant.' : 'Unable to add variant.'),
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{isEditMode ? 'Update Variant' : 'Add Variant'}</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <CSpinner color="primary" />}
            {error && <CAlert color="danger">{error}</CAlert>}
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel>Variant Name</CFormLabel>
                  <CFormInput name="name" value={variant.name} onChange={handleChange} required />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Color</CFormLabel>
                  <CFormInput name="color" value={variant.color} onChange={handleChange} />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Price</CFormLabel>
                  <CFormInput
                    name="price"
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>In Stock</CFormLabel>
                  <CFormInput
                    name="inStock"
                    type="number"
                    min="0"
                    value={variant.inStock}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={4}>
                  <CFormLabel>Primary Variant</CFormLabel>
                  <CFormInput
                    name="isPrimary"
                    type="number"
                    min="0"
                    max="1"
                    value={variant.isPrimary}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel>Description</CFormLabel>
                  <CFormInput
                    name="description"
                    value={variant.description}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol xs={12}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <CFormLabel className="mb-0">Images</CFormLabel>
                    <CButton
                      type="button"
                      color="info"
                      variant="outline"
                      size="sm"
                      onClick={addImage}
                    >
                      Add Image
                    </CButton>
                  </div>
                  {variant.images.map((image, index) => (
                    <CRow key={index} className="g-2 align-items-center mb-2">
                      <CCol md={7}>
                        <CFormInput
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleImageChange(index, event)}
                        />
                        {image.image_url && (
                          <img
                            src={getImageUrl(image.image_url)}
                            alt={`Variant image ${index + 1}`}
                            width="64"
                            height="64"
                            className="border rounded mt-2"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </CCol>
                      <CCol md={3}>
                        <CFormCheck
                          label="Primary"
                          type="checkbox"
                          checked={image.isPrimary === 1}
                          onChange={() => setPrimaryImage(index)}
                        />
                      </CCol>
                      <CCol md={2}>
                        {variant.images.length > 1 && (
                          <CButton
                            type="button"
                            color="danger"
                            variant="ghost"
                            onClick={() => removeImage(index)}
                          >
                            <FontAwesomeIcon icon={['fas', 'trash']} />
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  ))}
                </CCol>
              </CRow>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={loading || saving}>
                  {saving ? 'Saving...' : isEditMode ? 'Update Variant' : 'Add Variant'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductVariantDetails
