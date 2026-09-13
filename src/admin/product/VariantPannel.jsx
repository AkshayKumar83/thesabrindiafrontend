import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CSpinner,
  CToast,
  CToastBody,
  CToaster,
} from '@coreui/react'
import ReusableTable from '../common/ReusableTable'
import ConfirmationModal from '../common/ConfirmationModal'
import { request } from '../../services/api'
import { useNavigate, useParams } from 'react-router-dom'

const VariantPannel = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const columns = [
    { header: 'Sr No.', accessor: 'srNo' },
    { header: 'Variant Name', accessor: 'name' },
    { header: 'Color', accessor: 'color' },
    { header: 'Primary', accessor: 'imageUrl', type: 'image' },
    { header: 'Price', accessor: 'price' },
    { header: 'In Stock', accessor: 'inStock' },
    { header: 'Description', accessor: 'description' },
    { header: 'Primary', accessor: 'isPrimary' },
  ]

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const response = await request({
          url: productId ? `/products/${productId}/variants` : '/products/variants',
        })
        const variantList = Array.isArray(response)
          ? response
          : response?.variants || response?.data || []

        setVariants(
          variantList.map((variant, index) => ({
            id: variant.id || index,
            productId: variant.productId || productId || '',
            srNo: index + 1,
            name: variant.name || '-',
            color: variant.color || '-',
            imageUrl:
              variant.images?.find((image) => Number(image.isPrimary) === 1)?.image_url ||
              variant.images?.find((image) => image.image_url)?.image_url ||
              '',
            price: variant.price ?? '-',
            inStock: variant.inStock ?? 0,
            description: variant.description || '-',
            isPrimary: Number(variant.isPrimary) === 1 ? 'Yes' : 'No',
          })),
        )
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load variants.')
      } finally {
        setLoading(false)
      }
    }

    loadVariants()
  }, [productId])

  const handleDelete = (row) => {
    setSelectedVariant(row)
  }

  const confirmDelete = async () => {
    if (!selectedVariant) return

    setDeletingId(selectedVariant.id)
    setError('')

    try {
      await request({
        method: 'delete',
        url: `/products/variants/${selectedVariant.id}`,
      })
      setVariants((currentVariants) =>
        currentVariants
          .filter((variant) => variant.id !== selectedVariant.id)
          .map((variant, index) => ({ ...variant, srNo: index + 1 })),
      )
      setToast(
        <CToast autohide color="success" visible>
          <CToastBody className="text-white">Variant deleted successfully.</CToastBody>
        </CToast>,
      )
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to delete variant.'
      setError(message)
      setToast(
        <CToast autohide color="danger" visible>
          <CToastBody className="text-white">{message}</CToastBody>
        </CToast>,
      )
    } finally {
      setDeletingId(null)
      setSelectedVariant(null)
    }
  }

  return (
    <CCol xs={12}>
      <CToaster placement="top-end" push={toast} />
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>{productId ? `Variants for Product ${productId}` : 'All Variants'}</strong>
          <CButton
            color="primary"
            onClick={() => productId && navigate(`/admin/product-variants/${productId}/add`)}
            disabled={!productId}
          >
            Add Variant
          </CButton>
        </CCardHeader>
        <CCardBody>
          {loading && <CSpinner color="primary" />}
          {error && <CAlert color="danger">{error}</CAlert>}
          <ReusableTable
            columns={columns}
            data={variants}
            onView={(row) => console.log('View:', row)}
            onEdit={(row) =>
              row.productId && navigate(`/admin/product-variants/${row.productId}/edit/${row.id}`)
            }
            onDelete={deletingId === null ? handleDelete : undefined}
          />
        </CCardBody>
      </CCard>
      <ConfirmationModal
        visible={selectedVariant !== null}
        title="Delete Variant"
        message={`Are you sure you want to delete ${selectedVariant?.name || 'this variant'}?`}
        confirmLabel="Delete"
        loading={deletingId !== null}
        onClose={() => setSelectedVariant(null)}
        onConfirm={confirmDelete}
      />
    </CCol>
  )
}

export default VariantPannel
