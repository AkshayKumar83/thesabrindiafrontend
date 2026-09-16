import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CContainer,
  CRow,
  CCol,
  CFormSelect,
  CButton,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilFilter } from "@coreui/icons";

import ProductCard from "../../../components/product/productcard/ProductCard";
import { useCart } from "../../../context/CartContext";
import FilterDrawer from "../../../layout/components/filterdrawer/Filter.jsx";

import { request } from "../../../services/api.js";
import { API_ROUTES } from "../../../config/api";

const SORT_OPTIONS = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
  {
    value: "name-asc",
    label: "Alphabetically: A-Z",
  },
];

export default function ProductCollection() {
  const { items } = useCart();

  // =========================================================
  // API STATE
  // =========================================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [filterOpen, setFilterOpen] = useState(false);

  const [inStockOnly, setInStockOnly] =
    useState(false);

  const [minPrice, setMinPrice] =
    useState(0);

  const [maxPrice, setMaxPrice] =
    useState(3700);

  const [sort, setSort] =
    useState("featured");

  // =========================================================
  // CART TOTAL
  // =========================================================

  const cartTotalQty = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.quantity || 0),
        0
      ),
    [items]
  );

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await request({
          method: "get",
          url: API_ROUTES.productVariants,
        });

        console.log(
          "Products API response:",
          response
        );

        // =====================================================
        // GET API ARRAY
        // =====================================================

        const apiProducts =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.variants)
            ? response.variants
            : [];

        // =====================================================
        // MAP API RESPONSE
        // =====================================================

        const formattedProducts =
          apiProducts.map((item) => {
            const price = Number(
              item.price
            );

            // Find ONLY primary image
            const primaryImage =
              item.images?.find(
                (image) =>
                  Number(
                    image.isPrimary
                  ) === 1
              )?.image_url || "";

            return {
              // Variant ID
              id: item.id,

              // Product ID
              productId:
                item.productId,

              // Variant name
              name: item.name,

              // Variant color
              color: item.color,

              // Price
              price,

              // Description
              description:
                item.description || "",

              // Primary image only
              image: primaryImage
                ? `http://localhost:8090${primaryImage}`
                : "",

              // Stock
              inStock:
                Number(item.inStock) > 0,

              // Actual stock quantity
              stockQuantity:
                Number(item.inStock),

              // Original API values
              isPrimary:
                item.isPrimary,

              createdAt:
                item.createdAt,

              updatedAt:
                item.updatedAt,

              // Parent product
              product: item.product,

              // SKU
              skuNo:
                item.product?.skuNo || "",

              // Keep images if needed later
              images:
                item.images || [],
            };
          });

        setProducts(
          formattedProducts
        );

        // =====================================================
        // SET INITIAL PRICE RANGE
        // =====================================================

        if (
          formattedProducts.length > 0
        ) {
          const prices =
            formattedProducts
              .map((product) =>
                Number(product.price)
              )
              .filter(
                (price) =>
                  !Number.isNaN(price)
              );

          if (prices.length > 0) {
            const minimumPrice =
              Math.floor(
                Math.min(...prices)
              );

            const maximumPrice =
              Math.ceil(
                Math.max(...prices)
              );

            setMinPrice(
              minimumPrice
            );

            setMaxPrice(
              maximumPrice
            );
          }
        }
      } catch (err) {
        console.error(
          "Product API error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err.message ||
            "Unable to load products."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================
  // PRICE BOUNDS
  // =========================================================

  const priceBounds = useMemo(() => {
    if (!products.length) {
      return {
        min: 0,
        max: 3700,
      };
    }

    const prices = products
      .map((product) =>
        Number(product.price)
      )
      .filter(
        (price) =>
          !Number.isNaN(price)
      );

    if (!prices.length) {
      return {
        min: 0,
        max: 3700,
      };
    }

    return {
      min: Math.floor(
        Math.min(...prices)
      ),
      max: Math.ceil(
        Math.max(...prices)
      ),
    };
  }, [products]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredProducts = useMemo(() => {
    let list = products.filter(
      (product) =>
        product.price >= minPrice &&
        product.price <= maxPrice
    );

    // In-stock filter
    if (inStockOnly) {
      list = list.filter(
        (product) =>
          product.inStock
      );
    }

    // Sorting
    switch (sort) {
      case "price-asc":
        list = [...list].sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-desc":
        list = [...list].sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "name-asc":
        list = [...list].sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );
        break;

      case "featured":
      default:
        break;
    }

    return list;
  }, [
    products,
    inStockOnly,
    minPrice,
    maxPrice,
    sort,
  ]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <CContainer
        fluid
        className="py-5 px-4"
        style={{
          backgroundColor:
            "#fdf6f1",
          minHeight: "60vh",
        }}
      >
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Loading sarees...
          </p>
        </div>
      </CContainer>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <CContainer
        fluid
        className="py-5 px-4"
        style={{
          backgroundColor:
            "#fdf6f1",
          minHeight: "60vh",
        }}
      >
        <div className="text-center py-5">
          <h5 className="mb-2">
            Unable to load products
          </h5>

          <p className="text-muted mb-3">
            {error}
          </p>

          <CButton
            color="dark"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </CButton>
        </div>
      </CContainer>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <CContainer
      fluid
      className="py-4 px-4"
      style={{
        backgroundColor:
          "#fdf6f1",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <CRow className="align-items-center mb-4">
        {/* Title */}

        <CCol>
          <h1
            className="h4 mb-0"
            style={{
              fontWeight: 600,
            }}
          >
            Sarees
          </h1>
        </CCol>

        {/* Filters */}

        <CCol xs="auto">
          <CButton
            color="dark"
            variant="outline"
            size="sm"
            className="d-flex align-items-center gap-1 px-2"
            onClick={() =>
              setFilterOpen(true)
            }
          >
            <CIcon
              icon={cilFilter}
              size="sm"
            />

            Filters
          </CButton>
        </CCol>

        {/* Sort */}

        <CCol
          xs="auto"
          className="d-flex align-items-center gap-2"
        >
          <span className="text-muted small">
            SORT BY:
          </span>

          <CFormSelect
            size="sm"
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value
              )
            }
            style={{
              width: 200,
            }}
          >
            {SORT_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={
                    option.value
                  }
                >
                  {option.label}
                </option>
              )
            )}
          </CFormSelect>
        </CCol>

        {/* Product count */}

        <CCol
          xs="auto"
          className="text-muted small"
        >
          {filteredProducts.length}{" "}
          products
        </CCol>
      </CRow>

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <CRow>
        <CCol>
          {filteredProducts.length ===
          0 ? (
            <div className="text-muted py-5 text-center">
              No products match these
              filters.
            </div>
          ) : (
            <CRow className="g-4 px-2">
              {filteredProducts.map(
                (product) => (
                  <CCol
                    key={product.id}
                    xs={12}
                    sm={4}
                    lg={3}
                  >
                    <ProductCard
                      product={product}
                    />
                  </CCol>
                )
              )}
            </CRow>
          )}
        </CCol>
      </CRow>

      {/* =====================================================
          FILTER DRAWER
      ===================================================== */}

      <FilterDrawer
        open={filterOpen}
        onClose={() =>
          setFilterOpen(false)
        }
        inStockOnly={inStockOnly}
        onInStockOnlyChange={
          setInStockOnly
        }
        minPrice={minPrice}
        maxPrice={maxPrice}
        priceBounds={priceBounds}
        onPriceChange={(
          min,
          max
        ) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        resultCount={
          filteredProducts.length
        }
      />
    </CContainer>
  );
}
