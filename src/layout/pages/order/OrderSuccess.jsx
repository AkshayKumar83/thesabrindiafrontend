import React from 'react';
import { CCard, CCardBody, CButton } from '@coreui/react';
import { CheckCircle2, Truck, Compass, ShoppingBag, MapPin } from 'lucide-react';

const currency = (n) =>
  `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * OrderSuccess
 *
 * @param {string} orderNumber
 * @param {'paid'|'cod'} paymentStatus
 * @param {'online'|'cod'} paymentMethod
 * @param {Object} address        - the delivery address used for the order
 * @param {Object[]} items
 * @param {number} total
 * @param {() => void} onTrackOrder
 * @param {() => void} onContinueShopping
 */

const OrderSuccess = ({
  orderNumber,
  paymentStatus = 'paid',
  paymentMethod = 'online',
  address,
  items = [],
  total = 0,
  onTrackOrder,
  onContinueShopping,
  compact=false
}) => {
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  console.log("order success page:: here");
  return (
    <div style={!compact ? {paddingBlock:"1.5rem 5rem"}: {}}>
    {
      !compact && (
        <div className="sabr-brand">
          <h1 className="sabr-brand__mark">
            THE SABR <span>INDIA</span>
          </h1>
          <div className="sabr-brand__sub">SECURE CHECKOUT</div>
        </div>
      )
    }
    <div className="sabr-success">
      <div className="sabr-success__icon">
        <CheckCircle2 size={40} strokeWidth={2} />
      </div>
      <h1 className="sabr-success__title sabr-serif">Order Placed Successfully</h1>
      <p className="sabr-success__sub">
        Thank you for shopping with THE SABR INDIA. A confirmation has been sent to your
        registered phone number and email.
      </p>

      <div className="sabr-order-id">
        <ShoppingBag size={16} />
        Order #{orderNumber}
      </div>

      <CCard className="sabr-card text-start mb-3">
        <CCardBody className="sabr-card__body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="sabr-card__eyebrow mb-0">PAYMENT STATUS</span>
            <span className={`sabr-status-badge ${paymentMethod === 'cod' ? 'sabr-status-badge--cod' : ''}`}>
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'} ·{' '}
              {paymentStatus === 'paid' ? 'Confirmed' : 'Pending'}
            </span>
          </div>

          {address && (
            <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--sabr-line)' }}>
              <div className="sabr-card__eyebrow d-flex align-items-center gap-1">
                <MapPin size={12} /> DELIVERY ADDRESS
              </div>
              <div className="fw-semibold" style={{ fontSize: '0.92rem' }}>
                {address?.fullName}
              </div>
              <div className="small" style={{ color: 'var(--sabr-ink-soft)' }}>
                {address?.line1}
                {address?.line2 ? `, ${address?.line2}` : ''}, {address?.city}, {address?.state} –{' '}
                {address?.pincode}
                <br />
                Phone: {address?.phone}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <span className="small" style={{ color: 'var(--sabr-ink-soft)' }}>
              {itemCount} item{itemCount > 1 ? 's' : ''} ordered
            </span>
            <span className="sabr-summary-total__value" style={{ fontSize: '1.35rem' }}>
              {currency(total)}
            </span>
          </div>
        </CCardBody>
      </CCard>

      <div className="sabr-success-actions">
        <CButton className="sabr-btn-primary d-flex align-items-center gap-2" onClick={onTrackOrder}>
          <Truck size={17} />
          Track Order
        </CButton>
        <CButton className="sabr-btn-outline d-flex align-items-center gap-2" onClick={onContinueShopping}>
          <Compass size={17} />
          Continue Shopping
        </CButton>
      </div>
    </div>
    </div>
  );
};

export default OrderSuccess;
