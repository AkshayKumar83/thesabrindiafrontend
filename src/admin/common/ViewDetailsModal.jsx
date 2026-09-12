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
  imageAlt = 'Preview',
  fields = [],
  onClose,
}) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow className="g-3">
          {imageUrl && (
            <CCol xs={12} className="text-center">
              <CImage
                src={getImageUrl(imageUrl)}
                alt={imageAlt}
                width={180}
                height={180}
                className="border rounded"
                style={{ objectFit: 'cover' }}
              />
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
