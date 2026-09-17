import React from 'react';
import { CCard, CCardHeader, CCardBody } from '@coreui/react';
import { ShoppingBag } from 'lucide-react';

const API_BASE_IMAGE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const currency = (n) =>
  `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;


const OrderReview = ({
  items = [],
  subtotal = 0,
  shipping = 0,
  discount = 0,
  total = 0,
  compact = false,
  stepLabel = 'STEP 02',
  currentStep = 1
}) => {
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);
  return (
    <CCard className={`sabr-card ${!compact || currentStep===1 ? 'sabr-card--current' : ''}`}>
      <CCardHeader className="sabr-card__header">
        {!compact && <div className="sabr-card__eyebrow">{stepLabel}</div>}
        <h2 className="sabr-card__title" style={{ fontSize: compact ? '1.25rem' : undefined }}>
          <ShoppingBag size={compact ? 16 : 18} className="me-2 mb-1" />
          {compact ? `Order Summary (${itemCount})` : 'Review Your Order'}
        </h2>
      </CCardHeader>

      <CCardBody className="sabr-card__body">
        {!compact && (
          <div className="mb-2">
            {items.map((item) => (
              <div className="sabr-item-row" key={item.id}>
                <img src={`${API_BASE_IMAGE_URL}${item.image}`} alt={item.name} className="sabr-item-row__img" />
                <div className="flex-grow-1">
                  <div className="sabr-item-row__name">{item.name}</div>
                  <div className="sabr-item-row__meta">
                    {item.variant} · Qty {item.qty}
                  </div>
                </div>
                <div className="sabr-item-row__price">{currency(item.price * item.qty)}</div>
              </div>
            ))}
          </div>
        )}

        {compact && (
          <div className="mb-2" style={{ maxHeight: 220, overflowY: 'auto' }}>
            {items.map((item) => (
              <div className="d-flex justify-content-between align-items-center py-1" key={item.id}>
                <span className="small" style={{ color: 'var(--sabr-ink-soft)' }}>
                  {item.name} <span className="text-nowrap">× {item.qty}</span>
                </span>
                <span className="small fw-semibold">{currency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2">
          <div className="sabr-summary-line">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <div className="sabr-summary-line">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : currency(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="sabr-summary-line sabr-summary-line--discount">
              <span>Discount</span>
              <span>−{currency(discount)}</span>
            </div>
          )}
          <div className="sabr-summary-total">
            <span className="sabr-summary-total__label">Total</span>
            <span className="sabr-summary-total__value">{currency(total)}</span>
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default OrderReview;
