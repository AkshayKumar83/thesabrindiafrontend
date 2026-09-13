import React from 'react'
import {
  CButton,
  CCol,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'

const getImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl
  return `http://localhost:8090${imageUrl}`
}

const ViewDetailsModal = ({
  visible,
  title = 'Details',
  imageUrl,
  images = [],
  imageAlt = 'Preview',
  fields = [],
  children,
  onClose,
  size="md",
}) => {
  const previewImages = images.length ? images : imageUrl ? [{ url: imageUrl, alt: imageAlt }] : []

  return (
    <CModal visible={visible} onClose={onClose} size={size} >
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="g-3">
          {previewImages.length > 0 && (
            <CCol xs={12} className="d-flex flex-wrap justify-content-center gap-2">
              {previewImages.map((image, index) => (
                <CImage
                  key={`${image.url}-${index}`}
                  src={getImageUrl(image.url)}
                  alt={image.alt || imageAlt}
                  width={120}
                  height={120}
                  className="border rounded"
                  style={{ objectFit: 'cover' }}
                />
              ))}
            </CCol>
          )}
          {fields.map((field) => (
            <CCol
              key={field.label}
              xs={field.fullWidth ? 12 : undefined}
              md={field.fullWidth ? 12 : 6}
            >
              <strong>{field.label}</strong>
              <div>{field.value || '-'}</div>
            </CCol>
          ))}
          {children}
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ViewDetailsModal
