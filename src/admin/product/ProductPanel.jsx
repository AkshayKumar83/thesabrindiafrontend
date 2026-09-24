import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCol,
  CToast,
  CToastBody,
  CToaster, 
  CCard, 
  CCardBody, 
  CBadge ,
  CCardHeader,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import ReusableTable from '../common/ReusableTable'
import ConfirmationModal from '../common/ConfirmationModal'
import ViewDetailsModal from '../common/ViewDetailsModal'
import { request } from '../../services/api'
import { useNavigate } from 'react-router-dom'


const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl
  return `http://localhost:8090${imageUrl}`
}



const ProductPanel = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewProduct, setViewProduct] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  const columns = [
    { header: 'Sr No.', accessor: 'srNo' },
    { header: 'Product Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Category', accessor: 'category' },
    { header: 'SKU No.', accessor: 'skuNo' },
    { header: 'In Stock', accessor: 'inStock' },
    {
      header: 'Variant',
      accessor: 'id',
      render: (_, row) => (
        <CButton
          color="info"
          className='sabr-maroon-btn'
          size="sm"
          onClick={() => navigate(`/admin/product-variants/${row.id}`)}
        >
          View Variants
        </CButton>
      ),
    },
  ]

  

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await request({ url: '/products/list' })
        const productList = Array.isArray(response)
          ? response
          : response?.products || response?.data || []

        setProducts(
          productList.map((product, index) => ({
            id: product.id || product._id || index,
            srNo: index + 1,
            name: product.name || '-',
            description: product.description || '-',
            category: product.category?.name || product.categoryId || '-',
            skuNo: product.skuNo || '-',
            inStock: product.inStock ?? 0,
          })),
        )
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleView = async (row) => {
    setViewLoading(true)
    setError('')

    try {
      const response = await request({ url: `/products/get/${row.id}` })
      setViewProduct(response?.product || response?.data || response)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load product details.')
    } finally {
      setViewLoading(false)
    }
  }

  const handleEdit = (row) => {
    navigate(`/admin/update-product/${row.id}`)
  }

  const handleDelete = (row) => {
    setSelectedProduct(row)
  }

  const confirmDelete = async () => {
    if (!selectedProduct) return

    setDeletingId(selectedProduct.id)
    setError('')

    try {
      await request({ method: 'delete', url: `/products/${selectedProduct.id}` })
      setProducts((currentProducts) =>
        currentProducts
          .filter((product) => product.id !== selectedProduct.id)
          .map((product, index) => ({ ...product, srNo: index + 1 })),
      )
      setToast(
        <CToast autohide color="success" visible>
          <CToastBody className="text-white">Product deleted successfully.</CToastBody>
        </CToast>,
      )
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to delete product.'
      setError(message)
      setToast(
        <CToast autohide color="danger" visible>
          <CToastBody className="text-white">{message}</CToastBody>
        </CToast>,
      )
    } finally {
      setDeletingId(null)
      setSelectedProduct(null)
    }
  }

  return (
    <>
      <CToaster placement="top-end" push={toast} />
      {loading && <CSpinner color="primary" />}
      {error && <CAlert color="danger">{error}</CAlert>}
      <ReusableTable
        columns={columns}
        data={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={deletingId === null ? handleDelete : undefined}
      />
      <ConfirmationModal
        visible={selectedProduct !== null}
        title="Delete Product"
        message={`Are you sure you want to delete ${selectedProduct?.name || 'this product'}?`}
        confirmLabel="Delete"
        loading={deletingId !== null}
        onClose={() => setSelectedProduct(null)}
        onConfirm={confirmDelete}
      />
      {/* <ViewDetailsModal
  visible={viewProduct !== null}
  title="Product Details"
  fields={[
    {
      label: 'Product Name',
      value: viewProduct?.name,
    },
    {
      label: 'Description',
      value: viewProduct?.description,
      fullWidth: true,
    },
    {
      label: 'Category',
      value: viewProduct?.category?.name || viewProduct?.categoryId,
    },
    {
      label: 'SKU No.',
      value: viewProduct?.skuNo,
    },
    {
      label: 'In Stock',
      value: viewProduct?.inStock,
    },
    {
      label: 'Created Date',
      value: viewProduct?.createdAt
        ? new Date(viewProduct.createdAt).toLocaleDateString()
        : '-',
    },
  ]}
  images={viewProduct?.variants?.flatMap((variant) =>
    (variant.images || []).map((image, index) => ({
      url: image.image_url || image.imageUrl || image.url,
      alt: `${variant.name || 'Variant'} image ${index + 1}`,
    })),
  )}
  onClose={() => setViewProduct(null)}
>
  {viewLoading ? (
    <CCol xs={12} className="text-center">
      <CSpinner color="primary" />
    </CCol>
  ) : (
    viewProduct?.variants?.map((variant) => (
      <CCol key={variant.id || variant.name} xs={12}>
        <strong>Variant</strong>

        <div>
          {variant.name || '-'} | Color: {variant.color || '-'} | Price:{' '}
          {variant.price ?? '-'} | Stock: {variant.inStock ?? '-'} | Primary:{' '}
          {Number(variant.isPrimary) === 1 ? 'Yes' : 'No'}
        </div>
      </CCol>
    ))
  )}
</ViewDetailsModal> */}

{/* <ViewDetailsModal 
size="xl"
  visible={viewProduct !== null}
  title="Product Details"
  fields={[
    { label: 'Product Name', value: viewProduct?.name },
    { label: 'Description', value: viewProduct?.description, fullWidth: true },
    { label: 'Category', value: viewProduct?.category?.name || viewProduct?.categoryId },
    { label: 'SKU No.', value: viewProduct?.skuNo },
    { label: 'In Stock', value: viewProduct?.inStock },
    {
      label: 'Created Date',
      value: viewProduct?.createdAt
        ? new Date(viewProduct.createdAt).toLocaleDateString()
        : '-',
    },
  ]}

  onClose={() => setViewProduct(null)}
>
  {viewLoading ? (
    <CCol xs={12} className="text-center py-4">
      <CSpinner color="primary" />
    </CCol>
  ) : (
    <CCol xs={12}>
      <hr className="my-2" />
      <h6 className="fw-semibold mb-3 text-body-secondary text-uppercase small">
        Variants ({viewProduct?.variants?.length || 0})
      </h6>

      <div className="d-flex flex-column gap-3">
        {viewProduct?.variants?.map((variant) => {
          const isPrimary = Number(variant.isPrimary) === 1;
          const images = variant.images || [];

          return (
            <CCard
              key={variant.id || variant.name}
              className={`shadow-sm ${isPrimary ? 'border-primary' : 'border-light-subtle'}`}
              style={{ borderWidth: isPrimary ? 2 : 1 }}
            >
              <CCardBody>
             
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle border d-inline-block"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: (variant.color || '#ccc').toLowerCase(),
                      }}
                      title={variant.color}
                    />
                    <strong className="fs-6">{variant.name || 'Unnamed Variant'}</strong>
                    {isPrimary && (
                      <CBadge color="primary" shape="rounded-pill">
                        Primary Variant
                      </CBadge>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-3 small">
                    <span className="fw-semibold">₹{variant.price ?? '-'}</span>
                    <span className="text-body-secondary">
                      Stock:{' '}
                      <CBadge color={variant.inStock > 0 ? 'success' : 'danger'} shape="rounded-pill">
                        {variant.inStock ?? '-'}
                      </CBadge>
                    </span>
                  </div>
                </div>

         
                {images.length > 0 ? (
                  <div className="d-flex flex-wrap gap-3">
                    {images.map((image, index) => {
                      const url = image.image_url || image.imageUrl || image.url;
                      const imgIsPrimary =
                        Number(image.isPrimary) === 1 || (isPrimary && index === 0);

                      return (
                        <div
                          key={index}
                          className="position-relative"
                          style={{ width: 96, height: 96 }}
                        >
                          <img
                            src={getImageUrl(url)}
                            alt={`${variant.name || 'Variant'} image ${index + 1}`}
                            className="w-100 h-100 rounded"
                            style={{
                              objectFit: 'cover',
                              border: imgIsPrimary ? '2px solid #321fdb' : '1px solid #dee2e6',
                            }}
                          />
                          {imgIsPrimary && (
                            <CBadge
                              color="primary"
                              className="position-absolute top-0 start-0 m-1"
                              style={{ fontSize: 10 }}
                            >
                              Primary
                            </CBadge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-body-secondary small fst-italic">No images</div>
                )}
              </CCardBody>
            </CCard>
          );
        })}
      </div>
    </CCol>
  )}
</ViewDetailsModal> */}

<CModal
  visible={viewProduct !== null}
  onClose={() => setViewProduct(null)}
  size="xl"
  scrollable
>
  <CModalHeader>
    <CModalTitle>Product Details
        <CBadge
           color="success"
           className="text-center mx-2 px-2"
           
         >
           {viewProduct?.category?.name ||
                viewProduct?.categoryId ||
                '-'}
         </CBadge>
    </CModalTitle>
  </CModalHeader>

  <CModalBody>
    {viewLoading ? (
      <CRow>
        <CCol xs={12} className="text-center py-5">
          <CSpinner color="primary" />
        </CCol>
      </CRow>
    ) : (
      <>
        {/* ================= PRODUCT DETAILS ================= */}
        <CRow className="g-4 mb-4">

          {/* Product Name */}
          <CCol xs={12} md={4}>
            <div className="text-body-secondary small mb-1">
              Product Name
            </div>

            <div className="fw-semibold">
              {viewProduct?.name || '-'}
            </div>
          </CCol>

          {/* Category */}
          <CCol xs={12} md={8}>
 
            <div className="text-body-secondary small mb-1">
              Description
            </div>

            <div>
              {viewProduct?.description || '-'}
            </div>
        
          </CCol>

          {/* SKU */}
          <CCol xs={12} md={4}>
            <div className="text-body-secondary small mb-1">
              SKU No.
            </div>

            <div className="fw-semibold">
              {viewProduct?.skuNo || '-'}
            </div>
          </CCol>

          {/* Stock */}
          <CCol xs={12} md={4}>
            <div className="text-body-secondary small mb-1">
              In Stock
            </div>

            <CBadge
              color={
                Number(viewProduct?.inStock) > 0
                  ? 'success'
                  : 'danger'
              }
              shape="rounded-pill"
            >
              {viewProduct?.inStock ?? 0}
            </CBadge>
          </CCol>

          {/* Created Date */}
          <CCol xs={12} md={4}>
            <div className="text-body-secondary small mb-1">
              Created Date
            </div>

            <div className="fw-semibold">
              {viewProduct?.createdAt
                ? new Date(
                    viewProduct.createdAt,
                  ).toLocaleDateString()
                : '-'}
            </div>
          </CCol>

         
        </CRow>

        {/* ================= VARIANTS ================= */}
        <CRow>
          <CCol xs={12}>

            <CCard className="border-0">

              <CCardHeader className="bg-transparent px-0">
                <strong className="text-body-secondary text-uppercase">
                  Variants
                </strong>

                <CBadge
                  color="secondary"
                  shape="rounded-pill"
                  className="ms-2"
                >
                  {viewProduct?.variants?.length || 0}
                </CBadge>
              </CCardHeader>

              <CCardBody className="px-0">

                <CRow className="g-3">

                  {viewProduct?.variants?.map((variant) => {
                    const isPrimary =
                      Number(variant.isPrimary) === 1

                    const images = variant.images || []

                    return (
                      <CCol
                        xs={12}
                        key={variant.id || variant.name}
                      >
                        <CCard
                          className={
                            isPrimary
                              ? 'border-primary shadow-sm'
                              : 'shadow-sm'
                          }
                          style={{
                            borderWidth: isPrimary ? 2 : 1,
                          }}
                        >

                          {/* Variant Header */}
                          <CCardHeader>
                            <CRow className="align-items-center">

                              {/* Variant name */}
                              <CCol xs={12} md={7}>
                                <div className="d-flex align-items-center gap-2">

                                  <span
                                    className="rounded-circle border"
                                    style={{
                                      width: 16,
                                      height: 16,
                                      minWidth: 16,
                                      backgroundColor:
                                        (
                                          variant.color ||
                                          '#ccc'
                                        ).toLowerCase(),
                                    }}
                                    title={variant.color}
                                  />

                                  <strong>
                                    {variant.name ||
                                      'Unnamed Variant'}
                                  </strong>

                                  {isPrimary && (
                                    <CBadge
                                      color="success"
                                      shape="rounded-pill"
                                    >
                                      Primary Variant
                                    </CBadge>
                                  )}

                                </div>
                              </CCol>

                              {/* Price + Stock */}
                              <CCol
                                xs={12}
                                md={5}
                                className="text-md-end mt-2 mt-md-0"
                              >
                                <strong className="me-3">
                                  ₹{variant.price ?? '-'}
                                </strong>

                                <span className="text-body-secondary">
                                  Stock:{' '}
                                </span>

                                <CBadge
                                  color={
                                    Number(
                                      variant.inStock,
                                    ) > 0
                                      ? 'success'
                                      : 'danger'
                                  }
                                  shape="rounded-pill"
                                >
                                  {variant.inStock ?? 0}
                                </CBadge>
                              </CCol>

                            </CRow>
                          </CCardHeader>

                          {/* Variant Body */}
                          <CCardBody>

                            {images.length > 0 ? (
                              <CRow className="g-3">

                                {images.map(
                                  (image, index) => {
                                    const url =
                                      image.image_url ||
                                      image.imageUrl ||
                                      image.url

                                    const imgIsPrimary =
                                      Number(
                                        image.isPrimary,
                                      ) === 1 ||
                                      (isPrimary &&
                                        index === 0)

                                    return (
                                      <CCol
                                        xs={6}
                                        sm={4}
                                        md={3}
                                        lg={2}
                                        key={index}
                                      >
                                        <div className="position-relative">

                                          <CImage
                                            src={getImageUrl(url)}
                                            alt={`${variant.name || 'Variant'} image ${index + 1}`}
                                            fluid
                                            rounded
                                            style={{
                                              width: '100%',
                                              height: 160,
                                              objectFit: 'cover',
                                              border: imgIsPrimary
                                                ? '2px solid var(--cui-primary)'
                                                : '1px solid var(--cui-border-color)',
                                            }}
                                          />

                                          {imgIsPrimary && (
                                            <CBadge
                                              color="success"
                                              className="position-absolute top-0 start-0 m-1"
                                            >
                                              Primary
                                            </CBadge>
                                          )}

                                        </div>
                                      </CCol>
                                    )
                                  },
                                )}

                              </CRow>
                            ) : (
                              <span className="text-body-secondary small fst-italic">
                                No images available
                              </span>
                            )}

                          </CCardBody>

                        </CCard>
                      </CCol>
                    )
                  })}

                </CRow>

              </CCardBody>
            </CCard>

          </CCol>
        </CRow>
      </>
    )}
  </CModalBody>
</CModal>

    </>
  )
}

export default ProductPanel
