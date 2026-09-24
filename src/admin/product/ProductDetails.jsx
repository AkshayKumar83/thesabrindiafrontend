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
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import { request } from '../../services/api'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const [product, setProduct] = useState({
    name: '',
    description: '',
    categoryId: '',
    skuNo: '',
    inStock: 1,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode) return

    const loadProduct = async () => {
      try {
        const response = await request({ url: `/products/get/${id}` })
        const productData = response?.product || response?.data || response
        setProduct({
          name: productData.name || '',
          description: productData.description || '',
          categoryId: String(productData.categoryId || ''),
          skuNo: productData.skuNo || '',
          inStock: productData.inStock ?? 1,
        })
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load product.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, isEditMode])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await request({ url: '/categories/status/1' })
        const categoryList = Array.isArray(response)
          ? response
          : response?.categories || response?.data || []
        setCategories(categoryList)
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load categories.')
      }
    }

    loadCategories()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduct((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        name: product.name,
        description: product.description,
        categoryId: Number(product.categoryId),
        skuNo: product.skuNo,
        inStock: Number(product.inStock),
      }

      await request({
        method: isEditMode ? 'put' : 'post',
        url: isEditMode ? `/products/update/${id}` : '/products/add',
        data: payload,
      })

      navigate('/admin/products')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (isEditMode ? 'Unable to update product.' : 'Unable to add product.'),
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
            <strong>{isEditMode ? 'Update Product' : 'Add Product'}</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <CSpinner color="primary" />}
            {error && <CAlert color="danger">{error}</CAlert>}
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="product-name">Product Name</CFormLabel>
                  <CFormInput
                    id="product-name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="product-sku">SKU No</CFormLabel>
                  <CFormInput
                    id="product-sku"
                    name="skuNo"
                    value={product.skuNo}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="product-category">Category</CFormLabel>
                  <CFormSelect
                    id="product-category"
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id || category._id} value={category.id || category._id}>
                        {category.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="product-stock">In Stock</CFormLabel>
                  <CFormInput
                    id="product-stock"
                    name="inStock"
                    type="number"
                    min="0"
                    value={product.inStock}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="product-description">Description</CFormLabel>
                  <CFormInput
                    id="product-description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <div className="d-flex justify-content-end gap-5 mt-4">
                <CButton
                  type="button"
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </CButton>
                <CButton  className="sabr-maroon-btn" type="submit" disabled={loading || saving}>
                  {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
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
