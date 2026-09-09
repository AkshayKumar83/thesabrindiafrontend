import React from 'react'
import ReusableTable from '../common/ReusableTable'

const UserPanel = () => {
  const columns = [
    { header: 'Sr No.', accessor: 'srNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Username', accessor: 'username' },
    { header: 'Role', accessor: 'role' },
  ]

  const data = [
    { id: 1, srNo: 1, name: 'Mark', username: '@mdo', role: 'Admin' },
    { id: 2, srNo: 2, name: 'Jacob', username: '@fat', role: 'Editor' },
    { id: 3, srNo: 3, name: 'Larry the Bird', username: '@twitter', role: 'User' },
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
    <ReusableTable
      columns={columns}
      data={data}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}

export default UserPanel