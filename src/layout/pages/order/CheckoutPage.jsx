
import React, { useMemo, useState } from 'react'
import { CContainer, CRow, CCol, CButton } from '@coreui/react'
import { ArrowLeft } from 'lucide-react'

import StepIndicator from './StepIndicator'
import AddressSection from './AddressSection'
import OrderReview from './OrderReview'
import PaymentSection from './PaymentSection'
import OrderSuccess from './OrderSuccess'

import './checkout.css'

import { useCart } from '../../../context/CartContext'


// ---------------------------------------------------------------------------
// Sample address data
// Replace this later with your real address API.
// ---------------------------------------------------------------------------

const SAMPLE_ADDRESSES = [
  {
    id: 'addr-1',
    fullName: 'Ananya Sharma',
    phone: '9876543210',
    line1: '14, Rosewood Apartments',
    line2: 'Sector 21',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122016',
    type: 'Home',
    isDefault: true,
  },

  {
    id: 'addr-2',
    fullName: 'Ananya Sharma',
    phone: '9876543210',
    line1: '4th Floor, Meridian Business Park',
    line2: '',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    type: 'Office',
    isDefault: false,
  },
]


// ---------------------------------------------------------------------------
// Checkout steps
// ---------------------------------------------------------------------------

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

  {
    key: 'success',
    label: 'Done',
  },
]


// ---------------------------------------------------------------------------
// Order charges
// ---------------------------------------------------------------------------

const SHIPPING = 0
const DISCOUNT = 1000


const CheckoutPage = () => {

  /* =====================================================
     CART CONTEXT
     ===================================================== */

  const {
    items,
    totalItems,
  } = useCart()


  /* =====================================================
     ADDRESS STATE
     ===================================================== */

  const [addresses, setAddresses] = useState(
    SAMPLE_ADDRESSES
  )


  /* =====================================================
     CURRENT CHECKOUT STEP
     ===================================================== */

  const [currentStep, setCurrentStep] = useState(1)


  /* =====================================================
     SELECTED ADDRESS
     ===================================================== */

  const [selectedAddressId, setSelectedAddressId] = useState(
    SAMPLE_ADDRESSES.find((a) => a.isDefault)?.id ??
    SAMPLE_ADDRESSES[0]?.id ??
    null
  )


  /* =====================================================
     PAYMENT STATE
     ===================================================== */

  const [paymentMethod, setPaymentMethod] = useState(null)

  const [isPaying, setIsPaying] = useState(false)

  const [order, setOrder] = useState(null)


  /* =====================================================
     MAP API CART DATA → CHECKOUT UI DATA
     =====================================================

     API response:

     {
       id,
       productId,
       variantId,
       quantity,
       totalPrice,

       product: {
         name
       },

       variant: {
         name,
         color,
         price,
         images
       }
     }

     Checkout UI expects:

     {
       id,
       productId,
       variantId,
       name,
       variantName,
       color,
       price,
       qty,
       image,
       itemTotal
     }

     ===================================================== */

  const mappedItems = useMemo(() => {

    return items.map((item) => {

      /* =================================================
         FIND PRIMARY IMAGE
         ================================================= */

      const primaryImage =
        item.variant?.images?.find(
          (image) => image.isPrimary === 1
        )?.image_url
        ||
        item.variant?.images?.[0]?.image_url
        ||
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
        price: Number(
          item.variant?.price || 0
        ),

        // Cart quantity
        qty: Number(
          item.quantity || 0
        ),

        // Primary product image
        image: primaryImage,

        // Total price of this cart item
        itemTotal: Number(
          item.totalPrice || 0
        ),

      }

    })

  }, [items])


  /* =====================================================
     SUBTOTAL
     ===================================================== */

  const subtotal = useMemo(() => {

    return mappedItems.reduce(
      (sum, item) => {

        return sum + (
          item.price * item.qty
        )

      },
      0
    )

  }, [mappedItems])


  /* =====================================================
     FINAL TOTAL
     ===================================================== */

  const total = Math.max(
    subtotal + SHIPPING - DISCOUNT,
    0
  )


  /* =====================================================
     SELECTED ADDRESS OBJECT
     ===================================================== */

  const selectedAddress = addresses.find(
    (address) =>
      address.id === selectedAddressId
  )


  /* =====================================================
     SAVE ADDRESS
     ===================================================== */

  const handleSaveAddress = (addr) => {

    setAddresses((prev) => {

      const exists = prev.some(
        (address) => address.id === addr.id
      )


      const next = exists
        ? prev.map(
            (address) =>
              address.id === addr.id
                ? addr
                : address
          )
        : [
            ...prev,
            addr,
          ]


      /* ================================================
         MAKE SELECTED ADDRESS DEFAULT
         ================================================ */

      return addr.isDefault
        ? next.map(
            (address) => ({
              ...address,

              isDefault:
                address.id === addr.id,
            })
          )
        : next

    })


    setSelectedAddressId(addr.id)

  }


  /* =====================================================
     GO TO CHECKOUT STEP
     ===================================================== */

  const goToStep = (step) => {

    setCurrentStep(step)

  }


  /* =====================================================
     PAY NOW
     ===================================================== */

  const handlePayNow = () => {

    setIsPaying(true)


    /*
      Replace this later with:

      Razorpay payment API
      OR
      COD order creation API
    */


    setTimeout(() => {

      setOrder({

        orderNumber:
          `SABR${Math.floor(
            100000 +
            Math.random() * 900000
          )}`,

        paymentStatus:
          paymentMethod === 'cod'
            ? 'cod'
            : 'paid',

      })


      setIsPaying(false)

      setCurrentStep(4)

    }, 1200)

  }


  /* =====================================================
     RESET CHECKOUT
     ===================================================== */

  const resetCheckout = () => {

    setCurrentStep(1)

    setPaymentMethod(null)

    setOrder(null)

  }


  /* =====================================================
     RENDER
     ===================================================== */

  return (

    <div className="sabr-checkout">

      <CContainer fluid="lg">


        {/* =================================================
            BRAND
            ================================================= */}

        <div className="sabr-brand">

          <h1 className="sabr-brand__mark">

            THE SABR{' '}

            <span>
              INDIA
            </span>

          </h1>


          <div className="sabr-brand__sub">
            SECURE CHECKOUT
          </div>

        </div>



        {/* =================================================
            STEP INDICATOR
            ================================================= */}

        {currentStep < 4 && (

          <StepIndicator
            steps={STEPS.slice(0, 3)}
            currentStep={currentStep}
          />

        )}



        {/* =================================================
            CHECKOUT STEPS
            ================================================= */}

        {currentStep < 4 ? (

          <CRow className="g-4">


            {/* =================================================
                LEFT CONTENT
                ================================================= */}

            <CCol
              xs={12}
              lg={7}
            >


              {/* =================================================
                  BACK BUTTON
                  ================================================= */}

              {currentStep > 1 && (

                <CButton
                  className="sabr-btn-ghost mb-3 d-inline-flex align-items-center gap-1"
                  onClick={() =>
                    goToStep(currentStep - 1)
                  }
                >

                  <ArrowLeft size={15} />

                  Back

                </CButton>

              )}



              {/* =================================================
                  STEP 1 — ADDRESS
                  ================================================= */}

              {currentStep === 1 && (

                <>

                  <AddressSection

                    addresses={addresses}

                    selectedId={
                      selectedAddressId
                    }

                    onSelect={
                      setSelectedAddressId
                    }

                    onSave={
                      handleSaveAddress
                    }

                  />


                  <div className="d-flex justify-content-end mt-3">

                    <CButton
                      className="sabr-btn-primary"

                      disabled={
                        !selectedAddressId
                      }

                      onClick={() =>
                        goToStep(2)
                      }
                    >
                      Continue to Review
                    </CButton>

                  </div>

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

                    total={total}

                  />


                  <div className="d-flex justify-content-end mt-3">

                    <CButton
                      className="sabr-btn-primary"

                      onClick={() =>
                        goToStep(3)
                      }
                    >
                      Continue to Payment
                    </CButton>

                  </div>

                </>

              )}



              {/* =================================================
                  STEP 3 — PAYMENT
                  ================================================= */}

              {currentStep === 3 && (

                <PaymentSection

                  selectedMethod={
                    paymentMethod
                  }

                  onSelectMethod={
                    setPaymentMethod
                  }

                  onPayNow={
                    handlePayNow
                  }

                  total={total}

                  loading={isPaying}

                />

              )}

            </CCol>



            {/* =================================================
                RIGHT SIDEBAR
                ================================================= */}

            <CCol
              xs={12}
              lg={5}
            >

              <div className="sabr-sidebar">


                {/* =================================================
                    DELIVERY ADDRESS
                    ================================================= */}

                {selectedAddress &&
                  currentStep !== 1 && (

                    <div
                      className="sabr-card mb-3"
                      style={{
                        padding:
                          '0.9rem 1.1rem',
                      }}
                    >

                      <div className="sabr-card__eyebrow mb-1">
                        DELIVERING TO
                      </div>


                      <div className="small fw-semibold">

                        {
                          selectedAddress.fullName
                        }

                      </div>


                      <div
                        className="small"
                        style={{
                          color:
                            'var(--sabr-ink-soft)',
                        }}
                      >

                        {
                          selectedAddress.line1
                        }

                        {', '}

                        {
                          selectedAddress.city
                        }

                        {' – '}

                        {
                          selectedAddress.pincode
                        }

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

                  compact

                />

              </div>

            </CCol>

          </CRow>

        ) : (


          /* =====================================================
             ORDER SUCCESS
             ===================================================== */

          <OrderSuccess

            orderNumber={
              order?.orderNumber
            }

            paymentStatus={
              order?.paymentStatus
            }

            paymentMethod={
              paymentMethod
            }

            address={
              selectedAddress
            }

            items={
              mappedItems
            }

            total={
              total
            }

            onTrackOrder={() => {

              /*
                Wire this later with your
                order tracking route.
              */

            }}

            onContinueShopping={
              resetCheckout
            }

          />

        )}

      </CContainer>

    </div>

  )

}


export default CheckoutPage