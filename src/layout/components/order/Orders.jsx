import React, { useEffect, useMemo, useState } from 'react'

import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CSpinner,
} from '@coreui/react'

import {
  Package,
  CalendarDays,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Truck,
} from 'lucide-react'

import { useAuth } from '../../../context/AuthContext.jsx'
import API_BASE_URL, { API_ROUTES } from '../../../config/api.js'

import './Orders.css'

const Order = () => {
  const { token } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.orders}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load orders'
        )
      }

      /*
        Supports:
        [
          {...order}
        ]

        OR

        {
          orders: [...]
        }
      */

      const orderList = Array.isArray(data)
        ? data
        : data.orders || []

      setOrders(orderList)
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
  }, [orders])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount || 0))
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success'

      case 'DELIVERED':
        return 'success'

      case 'SHIPPED':
        return 'info'

      case 'PROCESSING':
        return 'warning'

      case 'CANCELLED':
        return 'danger'

      case 'PENDING':
        return 'warning'

      case 'FAILED':
        return 'danger'

      default:
        return 'secondary'
    }
  }

  const toggleOrder = (orderId) => {
    setExpandedOrderId((current) =>
      current === orderId ? null : orderId
    )
  }

  if (loading) {
    return (
      <div className="orders-loading">
        <CSpinner />

        <p>
          Loading your orders...
        </p>
      </div>
    )
  }

  return (
    <main className="orders-page">

      <CContainer>

        {/* ================= PAGE HEADER ================= */}

        <div className="orders-page-header">

          <div>

            <p className="orders-eyebrow">
              MY ACCOUNT
            </p>

            <h1>
              My Orders
            </h1>

            <p>
              View all your purchases and track
              your order details.
            </p>

          </div>

          <div className="orders-header-icon">
            <ShoppingBag size={27} />
          </div>

        </div>


        {/* ================= SUMMARY ================= */}

        <CCard className="orders-summary-card">

          <CCardBody>

            <CRow className="g-3">

              <CCol md={4}>

                <div className="order-summary-item">

                  <div className="summary-icon">
                    <Package size={20} />
                  </div>

                  <div>

                    <span>
                      Total Orders
                    </span>

                    <strong>
                      {sortedOrders.length}
                    </strong>

                  </div>

                </div>

              </CCol>


              <CCol md={4}>

                <div className="order-summary-item">

                  <div className="summary-icon">
                    <Truck size={20} />
                  </div>

                  <div>

                    <span>
                      Delivered
                    </span>

                    <strong>
                      {
                        sortedOrders.filter(
                          (order) =>
                            order.orderStatus ===
                            'DELIVERED'
                        ).length
                      }
                    </strong>

                  </div>

                </div>

              </CCol>


              <CCol md={4}>

                <div className="order-summary-item">

                  <div className="summary-icon">
                    <CreditCard size={20} />
                  </div>

                  <div>

                    <span>
                      Total Spent
                    </span>

                    <strong>
                      {formatCurrency(
                        sortedOrders
                          .filter(
                            (order) =>
                              order.orderStatus !==
                              'CANCELLED'
                          )
                          .reduce(
                            (total, order) =>
                              total +
                              Number(
                                order.totalAmount || 0
                              ),
                            0
                          )
                      )}
                    </strong>

                  </div>

                </div>

              </CCol>

            </CRow>

          </CCardBody>

        </CCard>


        {/* ================= ERROR ================= */}

        {message && (
          <CAlert
            color={message.type}
            className="orders-alert"
          >
            {message.text}
          </CAlert>
        )}


        {/* ================= EMPTY ================= */}

        {sortedOrders.length === 0 ? (

          <div className="orders-empty">

            <Package size={42} />

            <h2>
              No orders yet
            </h2>

            <p>
              Your order history will appear here
              after you place your first order.
            </p>

          </div>

        ) : (

          <div className="orders-list">

            {sortedOrders.map((order) => {

              const isExpanded =
                expandedOrderId === order.id

              const totalQuantity =
                order.items?.reduce(
                  (total, item) =>
                    total + Number(item.quantity || 0),
                  0
                ) || 0

              return (

                <CCard
                  className="order-card"
                  key={order.id}
                >

                  {/* ================= ORDER TOP ================= */}

                  <div className="order-card-header">

                    <div>

                      <span className="order-label">
                        Order Number
                      </span>

                      <strong className="order-number">
                        {order.orderNumber}
                      </strong>

                    </div>


                    <div className="order-status-group">

                      <CBadge
                        color={getStatusColor(
                          order.orderStatus
                        )}
                        className="order-status-badge"
                      >
                        {order.orderStatus}
                      </CBadge>

                    </div>

                  </div>


                  <CCardBody>

                    {/* ================= ORDER META ================= */}

                    <div className="order-meta-grid">

                      <div className="order-meta-item">

                        <CalendarDays size={17} />

                        <div>

                          <span>
                            Ordered On
                          </span>

                          <strong>
                            {formatDate(
                              order.createdAt
                            )}
                          </strong>

                        </div>

                      </div>


                      <div className="order-meta-item">

                        <Package size={17} />

                        <div>

                          <span>
                            Items
                          </span>

                          <strong>
                            {totalQuantity}
                          </strong>

                        </div>

                      </div>


                      <div className="order-meta-item">

                        <CreditCard size={17} />

                        <div>

                          <span>
                            Payment
                          </span>

                          <strong>
                            {order.paymentMethod}
                          </strong>

                        </div>

                      </div>


                      <div className="order-meta-item">

                        <div>

                          <span>
                            Total Amount
                          </span>

                          <strong className="order-total">
                            {formatCurrency(
                              order.totalAmount
                            )}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* ================= PRODUCTS PREVIEW ================= */}

                    <div className="order-products-preview">

                      {order.items
                        ?.slice(0, 3)
                        .map((item) => (

                          <div
                            className="order-preview-item"
                            key={item.id}
                          >

                            <img
                              src={
                                item.image?.startsWith(
                                  'http'
                                )
                                  ? item.image
                                  : `${API_BASE_URL}${item.image}`
                              }
                              alt={item.productName}
                            />

                            <div>

                              <strong>
                                {item.productName}
                              </strong>

                              <span>
                                {item.variantName}
                              </span>

                              <span>
                                Qty: {item.quantity}
                              </span>

                            </div>

                          </div>

                        ))}

                    </div>


                    {/* ================= FOOTER ================= */}

                    <div className="order-card-footer">

                      <div className="payment-status">

                        <span>
                          Payment Status
                        </span>

                        <CBadge
                          color={getStatusColor(
                            order.paymentStatus
                          )}
                        >
                          {order.paymentStatus}
                        </CBadge>

                      </div>


                      <CButton
                        className="order-details-button"
                        onClick={() =>
                          toggleOrder(order.id)
                        }
                      >

                        {isExpanded
                          ? 'Hide Details'
                          : 'View Details'}

                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}

                      </CButton>

                    </div>


                    {/* ================= EXPANDED DETAILS ================= */}

                    {isExpanded && (

                      <div className="order-details">

                        {/* ITEMS */}

                        <div className="order-details-section">

                          <h3>
                            Order Items
                          </h3>

                          <div className="order-items-list">

                            {order.items?.map((item) => (

                              <div
                                className="order-item-row"
                                key={item.id}
                              >

                                <img
                                  src={
                                    item.image?.startsWith(
                                      'http'
                                    )
                                      ? item.image
                                      : `${API_BASE_URL}${item.image}`
                                  }
                                  alt={item.productName}
                                />


                                <div className="order-item-info">

                                  <strong>
                                    {item.productName}
                                  </strong>

                                  <span>
                                    {item.variantName}
                                  </span>

                                  <span>
                                    SKU: {item.sku}
                                  </span>

                                </div>


                                <div className="order-item-price">

                                  <span>
                                    {formatCurrency(
                                      item.price
                                    )}
                                    {' × '}
                                    {item.quantity}
                                  </span>

                                  <strong>
                                    {formatCurrency(
                                      item.totalPrice
                                    )}
                                  </strong>

                                </div>

                              </div>

                            ))}

                          </div>

                        </div>


                        {/* PRICE BREAKUP */}

                        <div className="order-details-grid">

                          <div className="order-details-section">

                            <h3>
                              Price Details
                            </h3>

                            <div className="price-row">
                              <span>
                                Subtotal
                              </span>

                              <strong>
                                {formatCurrency(
                                  order.subtotal
                                )}
                              </strong>
                            </div>

                            <div className="price-row">
                              <span>
                                Shipping
                              </span>

                              <strong>
                                {Number(
                                  order.shippingCharge
                                ) === 0
                                  ? 'Free'
                                  : formatCurrency(
                                      order.shippingCharge
                                    )}
                              </strong>
                            </div>

                            <div className="price-row">
                              <span>
                                Discount
                              </span>

                              <strong>
                                -
                                {formatCurrency(
                                  order.discount
                                )}
                              </strong>
                            </div>

                            <div className="price-row total">
                              <span>
                                Total
                              </span>

                              <strong>
                                {formatCurrency(
                                  order.totalAmount
                                )}
                              </strong>
                            </div>

                          </div>


                          {/* SHIPPING */}

                          <div className="order-details-section">

                            <h3>
                              Delivery Address
                            </h3>

                            <div className="shipping-address">

                              <MapPin size={18} />

                              <div>

                                <strong>
                                  {order.shippingName}
                                </strong>

                                <span>
                                  {order.shippingPhone}
                                </span>

                                <p>
                                  {order.shippingAddressLine1}
                                </p>

                                {order.shippingAddressLine2 && (
                                  <p>
                                    {order.shippingAddressLine2}
                                  </p>
                                )}

                                <p>
                                  {order.shippingCity},{' '}
                                  {order.shippingState}
                                  {' - '}
                                  {order.shippingPincode}
                                </p>

                                <p>
                                  {order.shippingCountry}
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* SHIPMENT */}

                        {order.shipment && (

                          <div className="order-details-section shipment-section">

                            <h3>
                              Shipment
                            </h3>

                            <p>
                              Shipment information
                              available.
                            </p>

                          </div>

                        )}

                      </div>

                    )}

                  </CCardBody>

                </CCard>

              )
            })}

          </div>

        )}

      </CContainer>

    </main>
  )
}

export default Order