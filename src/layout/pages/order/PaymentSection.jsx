import React from 'react';
import { CCard, CCardHeader, CCardBody, CButton, CSpinner } from '@coreui/react';
import { CreditCard, Wallet, ShieldCheck, Lock } from 'lucide-react';

const currency = (n) =>
  `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * PaymentSection
 *
 * @param {'online'|'cod'} selectedMethod
 * @param {(method) => void} onSelectMethod
 * @param {() => void} onPayNow
 * @param {number} total
 * @param {boolean} loading
 */
const PaymentSection = ({ selectedMethod, onSelectMethod, onPayNow, total, loading = false }) => {
  const options = [
    {
      key: 'ONLINE',
      icon: CreditCard,
      title: 'Pay Online',
      desc: 'UPI, Credit/Debit Card, Netbanking & Wallets — powered by Razorpay',
    },
    {
      key: 'COD',
      icon: Wallet,
      title: 'Cash on Delivery',
      desc: 'Pay in cash when your order is delivered to your doorstep',
    },
  ];

  return (
    <CCard className="sabr-card sabr-card--current">
      <CCardHeader className="sabr-card__header">
        <div className="sabr-card__eyebrow">STEP 03</div>
        <h2 className="sabr-card__title">
          <Lock size={17} className="me-2 mb-1" />
          Payment
        </h2>
      </CCardHeader>

      <CCardBody className="sabr-card__body">
        {options.map((opt) => {
          const Icon = opt.icon;
          const selected = selectedMethod === opt.key;
          return (
            <div
              key={opt.key}
              className={`sabr-pay-option ${selected ? 'sabr-pay-option--selected' : ''}`}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              onClick={() => onSelectMethod(opt.key)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectMethod(opt.key)}
            >
              <div className="sabr-pay-option__icon">
                <Icon size={20} />
              </div>
              <div>
                <div className="sabr-pay-option__title">{opt.title}</div>
                <div className="sabr-pay-option__desc">{opt.desc}</div>
              </div>
              <div className="sabr-pay-option__radio">
                {selected && <div className="sabr-pay-option__radio-dot" />}
              </div>
            </div>
          );
        })}

        <CButton
          className="sabr-btn-primary sabr-pay-cta"
          disabled={!selectedMethod || loading}
          onClick={onPayNow}
        >
          {loading ? (
            <>
              <CSpinner size="sm" /> Processing...
            </>
          ) : selectedMethod === 'COD' ? (
            `Place Order · ${currency(total)}`
          ) : (
            `Pay ${currency(total)}`
          )}
        </CButton>

        <div className="sabr-trust-row">
          <ShieldCheck size={15} />
          100% Secure Payments · Encrypted &amp; PCI-DSS Compliant
        </div>
      </CCardBody>
    </CCard>
  );
};

export default PaymentSection;
