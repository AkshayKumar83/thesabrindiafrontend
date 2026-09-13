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
  CInputGroup,
} from "@coreui/react";
import { cilMinus, cilPlus, cilStar, cilCart } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useCart } from "../../context/CartContext";

const ProductCard = memo(({ product }) => {
  const { items, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const formattedPrice = product.price.toLocaleString("en-IN");
  const formattedOriginalPrice = product.originalPrice?.toLocaleString("en-IN");

  return (
    <CCard className="h-100 border-0 shadow-sm">
      <div className="position-relative">
           <div style={{ aspectRatio: "300 / 320" }}>
                <CCardImage src={product.image} alt={product.name} className="object-fit-cover h-100 w-100" />
            </div>
        {product.discount && (
          <CBadge
            color="danger"
            shape="rounded-pill"
            className="position-absolute top-0 start-0 m-2"
          >
            {product.discount}% OFF
          </CBadge>
        )}

        {product.tag && (
          <CBadge
            color="dark"
            shape="rounded-pill"
            className="position-absolute top-0 end-0 m-2"
          >
            {product.tag}
          </CBadge>
        )}
      </div>

      <CCardBody className="d-flex flex-column">
        <CCardTitle className="fs-6 fw-bold text-truncate">
          {product.name}
        </CCardTitle>

        <CCardText className="text-body-secondary small">
          {product.description}
        </CCardText>

        <div className="d-flex align-items-center mb-2">
          <CIcon icon={cilStar} className="text-warning me-1" />
          <span className="small fw-semibold">
            {product.rating?.toFixed(1) || "0.0"}
          </span>
          {product.reviews !== undefined && (
            <span className="text-body-secondary small ms-1">
              ({product.reviews})
            </span>
          )}
        </div>

        <div className="d-flex align-items-baseline gap-2 mb-3 mt-auto">
          <span className="fs-5 fw-bold text-primary">₹{formattedPrice}</span>
          {product.originalPrice && (
            <span className="text-body-secondary text-decoration-line-through small">
              ₹{formattedOriginalPrice}
            </span>
          )}
        </div>

        {quantity === 0 ? (
          <CButton
            color="primary"
            className="w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => addToCart(product)}
          >
            <CIcon icon={cilCart} />
            Add to Cart
          </CButton>
        ) : (
          <CInputGroup>
            <CButton
              color="primary"
              variant="outline"
              onClick={() => decreaseQuantity(product.id)}
              aria-label="Decrease quantity"
            >
              <CIcon icon={cilMinus} />
            </CButton>

            <CFormInput
              className="text-center fw-bold"
              value={quantity}
              readOnly
              aria-label="Product quantity"
            />

            <CButton
              color="primary"
              variant="outline"
              onClick={() => increaseQuantity(product.id)}
              aria-label="Increase quantity"
            >
              <CIcon icon={cilPlus} />
            </CButton>
          </CInputGroup>
        )}
      </CCardBody>
    </CCard>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;