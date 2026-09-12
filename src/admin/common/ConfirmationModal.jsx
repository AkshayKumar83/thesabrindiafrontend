import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const ConfirmationModal = ({
  visible,
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <CModal visible={visible} onClose={loading ? undefined : onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </CButton>
        <CButton color="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : confirmLabel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmationModal
