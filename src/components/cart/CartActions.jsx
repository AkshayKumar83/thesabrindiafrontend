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
import { useAuth } from "../../context/AuthContext";

function CartActions({
  onCheckout,
  onContinueShopping,
}) {
  const { items } = useCart();
  const { isLoggedIn, user, logout } = useAuth(); 
  

  return (
    <div className="d-flex flex-column gap-2 mt-3">

     {
      isLoggedIn
      ? (
      <> 
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
            style={{color: "var(--forest-dark)", border: "1px solid var(--forest-dark)"}}
            variant="ghost"
            onClick={onContinueShopping}
          >
            <CIcon
              icon={cilBasket}
              className="me-2"
            />
            Continue Shopping
          </CButton>
        </>
        )
        :
        (
          <CButton
            style={{background:"var(--forest)", color:"var(--paper)"}}
            size="lg"
            className="fw-semibold"
            onClick={onCheckout}
          >
            Please Login here to checkout
            <CIcon
              icon={cilArrowRight}
              className="ms-2"
            />
          </CButton>
        )
     }

    </div>
  );
}

export default CartActions;