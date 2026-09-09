import React from 'react';
import ReusableTable from '../common/ReusableTable'

const OrderPanel = () => {
 
  const columns = [
  { header: 'Sr No.', accessor: 'srNo' },
  { header: 'Order ID', accessor: 'orderId' },
  { header: 'Customer', accessor: 'customer' },
  { header: 'Date', accessor: 'date' },
  { header: 'Amount', accessor: 'amount' },
  { header: 'Status', accessor: 'status' },
]

const data = [
  { id: 1, srNo: 1, orderId: 'ORD-1001', customer: 'Mark Otto', date: '2026-09-01', amount: '$125.00', status: 'Delivered' },
  { id: 2, srNo: 2, orderId: 'ORD-1002', customer: 'Jacob Thornton', date: '2026-09-03', amount: '$89.50', status: 'Shipped' },
  { id: 3, srNo: 3, orderId: 'ORD-1003', customer: 'Larry Bird', date: '2026-09-05', amount: '$210.00', status: 'Pending' },
  { id: 4, srNo: 4, orderId: 'ORD-1004', customer: 'Sarah Wilson', date: '2026-09-06', amount: '$67.25', status: 'Cancelled' },
  { id: 5, srNo: 5, orderId: 'ORD-1005', customer: 'John Doe', date: '2026-09-08', amount: '$154.00', status: 'Processing' },
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

export default OrderPanel