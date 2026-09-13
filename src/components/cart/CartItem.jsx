import React from "react";

import {
  CBadge,
  CButton,
  CCardImage,
  CCol,
  CFormInput,
  CInputGroup,
  CListGroupItem,
  CRow,
} from "@coreui/react";

import {
  cilMinus,
  cilPlus,
  cilTrash,
} from "@coreui/icons";

import CIcon from "@coreui/icons-react";

import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const itemTotal = item.price * item.quantity;

  return (
    <CListGroupItem className="cart-item px-0 py-3">
      <CRow className="align-items-center g-3">

        {/* Image */}
        <CCol xs="3">
          <CCardImage
            src={item.image}
            className="cart-product-image"
          />
        </CCol>

        {/* Details */}
        <CCol xs="9">

          {/* Replaced CStack */}
          <div className="d-flex flex-column gap-2">

            {/* Name + Delete */}
            <div className="d-flex justify-content-between align-items-start">

              <div className="pe-2">
                <div className="fw-semibold cart-product-name">
                  {item.name}
                </div>

                <div className="small text-body-secondary">
                  ₹{item.price.toLocaleString("en-IN")} each
                </div>
              </div>

              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                className="cart-remove-button"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </div>

            {/* Quantity + Total */}
            <div className="d-flex justify-content-between align-items-center">

              <CInputGroup
                size="sm"
                className="cart-quantity-control"
              >
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => decreaseQuantity(item.id)}
                  aria-label="Decrease quantity"
                >
                  <CIcon icon={cilMinus} />
                </CButton>

                <CFormInput
                  value={item.quantity}
                  readOnly
                  className="text-center"
                  aria-label="Product quantity"
                />

                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => increaseQuantity(item.id)}
                  aria-label="Increase quantity"
                >
                  <CIcon icon={cilPlus} />
                </CButton>
              </CInputGroup>

              <CBadge
                color="light"
                textColor="dark"
                className="cart-item-total"
              >
                ₹{itemTotal.toLocaleString("en-IN")}
              </CBadge>

            </div>
          </div>

        </CCol>
      </CRow>
    </CListGroupItem>
  );
}

export default CartItem;