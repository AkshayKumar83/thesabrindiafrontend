import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CFormCheck,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  // ========== Product Details State ==========
  const [product, setProduct] = useState({
    product_id: '',
    name: '',
    description: '',
    categoryId: '',
    skuNo: '',
    inStock: 1,
  })

  // ========== Variants State ==========
  const [variants, setVariants] = useState([
    {
      variant_id: '',
      variant_name: '',
      color: '',
      price: '',
      inStock: 1,
      description: '',
      isPrimary: 0,
      images: [{ image_url: '', isPrimary: true }],
    },
  ])

  // Load product data when editing
  useEffect(() => {
    if (isEditMode) {
      // TODO: Replace with actual API call
      // Example:
      // fetch(`/api/products/${id}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     setProduct(data.product)
      //     setVariants(data.variants)
      //   })

      console.log('Edit mode - Product ID:', id)
    }
  }, [id, isEditMode])

  // ========== Handlers ==========
  const handleProductChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target
    const updated = [...variants]
    updated[index][name] = value
    setVariants(updated)
  }

  const handleImageChange = (variantIndex, imageIndex, e) => {
    const { name, value, type, checked } = e.target
    const updated = [...variants]
    updated[variantIndex].images[imageIndex][name] =
      type === 'checkbox' ? checked : value
    setVariants(updated)
  }

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        variant_id: '',
        variant_name: '',
        color: '',
        price: '',
        inStock: 1,
        description: '',
        isPrimary: 0,
        images: [{ image_url: '', isPrimary: true }],
      },
    ])
  }

  const removeVariant = (index) => {
    if (variants.length === 1) return
    setVariants(variants.filter((_, i) => i !== index))
  }

  const addImage = (variantIndex) => {
    const updated = [...variants]
    updated[variantIndex].images.push({ image_url: '', isPrimary: false })
    setVariants(updated)
  }

  const removeImage = (variantIndex, imageIndex) => {
    const updated = [...variants]
    if (updated[variantIndex].images.length === 1) return
    updated[variantIndex].images = updated[variantIndex].images.filter(
      (_, i) => i !== imageIndex
    )
    setVariants(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      ...product,
      variants,
    }

    if (isEditMode) {
      console.log('Updating product:', payload)
      // TODO: API call for update
      // await axios.put(`/api/products/${id}`, payload)
    } else {
      console.log('Creating product:', payload)
      // TODO: API call for create
      // await axios.post('/api/products', payload)
    }

    // navigate('/admin/products') // redirect after success
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{isEditMode ? 'Update Product' : 'Add Product'}</strong>
          </CCardHeader>

          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* ===================== PRODUCT DETAILS ===================== */}
              <h5 className="mb-3">Product Details</h5>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Product Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleProductChange}
                    placeholder="Enter product name"
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>SKU No</CFormLabel>
                  <CFormInput
                    type="text"
                    name="skuNo"
                    value={product.skuNo}
                    onChange={handleProductChange}
                    placeholder="Enter SKU number"
                    required
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel>Category ID</CFormLabel>
                  <CFormInput
                    type="number"
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleProductChange}
                    placeholder="Enter category ID"
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>In Stock</CFormLabel>
                  <CFormSelect
                    name="inStock"
                    value={product.inStock}
                    onChange={handleProductChange}
                  >
                    <option value={1}>Yes (1)</option>
                    <option value={0}>No (0)</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={12}>
                  <CFormLabel>Description</CFormLabel>
                  <CFormTextarea
                    name="description"
                    value={product.description}
                    onChange={handleProductChange}
                    rows={3}
                    placeholder="Enter product description"
                  />
                </CCol>
              </CRow>

              {/* ===================== PRODUCT VARIANTS ===================== */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Product Variants</h5>
                <CButton color="success" size="sm" type="button" onClick={addVariant}>
                  + Add Variant
                </CButton>
              </div>

              {variants.map((variant, vIndex) => (
                <CCard key={vIndex} className="mb-4 border">
                  <CCardHeader className="d-flex justify-content-between align-items-center">
                    <strong>Variant #{vIndex + 1}</strong>
                    {variants.length > 1 && (
                      <CButton
                        color="danger"
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => removeVariant(vIndex)}
                      >
                        <FontAwesomeIcon icon={['fas', 'trash']} /> Remove
                      </CButton>
                    )}
                  </CCardHeader>

                  <CCardBody>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel>Variant Name</CFormLabel>
                        <CFormInput
                          type="text"
                          name="variant_name"
                          value={variant.variant_name}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                          placeholder="e.g. Red / Large"
                          required
                        />
                      </CCol>

                      <CCol md={6}>
                        <CFormLabel>Color</CFormLabel>
                        <CFormInput
                          type="text"
                          name="color"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                          placeholder="e.g. Red"
                        />
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={4}>
                        <CFormLabel>Price</CFormLabel>
                        <CFormInput
                          type="number"
                          name="price"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel>In Stock</CFormLabel>
                        <CFormSelect
                          name="inStock"
                          value={variant.inStock}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                        >
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </CFormSelect>
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel>Is Primary</CFormLabel>
                        <CFormSelect
                          name="isPrimary"
                          value={variant.isPrimary}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                        >
                          <option value={0}>No</option>
                          <option value={1}>Yes</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel>Variant Description</CFormLabel>
                        <CFormTextarea
                          name="description"
                          value={variant.description}
                          onChange={(e) => handleVariantChange(vIndex, e)}
                          rows={2}
                          placeholder="Variant description"
                        />
                      </CCol>
                    </CRow>

                    {/* ========== Images ========== */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <CFormLabel className="mb-0">Images</CFormLabel>
                      <CButton
                        color="info"
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => addImage(vIndex)}
                      >
                        + Add Image
                      </CButton>
                    </div>

                    {variant.images.map((img, imgIndex) => (
                      <CRow key={imgIndex} className="mb-2 align-items-center">
                        <CCol md={8}>
                          <CFormInput
                            type="text"
                            name="image_url"
                            value={img.image_url}
                            onChange={(e) => handleImageChange(vIndex, imgIndex, e)}
                            placeholder="Image URL"
                          />
                        </CCol>

                        <CCol md={2}>
                          <CFormCheck
                            type="checkbox"
                            name="isPrimary"
                            label="Primary"
                            checked={img.isPrimary}
                            onChange={(e) => handleImageChange(vIndex, imgIndex, e)}
                          />
                        </CCol>

                        <CCol md={2}>
                          {variant.images.length > 1 && (
                            <CButton
                              color="danger"
                              size="sm"
                              variant="ghost"
                              type="button"
                              onClick={() => removeImage(vIndex, imgIndex)}
                            >
                              <FontAwesomeIcon icon={['fas', 'trash']} />
                            </CButton>
                          )}
                        </CCol>
                      </CRow>
                    ))}
                  </CCardBody>
                </CCard>
              ))}

              {/* ===================== ACTIONS ===================== */}
              <div className="d-flex gap-2 mt-4">
                <CButton color="primary" type="submit">
                  {isEditMode ? 'Update Product' : 'Add Product'}
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

export default ProductDetails