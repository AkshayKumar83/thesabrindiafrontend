import React from "react";

import {
  CButton,
  CCard,
  CCardBody,
} from "@coreui/react";

import {
  cilCart,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

function CartEmpty({
  onContinueShopping,
}) {
  return (
    <CCard className="border-0">

      <CCardBody className="py-5">

        <div className="d-flex flex-column align-items-center text-center gap-3">

          <div className="empty-cart-icon">
            <CIcon
              icon={cilCart}
              size="3xl"
            />
          </div>

          <div>
            <h5 className="fw-bold mb-2">
              Your cart is empty
            </h5>

            <p className="text-body-secondary mb-0">
              Looks like you haven't added
              anything to your cart yet.
            </p>
          </div>

          <CButton
            style={{background:"var(--forest)", color:"var(--paper)"}}
            onClick={onContinueShopping}
          >
            Continue Shopping
          </CButton>

        </div>

      </CCardBody>

    </CCard>
  );
}

export default CartEmpty;