import React, { useEffect, useState } from 'react'
import { CAlert, CSpinner, CToast, CToastBody, CToaster } from '@coreui/react'
import ReusableTable from '../common/ReusableTable'
import ConfirmationModal from '../common/ConfirmationModal'
import ViewDetailsModal from '../common/ViewDetailsModal'
import { request } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [viewAdmin, setViewAdmin] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const response = await request({ url: '/admin' })
        const adminList = Array.isArray(response)
          ? response
          : response?.admins || response?.data || []

        setAdmins(
          adminList.map((admin, index) => ({
            id: admin.id || admin._id || index,
            srNo: index + 1,
            name: [admin.firstName, admin.lastName].filter(Boolean).join(' ') || '-',
            email: admin.email || '-',
            contactNo: admin.contactNo || '-',
            createdAt: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '-',
          })),
        )
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load admins.')
      } finally {
        setLoading(false)
      }
    }

    loadAdmins()
  }, [])

  const columns = [
    { header: 'Sr No.', accessor: 'srNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Contact No.', accessor: 'contactNo' },
    { header: 'Created At', accessor: 'createdAt' },
  ]

  const handleView = (row) => {
    setViewAdmin(row)
  }

  const handleEdit = (row) => {
    navigate(`/admin/control-panel/update-admin/${row.id}`)
  }

  const handleDelete = (row) => {
    setSelectedAdmin(row)
  }

  const confirmDelete = async () => {
    if (!selectedAdmin) return

    setDeletingId(selectedAdmin.id)
    setError('')

    try {
      await request({ method: 'delete', url: `/admin/delete/${selectedAdmin.id}` })
      setAdmins((currentAdmins) =>
        currentAdmins
          .filter((admin) => admin.id !== selectedAdmin.id)
          .map((admin, index) => ({ ...admin, srNo: index + 1 })),
      )
      setToast(
        <CToast autohide color="success" visible>
          <CToastBody className="text-white">Admin deleted successfully.</CToastBody>
        </CToast>,
      )
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to delete admin.'
      setError(message)
      setToast(
        <CToast autohide color="danger" visible>
          <CToastBody className="text-white">{message}</CToastBody>
        </CToast>,
      )
    } finally {
      setDeletingId(null)
      setSelectedAdmin(null)
    }
  }

  return (
    <>
      <CToaster placement="top-end" push={toast} />
      {loading && <CSpinner color="primary" />}
      {error && <CAlert color="danger">{error}</CAlert>}
      <ReusableTable
        columns={columns}
        data={admins}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={deletingId === null ? handleDelete : undefined}
      />
      <ConfirmationModal
        visible={selectedAdmin !== null}
        title="Delete Admin"
        message={`Are you sure you want to delete ${selectedAdmin?.name || 'this admin'}?`}
        confirmLabel="Delete"
        loading={deletingId !== null}
        onClose={() => setSelectedAdmin(null)}
        onConfirm={confirmDelete}
      />
      <ViewDetailsModal
        visible={viewAdmin !== null}
        title="Admin Details"
        fields={[
          { label: 'Name', value: viewAdmin?.name },
          { label: 'Email', value: viewAdmin?.email },
          { label: 'Contact Number', value: viewAdmin?.contactNo },
          { label: 'Created Date', value: viewAdmin?.createdAt },
        ]}
        onClose={() => setViewAdmin(null)}
      />
    </>
  )
}

export default Admin
