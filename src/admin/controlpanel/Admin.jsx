import React, { useEffect, useState } from 'react'
import { CAlert, CSpinner } from '@coreui/react'
import ReusableTable from '../common/ReusableTable'
import { request } from '../../services/api'

const Admin = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    console.log('View:', row)
  }

  const handleEdit = (row) => {
    console.log('Edit:', row)
  }

  const handleDelete = (row) => {
    console.log('Delete:', row)
  }

  return (
    <>
      {loading && <CSpinner color="primary" />}
      {error && <CAlert color="danger">{error}</CAlert>}
      <ReusableTable
        columns={columns}
        data={admins}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
}

export default Admin
