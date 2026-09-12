import React, { useEffect, useState } from 'react'
import { CAlert, CSpinner, CToast, CToastBody, CToaster } from '@coreui/react'
import ReusableTable from '../common/ReusableTable'
import ConfirmationModal from '../common/ConfirmationModal'
import ViewDetailsModal from '../common/ViewDetailsModal'
import { request } from '../../services/api'
import { useNavigate } from 'react-router-dom'

const CategoryPanel = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const navigate = useNavigate()

  const columns = [
    { header: 'Sr No.', accessor: 'srNo' },
    { header: 'Image', accessor: 'imageUrl', type: 'image' },
    { header: 'Category Name', accessor: 'categoryName' },
    { header: 'Description', accessor: 'description' },
    { header: 'Status', accessor: 'status' },
    { header: 'Date', accessor: 'date' },
  ]

  const showToast = (message, color) => {
    setToast(
      <CToast autohide color={color} visible>
        <CToastBody className="text-white">{message}</CToastBody>
      </CToast>,
    )
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await request({ url: '/categories' })
        const categoryList = Array.isArray(response)
          ? response
          : response?.categories || response?.data || []

        setCategories(
          categoryList.map((category, index) => ({
            id: category.id || category._id || index,
            srNo: index + 1,
            imageUrl: category.imageUrl || category.image || '',
            categoryName: category.name || '-',
            description: category.description || '-',
            status: Number(category.status) === 1 ? 'Active' : 'Inactive',
            date: category.createdAt ? new Date(category.createdAt).toLocaleDateString() : '-',
          })),
        )
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load categories.')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleView = (row) => {
    setSelectedCategory(row)
  }

  const handleEdit = (row) => {
    console.log('Edit:', row)
    navigate(`/admin/update-category/${row.id}`)
  }

  const handleDelete = async (row) => {
    setDeletingId(row.id)
    setError('')

    try {
      await request({ method: 'delete', url: `/categories/${row.id}` })
      setCategories((currentCategories) =>
        currentCategories
          .filter((category) => category.id !== row.id)
          .map((category, index) => ({ ...category, srNo: index + 1 })),
      )
      showToast('Category deleted successfully.', 'success')
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to delete category.'
      setError(message)
      showToast(message, 'danger')
    } finally {
      setDeletingId(null)
      setDeleteVisible(false)
      setSelectedCategory(null)
    }
  }

  const openDeleteModal = (row) => {
    setSelectedCategory(row)
    setDeleteVisible(true)
  }

  return (
    <>
      <CToaster placement="top-end" push={toast} />
      {loading && <CSpinner color="primary" />}
      {error && <CAlert color="danger">{error}</CAlert>}
      <ReusableTable
        columns={columns}
        data={categories}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={deletingId === null ? openDeleteModal : undefined}
      />

      <ViewDetailsModal
        visible={selectedCategory !== null && !deleteVisible}
        title="Category Details"
        imageUrl={selectedCategory?.imageUrl}
        imageAlt={`${selectedCategory?.categoryName || 'Category'} preview`}
        fields={[
          { label: 'Category Name', value: selectedCategory?.categoryName },
          { label: 'Status', value: selectedCategory?.status },
          { label: 'Description', value: selectedCategory?.description, fullWidth: true },
          { label: 'Created Date', value: selectedCategory?.date, fullWidth: true },
        ]}
        onClose={() => setSelectedCategory(null)}
      />

      <ConfirmationModal
        visible={deleteVisible}
        title="Delete Category"
        message={`Are you sure you want to delete ${selectedCategory?.categoryName || 'this category'}?`}
        confirmLabel="Delete"
        loading={deletingId !== null}
        onClose={() => setDeleteVisible(false)}
        onConfirm={() => selectedCategory && handleDelete(selectedCategory)}
      />
    </>
  )
}

export default CategoryPanel
