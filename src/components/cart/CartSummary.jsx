import React from "react";

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from "@coreui/react";

import { useCart } from "../../context/CartContext";

function CartSummary() {
  const {
    subtotal,
    shipping,
    total,
  } = useCart();

  return (
    <CCard className="border-0 bg-body-tertiary cart-summary">

      <CCardBody>

        {/* Replaced CStack */}
        <div className="d-flex flex-column gap-2">

          {/* Subtotal */}
          <CRow>
            <CCol className="text-body-secondary">
              Subtotal
            </CCol>

            <CCol className="text-end fw-semibold">
              ₹{subtotal.toLocaleString("en-IN")}
            </CCol>
          </CRow>

          {/* Shipping */}
          <CRow>
            <CCol className="text-body-secondary">
              Shipping
            </CCol>

            <CCol className="text-end">
              {shipping === 0 ? (
                <span className="text-success fw-semibold">
                  FREE
                </span>
              ) : (
                `₹${shipping.toLocaleString("en-IN")}`
              )}
            </CCol>
          </CRow>

          {/* Divider */}
          <div className="cart-summary-divider" />

          {/* Total */}
          <CRow className="align-items-center">

            <CCol>
              <span className="fw-bold">
                Total
              </span>

              <div className="small text-body-secondary">
                Inclusive of applicable charges
              </div>
            </CCol>

            <CCol className="text-end">
              <span className="fs-5 fw-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </CCol>

          </CRow>

        </div>

      </CCardBody>

    </CCard>
  );
}

export default CartSummary;