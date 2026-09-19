import React, { useMemo, useState } from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { ArrowLeft } from 'lucide-react'

import StepIndicator from './StepIndicator'
import AddressSection from './AddressSection'
import OrderReview from './OrderReview'
import PaymentSection from './PaymentSection'
import './checkout.css'
import { useCart } from '../../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { createOrderApi } from '../../../services/order.api'
import { useConfirm } from '../../components/confirm/ConfirmModal'

const STEPS = [
  {
    key: 'address',
    label: 'Address',
  },

  {
    key: 'review',
    label: 'Review',
  },

  {
    key: 'payment',
    label: 'Payment',
  },
]

const SHIPPING = 0
const DISCOUNT = 1000

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { confirm, modal } = useConfirm();
  const { items, totalItems, loadCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null,);
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [isPaying, setIsPaying] = useState(false)
  const [order, setOrder] = useState(null)
  const mappedItems = useMemo(() => {
    return items.map((item) => {
      /* =================================================
         FIND PRIMARY IMAGE
         ================================================= */

      const primaryImage =
        item.variant?.images?.find((image) => image.isPrimary === 1)?.image_url ||
        item.variant?.images?.[0]?.image_url ||
        null

      /* =================================================
         RETURN UI FRIENDLY OBJECT
         ================================================= */

      return {
        // Cart item ID
        id: item.id,

        // Product ID
        productId: item.productId,

        // Product name
        name: item.product?.name || 'Saree',

        // Variant ID
        variantId: item.variantId,

        // Variant name
        variantName: item.variant?.name || '',

        // Variant color
        color: item.variant?.color || '',

        // Variant price
        price: Number(item.variant?.price || 0),

        // Cart quantity
        qty: Number(item.quantity || 0),

        // Primary product image
        image: primaryImage,

        // Total price of this cart item
        itemTotal: Number(item.totalPrice || 0),
      }
    })
  }, [items])

  const subtotal = useMemo(() => {
    return mappedItems.reduce((sum, item) => {
      return sum + item.price * item.qty
    }, 0)
  }, [mappedItems])
  const total = Math.max(subtotal + SHIPPING - DISCOUNT, 0)
  const goToStep = (step) => {
    setCurrentStep(step)
  }
  const resetCheckout = () => {
    setCurrentStep(1)
    setPaymentMethod(null)
    setOrder(null)
  } 
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)
  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handleAddressesChange = (data) => {
    setAddresses(data);
  };

 const handleAddressSave = (address) => {
    if (address?.__type === "LOAD_ADDRESSES") {
      setAddresses(address.addresses || []);
      if (address.addresses?.length) {
        setSelectedAddressId(address.addresses[0].id);
      }
      return;
    }
    if (!address?.id) return;
    setAddresses((prev) => {
      const exists = prev.some(
        (item) => item.id === address.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === address.id ? address : item
        );
      }

      return [...prev, address];
    });

    setSelectedAddressId(address.id);
  };
  const isCod = String(paymentMethod).toUpperCase() === 'COD';
  const placeOrder = async () => {
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        paymentMethod: String(paymentMethod).toUpperCase(),
        shippingAddress: selectedAddress,
      };
      const response = await createOrderApi(payload);
      setOrder(response);
      resetCheckout();
      loadCart();
      navigate(`/order-success/${response.orderId}/${response.orderNumber}`);
    } catch (error) {
      console.error('Create Order Error ::>>', error);
      // setError(error?.message || 'Unable to create order');
      throw error;
    }
  };
  const currency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const handlePayNow = async () => {
    const totalAmount = currency(total);
    await confirm({
      variant: 'payment',
      title: isCod ? 'Place your order?' : 'Ready to pay?',
      message: isCod
        ? 'You will pay in cash when your order is delivered.'
        : 'Please check your address and items before you pay.',
      details: isCod ? `Amount to pay on delivery: ${totalAmount}` : `Total: ${totalAmount}`,
      confirmText: isCod ? 'Place order' : `Pay ${totalAmount}`,
      cancelText: 'Review order',
      onConfirm: placeOrder,
    });
  };
  return (
    <div className="sabr-checkout">
      <CContainer fluid="lg">
        <div className="sabr-brand">
          <h1 className="sabr-brand__mark">
            THE SABR <span>INDIA</span>
          </h1>
          <div className="sabr-brand__sub">SECURE CHECKOUT</div>
        </div>
        {currentStep < 4 && <StepIndicator steps={STEPS.slice(0, 3)} currentStep={currentStep} />}
            <CRow className="g-4 px-4">
              <CCol xs={12} lg={7}>
                <CButton
                  className={`sabr-btn-ghost mb-3 d-inline-flex align-items-center gap-1 ${currentStep > 1 ? 'visible' : 'invisible'}`}
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep <= 1}
                >
                  <ArrowLeft size={15} />
                  Back
                </CButton>
              </CCol>
            </CRow>
            <CRow className="g-4 px-4">
              {/* =================================================
                LEFT CONTENT
                ================================================= */}
              <CCol xs={12} lg={7}>
                {/* =================================================
                  STEP 1 — ADDRESS
                  ================================================= */}
                {currentStep === 1 && (
                  <>
                    <AddressSection
                      addresses={addresses}
                      selectedId={selectedAddressId}
                      onSelect={handleAddressSelect}
                      onSave={handleAddressSave}
                      onAddressesChange={handleAddressesChange}
                    />
                  </>
                )}
                {/* =================================================
                  STEP 2 — ORDER REVIEW
                  ================================================= */}
                {currentStep === 2 && (
                  <>
                    <OrderReview
                      items={mappedItems}
                      subtotal={subtotal}
                      shipping={SHIPPING}
                      discount={DISCOUNT}
                      currentStep={currentStep}
                      total={total}
                    />
                  </>
                )}
                {/* =================================================
                  STEP 3 — PAYMENT
                  ================================================= */}
                {currentStep === 3 && (
                  <PaymentSection
                    selectedMethod={paymentMethod}
                    onSelectMethod={setPaymentMethod}
                    onPayNow={handlePayNow}
                    total={total}
                    loading={isPaying}
                  />
                )}
              </CCol>
              {/* =================================================
                RIGHT SIDEBAR
                ================================================= */}
              <CCol xs={12} lg={5}>
                <div className="sabr-sidebar">
                  {/* =================================================
                    DELIVERY ADDRESS
                    ================================================= */}

                  {selectedAddress && currentStep !== 1 && (
                    <div
                      className="sabr-card mb-3 sabr-card--current"
                      style={{
                        padding: '0.9rem 1.1rem',
                      }}
                    >
                      <div className="sabr-card__eyebrow mb-1">DELIVERING TO</div>

                      <div className="small fw-semibold">{selectedAddress.name}</div>

                      <div
                        className="small"
                        style={{
                          color: 'var(--sabr-ink-soft)',
                        }}
                      >
                        {selectedAddress.addressLine1}<br/>
                        {selectedAddress.addressLine2}

                        {', '}

                        {selectedAddress.city}

                        {' – '}

                        {selectedAddress.pincode}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                    COMPACT ORDER REVIEW
                    ================================================= */}

                  <OrderReview
                    items={mappedItems}
                    subtotal={subtotal}
                    shipping={SHIPPING}
                    discount={DISCOUNT}
                    total={total}
                    currentStep={currentStep}
                    compact
                  />
                </div>
                {/* =================================================
                  STEP 1 — ADDRESS BUTTON
                  ================================================= */}
                {currentStep === 1 && (
                  <>
                    {/* <div className="d-flex justify-content-end mt-3"> */}
                    <div className="d-flex justify-content-center mt-3">
                      <CButton
                        className="sabr-btn-primary"
                        disabled={!selectedAddressId}
                        onClick={() => goToStep(2)}
                      >
                        Continue to Review
                      </CButton>
                    </div>
                  </>
                )}
                {/* =================================================
                  STEP 2 — ORDER REVIEW BUTTON
                  ================================================= */}
                {currentStep === 2 && (
                  <>
                    {/* <div className="d-flex justify-content-end mt-3"> */}
                    <div className="d-flex justify-content-center mt-3">
                      <CButton className="sabr-btn-primary" onClick={() => goToStep(3)}>
                        Continue to Payment
                      </CButton>
                    </div>
                  </>
                )}
              </CCol>
            </CRow>
      </CContainer>
      {modal}
    </div>
  )
}

export default CheckoutPage
