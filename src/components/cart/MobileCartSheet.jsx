import React from "react";

import {
  CBadge,
  CCloseButton,
  CListGroup,
} from "@coreui/react";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartActions from "./CartActions";
import CartEmpty from "./CartEmpty";

import { useCart } from "../../context/CartContext";

function MobileCartSheet({
  visible,
  onClose,
}) {
  const {
    items,
    totalItems,
  } = useCart();

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="mobile-cart-backdrop"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="mobile-cart-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >

        {/* Drag handle */}
        <div className="mobile-cart-handle" />

        {/* Header */}
        <div className="mobile-cart-header">

          <div className="d-flex align-items-center gap-2">

            <h5 className="mb-0 fw-bold">
              Your Cart
            </h5>

            {totalItems > 0 && (
              <CBadge
                color="primary"
                shape="rounded-pill"
              >
                {totalItems}
              </CBadge>
            )}

          </div>

          <CCloseButton
            onClick={onClose}
            aria-label="Close cart"
          />

        </div>

        {/* Content */}
        <div className="mobile-cart-content">

          {items.length === 0 ? (
            <CartEmpty
              onContinueShopping={onClose}
            />
          ) : (
            <>

              <CListGroup flush>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </CListGroup>

              <div className="mobile-cart-summary">

                <CartSummary />

                <CartActions
                  onCheckout={() => {
                    console.log(
                      "Proceed to checkout"
                    );
                  }}
                  onContinueShopping={onClose}
                />

              </div>

            </>
          )}

        </div>

      </div>
    </>
  );
}

export default MobileCartSheet;