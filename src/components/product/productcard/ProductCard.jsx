// ProductCard.jsx
import React, { memo } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CFormInput,
} from "@coreui/react";
import { cilMinus, cilPlus, cilCart } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useCart } from "../../../context/CartContext";
import "./ProductCard.css";

const ProductCard = memo(({ product }) => {
  console.log("Product Card :::>>", product);
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const formattedPrice = product.price.toLocaleString("en-IN");
  const formattedOriginalPrice =
    product.originalPrice?.toLocaleString("en-IN");

  return (
    <CCard className="product-card border-0">
      <div className="product-card-image-wrap">
        <CCardImage
          src={product.image}
          alt={product.name}
          className="product-card-image"
        />

        {product.discount && (
          <CBadge
            shape="rounded-pill"
            className="product-badge badge-discount"
          >
            {product.discount}% OFF
          </CBadge>
        )}

        {product.tag && (
          <CBadge shape="rounded-pill" className="product-badge badge-tag">
            {product.tag}
          </CBadge>
        )}

        <div className="product-card-overlay">
          {quantity === 0 ? (
            <CButton
              className="product-add-btn"
              onClick={() => addToCart(product)}
            >
              <CIcon icon={cilCart} />
              <span>Add to Cart</span>
            </CButton>
          ) : (
            <div className="product-qty-group">
              <CButton
                className="product-qty-btn"
                onClick={() => decreaseQuantity(product.id)}
                aria-label="Decrease quantity"
              >
                <CIcon icon={cilMinus} />
              </CButton>

              <CFormInput
                className="product-qty-input text-center fw-bold"
                value={quantity}
                readOnly
                aria-label="Product quantity"
              />

              <CButton
                className="product-qty-btn"
                onClick={() => increaseQuantity(product.id)}
                aria-label="Increase quantity"
              >
                <CIcon icon={cilPlus} />
              </CButton>
            </div>
          )}
        </div>
      </div>

      <CCardBody className="product-card-body">
        <CCardTitle className="product-card-title">
          {product.name}
        </CCardTitle>

        <CCardText className="product-card-desc">
          {product.description}
        </CCardText>

        <div className="product-price-row">
          <span className="product-price">₹{formattedPrice}</span>

          {product.originalPrice && (
            <span className="product-price-original">
              ₹{formattedOriginalPrice}
            </span>
          )}
        </div>
      </CCardBody>
    </CCard>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;