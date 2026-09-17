import React from "react";

import {
  CBadge,
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CListGroup,
} from "@coreui/react";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartActions from "./CartActions";
import CartEmpty from "./CartEmpty";

import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function DesktopCart({
  visible,
  onClose,
}) {

const navigate = useNavigate();


  const {
    items,
    totalItems,
  } = useCart();

  return (
    <COffcanvas
      placement="end"
      visible={visible}
      onHide={onClose}
      className="desktop-cart"
      scroll
      backdrop
    >
      {/* Header */}
      <COffcanvasHeader className="border-bottom">

        <div className="d-flex align-items-center gap-2">
          <COffcanvasTitle className="mb-0">
            Your Cart
          </COffcanvasTitle>

          {totalItems > 0 && (
            <CBadge
              color="primary"
              shape="rounded-pill"
            >
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </CBadge>
          )}
        </div>

        <CCloseButton
          onClick={onClose}
          aria-label="Close cart"
        />

      </COffcanvasHeader>

      {/* Body */}
      <COffcanvasBody className="d-flex flex-column">

        {items.length === 0 ? (
          <CartEmpty
            onContinueShopping={onClose}
          />
        ) : (
          <>
            {/* Items */}
            <div className="flex-grow-1 cart-items-container">

              <CListGroup flush>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </CListGroup>

            </div>

            {/* Bottom section */}
            <div className="cart-bottom-section">

              <CartSummary />

              <CartActions
                onCheckout={() => {
                  console.log(
                    "Proceed to checkout"
                  );
                  onClose();
                  navigate("/checkout");
                }}
                
                onContinueShopping={onClose}
              />

            </div>
          </>
        )}

      </COffcanvasBody>
    </COffcanvas>
  );
}

export default DesktopCart;