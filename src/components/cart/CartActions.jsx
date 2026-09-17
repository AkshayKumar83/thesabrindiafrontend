import React from "react";

import {
  CButton,
} from "@coreui/react";

import {
  cilArrowRight,
  cilBasket,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import { useCart } from "../../context/CartContext";

function CartActions({
  onCheckout,
  onContinueShopping,
}) {
  const { items } = useCart();

  return (
    <div className="d-flex flex-column gap-2 mt-3">

      <CButton
      
        style={{background:"var(--forest)", color:"var(--paper)"}}
        size="lg"
        className="fw-semibold"
        disabled={items.length === 0}
        onClick={onCheckout}
      >
        Proceed to Checkout

        <CIcon
          icon={cilArrowRight}
          className="ms-2"
        />
      </CButton>

      <CButton
        color="danger"
        variant="ghost"
        onClick={onContinueShopping}
      >
        <CIcon
          icon={cilBasket}
          className="me-2"
        />

        Continue Shopping
      </CButton>

    </div>
  );
}

export default CartActions;