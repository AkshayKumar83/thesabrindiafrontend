import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CButton } from '@coreui/react';
import {
  CheckCircle2,
  Truck,
  Compass,
  ShoppingBag,
  MapPin,
  Package,
  CreditCard,
} from 'lucide-react';
import { getOrderByIdApi } from '../../../services/order.api';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import './OrderSuccess.css';

const ASSET_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const currency = (n) =>
  `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const formatDate = (iso) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const imageUrl = (src) => {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  return `${ASSET_BASE_URL.replace(/\/$/, '')}${src.startsWith('/') ? '' : '/'}${src}`;
};

const STEPS = [
  { label: 'Order confirmed', note: 'We have received your order.' },
  { label: 'Packed', note: 'Your order is being packed.' },
  { label: 'Shipped', note: 'Handed over to the courier.' },
  { label: 'Out for delivery', note: 'Arriving today.' },
  { label: 'Delivered', note: 'Enjoy your order.' },
];

// Change these keys if your orderStatus values are named differently.
const STATUS_TO_STEP = {
  CONFIRMED: 0,
  PROCESSING: 1,
  PACKED: 1,
  SHIPPED: 2,
  IN_TRANSIT: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

const getPayment = (order) => {
  const isCod = String(order?.paymentMethod).toUpperCase() === 'COD';
  const isPaid = ['PAID', 'SUCCESS', 'COMPLETED', 'CAPTURED'].includes(
    String(order?.paymentStatus).toUpperCase()
  );
  return {
    isCod,
    isPaid,
    method: isCod ? 'Cash on Delivery' : 'Online payment',
    status: isPaid ? 'Paid' : isCod ? 'Pay on delivery' : 'Payment pending',
  };
};

const CopyButton = ({ value, label = 'Copy' }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch (e) {
      /* clipboard can be blocked; ignore */
    }
  };
  return (
    <button type="button" className="sos-copy" onClick={copy}>
      {done ? 'Copied' : label}
    </button>
  );
};

const OrderSuccess = ({ compact = false }) => {
  const { id, orderNo } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let active = true;
    const loadOrder = async () => {
      if (!id || !orderNo) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getOrderByIdApi(id, orderNo);
        if (active) setOrder(response?.order ?? null);
      } catch (error) {
        console.error('Load order error:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadOrder();
    return () => {
      active = false;
    };
  }, [id, orderNo]);

  if (loading) return <Loader />;

  const brand = !compact && (
    <div className="sabr-brand">
      <h1 className="sabr-brand__mark">
        THE SABR <span>INDIA</span>
      </h1>
      <div className="sabr-brand__sub">SECURE CHECKOUT</div>
    </div>
  );

  const continueButton = (
    <CButton
      className="sabr-btn-outline d-flex align-items-center gap-2"
      onClick={() => {
        navigate('/collections');
      }}
    >
      <Compass size={17} />
      Continue Shopping
    </CButton>
  );

  if (!order) {
    return (
      <div className={`sos ${compact ? 'sos--compact' : ''}`}>
        {brand}
        <div className="sos-wrap">
          <CCard className="sos-panel">
            <CCardBody className="sos-empty">
              <h1 className="sos-title sabr-serif">We couldn't find this order</h1>
              <p className="sos-muted">
                The link may be incorrect or the order may have been removed.
              </p>
              <div className="sos-actions">{continueButton}</div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const itemCount = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  const firstName = (order.shippingName || '').trim().split(' ')[0];
  const shipping = Number(order.shippingCharge) || 0;
  const discount = Number(order.discount) || 0;
  const pay = getPayment(order);

  const status = String(order.orderStatus || '').toUpperCase();
  const cancelled = status === 'CANCELLED' || status === 'CANCELED';
  const currentStep = STATUS_TO_STEP[status] ?? 0;

  const awb = order.shipment?.awbCode;
  const shipmentId = order.shipment?.shipmentId ?? order.shipment?.id;
  const providerId = order.payment?.paymentProviderId;

  const cityLine =
    [order.shippingCity, order.shippingState].filter(Boolean).join(', ') +
    (order.shippingPincode ? ` ${order.shippingPincode}` : '');
  const addressLines = [
    order.shippingAddressLine1,
    order.shippingAddressLine2,
    cityLine,
    order.shippingCountry,
  ].filter((l) => l && l.trim());

  return (
    <div className={`sos ${compact ? 'sos--compact' : ''}`}>
      {brand}

      <div className="sos-wrap">
        {/* Hero */}
        <section className="sos-hero">
          <div className="sos-hero__inner">
            <div className="sos-hero__main">
              <div className="sos-check" aria-hidden="true">
                <CheckCircle2 size={34} strokeWidth={2} />
              </div>
              <div>
                <h1 className="sos-title sabr-serif">
                  {cancelled ? 'Order Cancelled' : 'Order Placed Successfully'}
                </h1>
                {!cancelled && (
                  <p className="sos-sub">
                    Thank you for shopping with THE SABR INDIA{firstName ? `, ${firstName}` : ''}.
                    A confirmation has been sent to your registered phone number and email.
                  </p>
                )}
              </div>
            </div>

            <div className="sos-tag">
              <span className="sos-tag__label">
                <ShoppingBag size={14} /> Order number
              </span>
              <span className="sos-tag__value">{order.orderNumber}</span>
              <span className="sos-tag__date">Placed on {formatDate(order.createdAt)}</span>
              <CopyButton value={order.orderNumber} label="Copy number" />
            </div>
          </div>
          <div className="sos-border" aria-hidden="true" />
        </section>

        <div className="sos-grid">
          {/* Items */}
          <CCard className="sos-panel sos-items">
            <CCardBody>
              <div className="sos-head">
                <h2 className="sos-h">Your items</h2>
                <span className="sos-muted">
                  {itemCount} item{itemCount === 1 ? '' : 's'} ordered
                </span>
              </div>

              <ul className="sos-list">
                {items.map((item) => {
                  const src = imageUrl(item.image);
                  return (
                    <li key={item.id} className="sos-item">
                      <div className="sos-thumb">
                        {src && (
                          <img
                            src={src}
                            alt={item.productName}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div className="sos-item__info">
                        <p className="sos-item__name">{item.productName}</p>
                        <p className="sos-muted sos-item__variant">{item.variantName}</p>
                        <p className="sos-muted">
                          {currency(item.price)} each, quantity {item.quantity}
                        </p>
                      </div>
                      <p className="sos-item__total">{currency(item.totalPrice)}</p>
                    </li>
                  );
                })}
              </ul>

              <dl className="sos-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{currency(order.subtotal)}</dd>
                </div>
                <div>
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? 'Free' : currency(shipping)}</dd>
                </div>
                {discount > 0 && (
                  <div>
                    <dt>Discount</dt>
                    <dd>-{currency(discount)}</dd>
                  </div>
                )}
                <div className="sos-grand">
                  <dt>{pay.isPaid ? 'Total paid' : 'Total'}</dt>
                  <dd>{currency(order.totalAmount)}</dd>
                </div>
                  <div className='py-1'>Thank you for shopping with THE SABR INDIA.</div>
              </dl>
            </CCardBody>
          </CCard>

          {/* Details */}
          <CCard className="sos-panel sos-side">
            <CCardBody>
              {/* <section className="sos-block" aria-labelledby="sos-status-h">
                <h2 className="sos-h" id="sos-status-h">
                  <Package size={16} /> Order status
                </h2>
                {cancelled ? (
                  <p className="sos-muted">This order has been cancelled.</p>
                ) : (
                  <ol className="sos-steps">
                    {STEPS.map((s, i) => {
                      const state =
                        i < currentStep ? 'done' : i === currentStep ? 'current' : 'todo';
                      return (
                        <li
                          key={s.label}
                          className={`sos-step is-${state}`}
                          aria-current={state === 'current' ? 'step' : undefined}
                        >
                          <span className="sos-dot" aria-hidden="true" />
                          <span className="sos-step__label">{s.label}</span>
                          {state === 'current' && (
                            <span className="sos-muted sos-step__note">{s.note}</span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section> */}

              <section className="sos-block" aria-labelledby="sos-ship-h">
                <h2 className="sos-h" id="sos-ship-h">
                  <MapPin size={16} /> Delivering to
                </h2>
                <address className="sos-address">
                  <strong>{order.shippingName}</strong>
                  {addressLines.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                  {order.shippingPhone && (
                    <span className="sos-muted sos-address__phone">Phone: {order.shippingPhone}</span>
                  )}
                </address>
              </section>

              <section className="sos-block" aria-labelledby="sos-pay-h">
                <h2 className="sos-h" id="sos-pay-h">
                  <CreditCard size={16} /> Payment
                </h2>
                <p className="sos-pay">
                  <strong>{pay.method}</strong>
                  <span className={`sos-pill ${pay.isPaid ? 'is-paid' : ''}`}>{pay.status}</span>
                </p>
                {pay.isCod && !pay.isPaid && (
                  <p className="sos-muted">
                    Please keep {currency(order.totalAmount)} ready when your order arrives.
                  </p>
                )}
                {providerId && (
                  <div className="sos-ref">
                    <span className="sos-muted">Payment ID</span>
                    <span className="sos-ref__value">{providerId}</span>
                    <CopyButton value={providerId} />
                  </div>
                )}
              </section>

              <section className="sos-block" aria-labelledby="sos-track-h">
                <h2 className="sos-h" id="sos-track-h">
                  <Truck size={16} /> Tracking
                </h2>
                {awb ? (
                  <div className="sos-ref">
                    <span className="sos-muted">AWB number</span>
                    <span className="sos-ref__value">{awb}</span>
                    <CopyButton value={awb} />
                  </div>
                ) : (
                  <p className="sos-muted">
                    Your tracking number will appear here once the order ships.
                  </p>
                )}
                {shipmentId && (
                  <div className="sos-ref">
                    <span className="sos-muted">Shipment ID</span>
                    <span className="sos-ref__value">{shipmentId}</span>
                  </div>
                )}
              </section>
            </CCardBody>
          </CCard>
        </div>

        <div className="sos-actions">
          {/* <CButton className="sabr-btn-primary d-flex align-items-center gap-2" onClick={()=>{console.log("ON TRC ORDER")}}>
            <Truck size={17} />
            Track Order
          </CButton> */}
          {continueButton}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;