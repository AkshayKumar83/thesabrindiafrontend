import React from "react";

import {
  CBadge,
  CButton,
} from "@coreui/react";

import {
  cilCart,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import { useCart } from "../../context/CartContext";

function CartButton({ onClick }) {
  const { totalItems } = useCart();

  return (
    <CButton
      color="light"
      className="cart-button position-relative border-0"
      onClick={onClick}
      aria-label="Open shopping cart"
    >
      <CIcon
        icon={cilCart}
        size="lg"
      />

      {totalItems > 0 && (
        <CBadge
          color="danger"
          shape="rounded-pill"
          className="cart-badge"
        >
          {totalItems > 99
            ? "99+"
            : totalItems}
        </CBadge>
      )}
    </CButton>
  );
}

export default CartButton;