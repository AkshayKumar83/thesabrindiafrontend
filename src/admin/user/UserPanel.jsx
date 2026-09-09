import React, { useEffect, useState } from 'react'
import { CAlert, CSpinner } from '@coreui/react'
import ReusableTable from '../common/ReusableTable'
import { request } from '../../services/api'

const UserPanel = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await request({ url: '/users' })
        const userList = Array.isArray(response)
          ? response
          : response?.users || response?.data || []

        setUsers(
          userList.map((user, index) => ({
            id: user.id || user._id || index,
            srNo: index + 1,
            name: [user.firstName, user.lastName].filter(Boolean).join(' ') || '-',
            email: user.email || '-',
            contactNo: user.contactNo || '-',
            createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-',
          })),
        )
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load users.')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
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
        data={users}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
}

export default UserPanel
