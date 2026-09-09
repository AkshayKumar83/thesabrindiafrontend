import React from 'react';
import ReusableTable from '../common/ReusableTable'
import { useNavigate } from 'react-router-dom';

const CategoryPanel = () => {
 
  const navigate = useNavigate()

  const columns = [
  { header: 'Sr No.', accessor: 'srNo' },
  { header: 'Category Name', accessor: 'categoryName' },
  { header: 'Desccription', accessor: 'description' },
  { header: 'Date', accessor: 'date' },
]

const data = [
  { id: 1, srNo: 1, categoryName: 'Jacob Thornton', description: 'Jacob Thornton',  date: '2026-09-01', },
  { id: 2, srNo: 2, categoryName: 'Jacob Thornton',  description: 'Jacob Thornton',date: '2026-09-03', },
  { id: 3, srNo: 3, categoryName: 'Larry Bird', description: 'Jacob Thornton', date: '2026-09-05', },
  { id: 4, srNo: 4, categoryName: 'Sarah Wilson', description: 'Jacob Thornton', date: '2026-09-06',  },
  { id: 5, srNo: 5, categoryName: 'John Doe', description: 'Jacob Thornton', date: '2026-09-08', },
]

  const handleView = (row) => {
    console.log('View:', row)
  }

  const handleEdit = (row) => {
    console.log('Edit:', row)
     console.log('Edit:', row)
        navigate(`/admin/update-category/${row.id}`)
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

export default CategoryPanel