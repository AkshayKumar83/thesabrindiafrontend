// ProductList.jsx
import React, { useRef, useState, useEffect } from "react";
import { CContainer, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilChevronLeft, cilChevronRight } from "@coreui/icons";
import ProductCard from "../productcard/ProductCard";
import "./ProductList.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: "oyy8s4",
    name: "Gulnaar Silk Saree",
    price: 8900,
    originalPrice: 10900,
    discount: 18,
    description: "Handwoven tussar silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "New arrival",
  },
  {
    id: "neelambari-cotton",
    name: "Neelambari Cotton",
    price: 3600,
    originalPrice: 4500,
    discount: 20,
    description: "Soft kala cotton",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Everyday edit",
  },
  {
    id: "mogra-organza",
    name: "Mogra Organza",
    price: 6200,
    originalPrice: 7800,
    discount: 21,
    description: "Lightweight silk organza",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Bestseller",
  },
  {
    id: "gulabi-banarasi",
    name: "Gulabi Banarasi",
    price: 7800,
    originalPrice: 9500,
    discount: 18,
    description: "Rich handwoven Banarasi silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Festive edit",
  },
  {
    id: "chandni-chanderi",
    name: "Chandni Chanderi",
    price: 5200,
    originalPrice: 6500,
    discount: 20,
    description: "Elegant handloom Chanderi silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "New arrival",
  },
  {
    id: "meher-kanjeevaram",
    name: "Meher Kanjeevaram",
    price: 12500,
    originalPrice: 15000,
    discount: 17,
    description: "Traditional Kanjeevaram silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Premium",
  },
  {
    id: "gulmohar-linen",
    name: "Gulmohar Linen",
    price: 4200,
    originalPrice: 5200,
    discount: 19,
    description: "Breathable linen handloom",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Summer edit",
  },
  {
    id: "noor-tissue",
    name: "Noor Tissue Silk",
    price: 6900,
    originalPrice: 8500,
    discount: 19,
    description: "Shimmering tissue silk",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    tag: "Party wear",
  },
];

const ProductList = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 5);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 5
    );
  };

  useEffect(() => {
    updateArrows();
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      container.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.firstChild;
    const cardWidth = card ? card.offsetWidth + 24 : 300;
    container.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="product-list-section">
      <CContainer>
        <h2 className="product-list-title">New Launches</h2>

        <div className="product-list-wrapper">
          {canScrollLeft && <button
            type="button"
            className={`product-list-arrow arrow-left ${
              !canScrollLeft ? "is-disabled" : ""
            }`}
            onClick={() => scroll("left")}
            aria-label="Previous products"
            disabled={!canScrollLeft}
          >
            <ChevronLeft />
          </button>}

          <div className="product-list-scroll" ref={scrollRef}>
            {products.map((product) => (
              <div className="product-list-item" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {canScrollRight && <button
            type="button"
            className={`product-list-arrow arrow-right ${
              !canScrollRight ? "is-disabled" : ""
            }`}
            onClick={() => scroll("right")}
            aria-label="Next products"
            disabled={!canScrollRight}
          >
            <ChevronRight />
          </button>}
        </div>

        <div className="text-center mt-4">
          <CButton shape="rounded-pill" className="product-list-view-all">
            View All
          </CButton>
        </div>
      </CContainer>
    </section>
  );
};

export default ProductList;