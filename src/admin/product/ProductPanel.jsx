import React from 'react';
import ReusableTable from '../common/ReusableTable'
import { useNavigate } from 'react-router-dom'



const ProductPanel = () => {

    const navigate = useNavigate()

    const columns = [
        { header: 'Sr No.', accessor: 'srNo' },
        { header: 'Product Name', accessor: 'name' },
        { header: 'Category', accessor: 'category' },
        { header: 'Price', accessor: 'price' },
        { header: 'Stock', accessor: 'stock' },
    ]

    const data = [
        { id: 1, srNo: 1, name: 'Wireless Mouse', category: 'Electronics', price: '$25.00', stock: 120 },
        { id: 2, srNo: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: '$89.00', stock: 45 },
        { id: 3, srNo: 3, name: 'USB-C Hub', category: 'Accessories', price: '$35.00', stock: 80 },
        { id: 4, srNo: 4, name: 'Laptop Stand', category: 'Accessories', price: '$42.00', stock: 60 },
        { id: 5, srNo: 5, name: 'Noise Cancelling Headphones', category: 'Electronics', price: '$199.00', stock: 30 },
    ]


    const handleView = (row) => {
        console.log('View:', row)
    }

    const handleEdit = (row) => {
        console.log('Edit:', row)
        navigate(`/admin/update-product/${row.id}`)
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

export default ProductPanel