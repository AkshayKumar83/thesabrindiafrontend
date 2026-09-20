// ProductList.jsx
import React, { useRef, useState, useEffect } from "react";
import { CContainer, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilChevronLeft, cilChevronRight } from "@coreui/icons";
import ProductCard from "../productcard/ProductCard";
import "./ProductList.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductByCategoryApi } from "../../../services/order.api";
import { API_BASE_IMAGE_URL } from "../../../config/api";
import { useNavigate } from "react-router-dom";
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
];

const ProductList = ({categoryName="Chiffon Saree"}) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 5);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 5
    );
  };
  const loadCategoryProducts = async()=>{
    setLoading(true);
    try {
      const data = await getProductByCategoryApi(categoryName);
      const formattedProducts =
          data?.variants.map((item) => {
            const price = Number(
              item.price
            );
            const primaryImage =
              item.images?.find(
                (image) =>
                  Number(
                    image.isPrimary
                  ) === 1
              )?.image_url || "";
            return {
              id: item.id,
              productId:item?.product?.id,
              name: item.name,
              color: item.color,
              price,
              description:
                item?.description || "",
              image: primaryImage
                ? `${API_BASE_IMAGE_URL}${primaryImage}`
                : "",
              inStock:
                Number(item.inStock) > 0,
              stockQuantity:
                Number(item.inStock),
              isPrimary:
                item.isPrimary,
              createdAt:
                item.createdAt,
              product: item.product,
              skuNo:
                item.product?.skuNo || "",
              images:
                item.images || [],
            };
          });
      setProducts(formattedProducts ?? []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("fetch product by category",error);
      throw error;
    }
  }
  useEffect(() => {
    updateArrows();
    loadCategoryProducts();
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
        <h2 className="product-list-title">New Launches {categoryName}</h2>

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
          <CButton shape="rounded-pill" className="product-list-view-all" onClick={()=>{navigate(`/collections?category=${categoryName}`),window.scrollTo(0, 0)}}>
            View All
          </CButton>
        </div>
      </CContainer>
    </section>
  );
};

export default ProductList;