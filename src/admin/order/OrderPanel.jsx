import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import {
  CalendarDays,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  X,
} from 'lucide-react'

import ReusableTable from '../common/ReusableTable'
import './OrderPanel.css'
import { getAllOrdersListApi } from '../../services/order.api'

const API_BASE_IMAGE_URL = import.meta.env.API_BASE_IMAGE_URL || "http://localhost:8090"

console.log('API_BASE_IMAGE_URL:', API_BASE_IMAGE_URL  )

const OrderPanel = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // ==========================================================
  // API
  // ==========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const result = await getAllOrdersListApi()
      const orderList = result.orders || []

      setOrders(orderList)
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getPaymentMethodColor = (method) => {
  switch (method?.toUpperCase()) {
    case 'COD':
      return 'secondary'

    case 'ONLINE':
    case 'RAZORPAY':
      return 'primary'

    default:
      return 'secondary'
  }
}

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`
  }

  // ==========================================================
  // STATUS BADGE
  // ==========================================================

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return 'success'

      case 'CONFIRMED':
        return 'primary'

      case 'SHIPPED':
        return 'info'

      case 'PROCESSING':
        return 'warning'

      case 'CANCELLED':
      case 'FAILED':
        return 'danger'

      case 'PENDING':
        return 'warning'

      default:
        return 'secondary'
    }
  }

  const getPaymentColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'success'

      case 'PENDING':
        return 'warning'

      case 'FAILED':
        return 'danger'

      case 'REFUNDED':
        return 'info'

      default:
        return 'secondary'
    }
  }

  // ==========================================================
  // TABLE DATA
  // ==========================================================

  const tableData = orders.map((order, index) => ({
    ...order,

    id: order.id,

    srNo: index + 1,

    orderId: order.orderNumber,

    customer: order.shippingName || 'N/A',
    phoneNo: order.shippingPhone || 'N/A',
    email: order.shippingEmail || 'N/A',
    city: order.shippingCity || 'N/A',
    state: order.shippingState || 'N/A',
    pinCode: order.shippingPincode || 'N/A',

    date: formatDate(order.createdAt),
    noOfProducts: order?.items?.length || 0,


    amount: formatCurrency(order.totalAmount),

    // orderStatus: (
    //   <CBadge color={getStatusColor(order.orderStatus)}>
    //     {order.orderStatus}
    //   </CBadge>
    // ),
    // paymentStatus: (
    //   <CBadge color={getPaymentColor(order.paymentStatus)}>
    //     {order.paymentStatus}
    //   </CBadge>
    // ),
    // paymentMethod: (
    //   <CBadge color={getPaymentColor(order.paymentMethod)}>
    //     {order.paymentMethod}
    //   </CBadge>
    // ),

      orderStatus: order.orderStatus,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  }))

  // ==========================================================
  // VIEW ORDER
  // ==========================================================

  const handleView = (row) => {
    console.log("row",row)
    setSelectedOrder(row)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      header: 'Sr No.',
      accessor: 'srNo',
    },
    {
      header: 'Order ID',
      accessor: 'orderId',
    },
    {
      header: 'Customer',
      accessor: 'customer',
    },
    {
      header: 'Phone No',
      accessor: 'phoneNo',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'City',
      accessor: 'city',
    },
    {
      header: 'State',
      accessor: 'state',
    },
    {
      header: 'Pin Code',
      accessor: 'pinCode',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'No of Products',
      accessor: 'noOfProducts',
    },
    {
      header: 'Amount',
      accessor: 'amount',
    },
    {
  header: 'Order Status',
  accessor: 'orderStatus',
  render: (value) => (
    <CBadge color={getStatusColor(value)}>
      {value || 'N/A'}
    </CBadge>
  ),
},
    {
  header: 'Payment Status',
  accessor: 'paymentStatus',
  render: (value) => (
    <CBadge color={getPaymentColor(value)}>
      {value || 'N/A'}
    </CBadge>
  ),
},
    {
  header: 'Payment Method',
  accessor: 'paymentMethod',
  render: (value) => (
    <CBadge color={getPaymentMethodColor(value)}>
      {value || 'N/A'}
    </CBadge>
  ),
},
    
  ]

  return (
    <>
      <div className="order-panel">

        <div className="order-panel-header">
          <div>
            <h4>Orders</h4>
            <p>Manage and view customer orders</p>
          </div>

          <div className="order-count">
          Total Orders: {orders.length} 
          </div>
        </div>

       <div className="order-table-scroll">
          <ReusableTable
            columns={columns}
            data={tableData}
            onView={handleView}
            loading={loading}
          />
        </div>
      </div>


      {/* =====================================================
          ORDER DETAILS MODAL
          ===================================================== */}

      <CModal
        visible={showModal}
        onClose={closeModal}
        size="xl"
        alignment="center"
        backdrop="static"
        className="order-details-modal"
      >

        <CModalHeader>
          <CModalTitle>
            <div className="order-modal-title">

              <div className="order-modal-icon">
                <Package size={20} />
              </div>

              <div>
                <h5>Order Details</h5>

                <span>
                  {selectedOrder?.orderNumber}
                </span>
              </div>

            </div>
          </CModalTitle>
        </CModalHeader>


        <CModalBody>

          {selectedOrder && (
            <div className="order-details">

              {/* =================================================
                  ORDER HEADER
                  ================================================= */}

              <div className="order-summary-card">

                <div className="order-summary-left">

                  <div className="order-summary-label">
                    ORDER NUMBER
                  </div>

                  <div className="order-number">
                    {selectedOrder.orderNumber}
                  </div>

                  <div className="order-date">
                    <CalendarDays size={15} />

                    {formatDateTime(selectedOrder.createdAt)}
                  </div>

                </div>


                <div className="order-status-wrapper">

                  <div>
                    <span className="status-label">
                      ORDER STATUS
                    </span>

                    <CBadge
                      color={getStatusColor(
                        selectedOrder.orderStatus
                      )}
                    >
                      {selectedOrder.orderStatus}
                    </CBadge>
                  </div>

                  <div>
                    <span className="status-label">
                      PAYMENT
                    </span>

                    <CBadge
                      color={getPaymentColor(
                        selectedOrder.paymentStatus
                      )}
                    >
                      {selectedOrder.paymentStatus}
                    </CBadge>
                  </div>

                </div>

              </div>


              {/* =================================================
                  CUSTOMER + SHIPPING
                  ================================================= */}

              <CRow className="g-3">

                {/* Customer */}

                <CCol md={6}>

                  <CCard className="order-info-card h-100">
                    <CCardBody>

                      <div className="section-heading">
                        <User size={18} />

                        <h6>
                          Customer Information
                        </h6>
                      </div>


                      <div className="info-list">

                        <div className="info-item">
                          <span>Name</span>

                          <strong>
                            {selectedOrder.shippingName || '-'}
                          </strong>
                        </div>


                        <div className="info-item">

                          <span>
                            <Phone size={14} />
                            Phone
                          </span>

                          <strong>
                            {selectedOrder.shippingPhone || '-'}
                          </strong>

                        </div>


                        <div className="info-item">

                          <span>
                            <Mail size={14} />
                            Email
                          </span>

                          <strong className="break-text">
                            {selectedOrder.shippingEmail || '-'}
                          </strong>

                        </div>

                      </div>

                    </CCardBody>
                  </CCard>

                </CCol>


                {/* Shipping */}

                <CCol md={6}>

                  <CCard className="order-info-card h-100">
                    <CCardBody>

                      <div className="section-heading">

                        <MapPin size={18} />

                        <h6>
                          Shipping Address
                        </h6>

                      </div>


                      <div className="shipping-address">

                        <strong>
                          {selectedOrder.shippingName}
                        </strong>

                        <p>
                          {selectedOrder.shippingAddressLine1}
                        </p>

                        {selectedOrder.shippingAddressLine2 && (
                          <p>
                            {selectedOrder.shippingAddressLine2}
                          </p>
                        )}

                        <p>
                          {selectedOrder.shippingCity},{' '}
                          {selectedOrder.shippingState}{' '}
                          {selectedOrder.shippingPincode}
                        </p>

                        <p>
                          {selectedOrder.shippingCountry}
                        </p>

                      </div>

                    </CCardBody>
                  </CCard>

                </CCol>

              </CRow>


              {/* =================================================
                  PAYMENT INFORMATION
                  ================================================= */}

              <CCard className="order-info-card">

                <CCardBody>

                  <div className="section-heading">

                    <CreditCard size={18} />

                    <h6>
                      Payment Information
                    </h6>

                  </div>


                  <CRow className="g-3">

                    <CCol sm={4}>

                      <div className="payment-info">

                        <span>
                          Payment Method
                        </span>

                        <strong>
                          {selectedOrder.paymentMethod || '-'}
                        </strong>

                      </div>

                    </CCol>


                    <CCol sm={4}>

                      <div className="payment-info">

                        <span>
                          Payment Status
                        </span>

                        <CBadge
                          color={getPaymentColor(
                            selectedOrder.paymentStatus
                          )}
                        >
                          {selectedOrder.paymentStatus}
                        </CBadge>

                      </div>

                    </CCol>


                    <CCol sm={4}>

                      <div className="payment-info">

                        <span>
                          Currency
                        </span>

                        <strong>
                          {selectedOrder.currency || 'INR'}
                        </strong>

                      </div>

                    </CCol>

                  </CRow>

                </CCardBody>

              </CCard>


              {/* =================================================
                  ORDER ITEMS
                  ================================================= */}

              <CCard className="order-info-card">

                <CCardBody>

                  <div className="section-heading">

                    <Package size={18} />

                    <h6>
                      Order Items
                    </h6>

                    <span className="item-count">
                      {selectedOrder.items?.length || 0} Items
                    </span>

                  </div>


                  <div className="order-items-table">

                    <CTable responsive hover>

                      <CTableHead>

                        <CTableRow>

                          <CTableHeaderCell>
                            Product
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            SKU
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Price
                          </CTableHeaderCell>

                          <CTableHeaderCell>
                            Qty
                          </CTableHeaderCell>

                          <CTableHeaderCell className="text-end">
                            Total
                          </CTableHeaderCell>

                        </CTableRow>

                      </CTableHead>


                      <CTableBody>

                        {selectedOrder.items?.map((item) => (

                          <CTableRow key={item.id}>

                            <CTableDataCell>

                              <div className="product-cell">

                                <div className="product-image">

                                  <img
                                    src={`${API_BASE_IMAGE_URL}${item.image}`}
                                    alt={item.productName}
                                  />

                                </div>


                                <div className="product-info">

                                  <strong>
                                    {item.productName}
                                  </strong>

                                  <span>
                                    {item.variantName}
                                  </span>

                                </div>

                              </div>

                            </CTableDataCell>


                            <CTableDataCell>
                              {item.sku}
                            </CTableDataCell>


                            <CTableDataCell>
                              {formatCurrency(item.price)}
                            </CTableDataCell>


                            <CTableDataCell>
                              {item.quantity}
                            </CTableDataCell>


                            <CTableDataCell className="text-end fw-semibold">
                              {formatCurrency(item.totalPrice)}
                            </CTableDataCell>

                          </CTableRow>

                        ))}

                      </CTableBody>

                    </CTable>

                  </div>

                </CCardBody>

              </CCard>


              {/* =================================================
                  ORDER TOTAL
                  ================================================= */}

              <div className="order-total-card">

                <div className="total-row">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedOrder.subtotal
                    )}
                  </strong>

                </div>


                <div className="total-row">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    {Number(
                      selectedOrder.shippingCharge || 0
                    ) === 0
                      ? 'FREE'
                      : formatCurrency(
                          selectedOrder.shippingCharge
                        )}
                  </strong>

                </div>


                <div className="total-row">

                  <span>
                    Discount
                  </span>

                  <strong>
                    - {formatCurrency(
                      selectedOrder.discount
                    )}
                  </strong>

                </div>


                <div className="total-divider" />


                <div className="total-row final-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedOrder.totalAmount
                    )}
                  </strong>

                </div>

              </div>


              {/* =================================================
                  NOTES
                  ================================================= */}

              {selectedOrder.notes && (

                <div className="order-notes">

                  <strong>
                    Order Notes
                  </strong>

                  <p>
                    {selectedOrder.notes}
                  </p>

                </div>

              )}

            </div>
          )}

        </CModalBody>

      </CModal>
    </>
  )
}

export default OrderPanel