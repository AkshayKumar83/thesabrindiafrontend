import React, { useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CBadge,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilLocationPin,
  cilTruck,
  cilShieldAlt,
  cilClock,
  cilShareAlt,
  cilEnvelopeClosed,
  cilPlus,
  cilMinus,
} from "@coreui/icons";
import PromoBanner from "../promo/PromoBanner";

// Replace these with your actual product images
const MAIN_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://sutisancha.com/cdn/shop/files/BlackYellowWhiteSimpleFoldedPaperNotesBookDescriptionInstagrampost_1587x2280px_-2026-04-11T173828.561.jpg?v=1776072154&width=300",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
];

const SIMILAR_PRODUCTS = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://sutisancha.com/cdn/shop/files/BlackYellowWhiteSimpleFoldedPaperNotesBookDescriptionInstagrampost_1587x2280px_-2026-04-11T173828.561.jpg?v=1776072154&width=300",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
];

const PRODUCT = {
  title: "Regal Split Elegance Handloom Tissue Cotton Saree",
  sku: "TR198",
  price: 1879,
  mrp: 2949,
  inStock: true,
  maxQty: 5,
};

function formatINR(n) {
  return `₹ ${n.toLocaleString("en-IN")}.00 INR`;
}

const CartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ProductDetails = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(PRODUCT.maxQty, q + 1));

  return (
    <CContainer fluid className="overflow-x-hidden p-4">
    <CRow className="g-4 mx-0 p-3">
      {/* ---------- Left: Image gallery (vertical thumbnail rail + main image) ---------- */}
      <CCol xs={12} lg={6}>
        <div className="d-flex" style={{ gap: "45px" }}>
          {/* Vertical thumbnail rail - bordered box, same style as Similar Product */}
          <div
            className="position-relative rounded p-3 flex-shrink-0"
            style={{
              border: "1px solid var(--forest, #2f5233)",
              marginTop: "14px",
            }}
          >
            <span
              className="position-absolute text-white small fw-semibold px-3 py-1 rounded-pill"
              style={{
                backgroundColor: "var(--forest, #2f5233)",
                top: "-14px",
                left: "16px",
                letterSpacing: "0.04em",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
              }}
            >
              GALLERY
            </span>
            <div
              className="d-flex flex-column gap-3"
              style={{ maxHeight: 560, overflowY: "auto" }}
            >
              {MAIN_IMAGES.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt={`${PRODUCT.title} thumbnail ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className="rounded-1"
                  style={{
                    width: 70,
                    height: 90,
                    objectFit: "cover",
                    cursor: "pointer",
                    flexShrink: 0,
                    border: activeImage === i ? "2px solid #c0392b" : "1px solid #dee2e6",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main image - no outer pill border */}
          <div className="border position-relative flex-grow-1" style={{ minWidth: 0 }}>
            <img
              src={MAIN_IMAGES[activeImage]}
              alt={PRODUCT.title}
              className="w-100 h-100"
              style={{ objectFit: "cover", aspectRatio: "3 / 4" }}
            />
          </div>
        </div>

        {/* Trust badges - fills the leftover space under the gallery */}
        <div className="d-flex justify-content-around align-items-center mt-4 pt-3">
          {[
            { icon: "🍃", label: "Breathable" },
            { icon: "💎", label: "Premium" },
            { icon: "🧵", label: "Artisanal" },
          ].map((badge) => (
            <div key={badge.label} className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: "var(--forest, #2f5233)",
                  fontSize: "1.1rem",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                }}
              >
                {badge.icon}
              </div>
              <span className="small text-muted">{badge.label}</span>
            </div>
          ))}
        </div>
      </CCol>

      {/* ---------- Right: Product info ---------- */}
      <CCol xs={12} lg={6} style={{padding:"30px"}}>
        <h4 className="mb-1">{PRODUCT.title}</h4>
        <div className="text-muted small mb-2">SKU: {PRODUCT.sku}</div>

        <div className="mb-1">
          <span className="fw-semibold fs-5 me-2" style={{color: "var(--forest, #2f5233)",}}>
            {formatINR(PRODUCT.price)}
          </span>
          <span className="text-muted text-decoration-line-through">
            {formatINR(PRODUCT.mrp)}
          </span>
        </div>
        <div className="text-muted small mb-3">Inclusive of all taxes.</div>

        {/* Similar products strip */}
        <div
          className="position-relative rounded p-3 mb-3"
          style={{
            border: "1px solid var(--forest, #2f5233)",
            marginTop: "14px",
          }}
        >
          <span
            className="position-absolute text-white small fw-semibold px-3 py-1 rounded-pill"
            style={{
              backgroundColor: "var(--forest, #2f5233)",
              top: "-14px",
              left: "16px",
              letterSpacing: "0.04em",
              boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            }}
          >
            SIMILAR PRODUCT
          </span>
          <div className="d-flex gap-2 overflow-auto pt-2 pb-1">
            {SIMILAR_PRODUCTS.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt={`Similar product ${i + 1}`}
                style={{
                  width: 64,
                  height: 80,
                  objectFit: "cover",
                  flex: "0 0 auto",
                  cursor: "pointer",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                className="border rounded-1"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            ))}
          </div>
        </div>

        {/* Buy button / Sold out */}
        {PRODUCT.inStock ? (
          <div className="d-flex align-items-stretch gap-2 mb-3">
            <div
              className="d-flex align-items-center rounded-3 overflow-hidden"
              style={{ flex: "0 0 auto", border: "1px solid var(--forest, #2f5233)",  }}
              
            >
              <button
                onClick={decrease}
                disabled={qty <= 1}
                className="btn d-flex align-items-center justify-content-center border-0"
                style={{ width: 40, height: "100%" }}
                aria-label="Decrease quantity"
              >
                <CIcon icon={cilMinus} size="sm" />
              </button>
              <span
                className="fw-semibold px-3"
                style={{ minWidth: 32, textAlign: "center" }}
              >
                {qty}
              </span>
              <button
                onClick={increase}
                disabled={qty >= PRODUCT.maxQty}
                className="btn d-flex align-items-center justify-content-center border-0"
                style={{ width: 40, height: "100%" }}
                aria-label="Increase quantity"
              >
                <CIcon icon={cilPlus} size="sm" />
              </button>
            </div>

            <CButton
              className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 text-white fw-semibold border-0"
              size="lg"
              style={{
                background: "linear-gradient(135deg, #2f5233, #922b21)",
                letterSpacing: "0.03em",
                boxShadow: "0 4px 10px rgba(192,57,43,0.35)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(192,57,43,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(192,57,43,0.35)";
              }}
            >
              <CartIcon />
              ADD TO CART
            </CButton>
          </div>
        ) : (
          <CButton
            variant="outline"
            color="danger"
            className="w-100 mb-3"
            size="lg"
            disabled
          >
            SOLD OUT
          </CButton>
        )}

        {/* Shipping / trust info */}
        <div className="bg-light rounded p-3 mb-3 small">
          <div className="d-flex align-items-start gap-2 mb-2">
            <CIcon icon={cilLocationPin} className="mt-1" />
            <span>Free Shipping On Domestic Orders Above Rs. 2000/-</span>
          </div>
          <div className="d-flex align-items-start gap-2 mb-2">
            <CIcon icon={cilTruck} className="mt-1" />
            <span>
              2-7 Days Delivery Within India.{" "}
              <a href="#" className="text-danger">*Learn More</a>
            </span>
          </div>
          <div className="d-flex align-items-start gap-2 mb-2">
            <CIcon icon={cilShieldAlt} className="mt-1" />
            <span>
              100% Money Back Guarantee.{" "}
              <a href="#" className="text-danger">*Learn More</a>
            </span>
          </div>
          <div className="d-flex align-items-start gap-2">
            <CIcon icon={cilClock} className="mt-1" />
            <span>
              Returns Accepted Within 7 Days Of Delivery.{" "}
              <a href="#" className="text-danger">*Learn More</a>
            </span>
          </div>
        </div>

        {/* Accordion sections */}
        <CAccordion
          flush
          style={{
            "--cui-accordion-active-bg": "#2f5233",
            "--cui-accordion-active-color": "#ffffff",
            "--cui-accordion-btn-focus-box-shadow": "none",
            "--cui-accordion-btn-active-icon":
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e\")",
          }}
        >
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>Description</CAccordionHeader>
            <CAccordionBody>
              A handloom tissue cotton saree finished with a split-elegance
              silhouette, soft drape, and a lightweight tissue-cotton blend
              suited for both daywear and evening occasions.
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={2}>
            <CAccordionHeader>Return &amp; Exchange</CAccordionHeader>
            <CAccordionBody>
              Returns are accepted within 7 days of delivery, provided the
              product is unused and in its original packaging.
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={3}>
            <CAccordionHeader>Shipping &amp; Delivery</CAccordionHeader>
            <CAccordionBody>
              Orders are dispatched within 1-2 business days and delivered
              within 2-7 days across India.
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={4}>
            <CAccordionHeader>Importer/Marketer/Packer Details</CAccordionHeader>
            <CAccordionBody>
              Packed and marketed in India. Full details available on request.
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>

        {/* Share row */}
        <div className="d-flex align-items-center gap-3 mt-3 text-muted small">
          <span>SHARE</span>
          <CIcon icon={cilEnvelopeClosed} />
          <CIcon icon={cilShareAlt} />
        </div>
      </CCol>
    </CRow>
    </CContainer>
  );
};

export default ProductDetails;