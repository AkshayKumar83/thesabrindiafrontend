import React, {
  useEffect,
  useMemo,
  useRef,
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
import { API_BASE_IMAGE_URL, API_ROUTES } from "../../../config/api";
import { useSearchParams } from "react-router-dom";
import './ProductCollection.css';
import CustomDropdown from "../../components/dropdown/CustomDropdown.jsx";

const SORT_OPTIONS = [
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

  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Example:
   * /shop?category=Silk
   *
   * or:
   * /shop?category=4
   */
  const category = searchParams.get("category");

  // API state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3700);
  const [sort, setSort] = useState("featured");

  // Cart total
  const cartTotalQty = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ),
    [items]
  );

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await request({
          method: "get",
          url: API_ROUTES.productVariants,
        });

        console.log("Products API response:", response);

        const apiProducts =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.variants)
            ? response.variants
            : [];

        const formattedProducts = apiProducts.map((item) => {
          const price = Number(item.price);

          const primaryImage =
            item.images?.find(
              (image) => Number(image.isPrimary) === 1
            )?.image_url || "";

          return {
            // Variant information
            id: item.id,
            productId: item.productId,
            name: item.name,
            color: item.color,
            price,
            description: item.description || "",

            image: primaryImage
              ? `${API_BASE_IMAGE_URL}${primaryImage}`
              : "",

            inStock: Number(item.inStock) > 0,
            stockQuantity: Number(item.inStock),

            isPrimary: item.isPrimary,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,

            // Images
            images: item.images || [],

            // Parent product
            product: item.product,

            // Category information
            categoryId: item.product?.categoryId ?? null,

            // This will work when backend sends:
            // product: {
            //   category: {
            //     name: "Silk"
            //   }
            // }
            categoryName:
              item.product?.category?.name || "",

            // Other product information
            skuNo: item.product?.skuNo || "",
          };
        });
        console.log("Formatedd products :>>", formattedProducts)
        setProducts(formattedProducts);

        // Set price bounds
        if (formattedProducts.length > 0) {
          const prices = formattedProducts
            .map((product) => Number(product.price))
            .filter((price) => !Number.isNaN(price));

          if (prices.length > 0) {
            setMinPrice(Math.floor(Math.min(...prices)));
            setMaxPrice(Math.ceil(Math.max(...prices)));
          }
        }
      } catch (err) {
        console.error("Product API error:", err);

        setError(
          err?.response?.data?.message ||
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

  // Price bounds
  const priceBounds = useMemo(() => {
    if (!products.length) {
      return {
        min: 0,
        max: 3700,
      };
    }

    const prices = products
      .map((product) => Number(product.price))
      .filter((price) => !Number.isNaN(price));

    if (!prices.length) {
      return {
        min: 0,
        max: 3700,
      };
    }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  /*
   * FILTER + SORT
   *
   * Order:
   *
   * 1. Category
   * 2. Stock
   * 3. Price range
   * 4. Sorting
   */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // --------------------------------
    // 1. CATEGORY FILTER
    // --------------------------------
    console.log("CAtegory filter ::>", category);
    if (category) {
      const selectedCategory = String(category)
        .trim()
        .toLowerCase();

      list = list.filter((product) => {
        const productCategoryId = String(
          product.categoryId ?? ""
        )
          .trim()
          .toLowerCase();

        const productCategoryName = String(
          product.categoryName ?? ""
        )
          .trim()
          .toLowerCase();
        console.log(product, productCategoryName, productCategoryId === selectedCategory ,
          productCategoryName === selectedCategory);
        /*
         * Supports both:
         *
         * ?category=4
         *
         * and
         *
         * ?category=Silk
         */
        return (
          productCategoryId === selectedCategory ||
          productCategoryName === selectedCategory
        );
      });
    }
    console.log("List::>>", list);
    // --------------------------------
    // 2. STOCK FILTER
    // --------------------------------
    if (inStockOnly) {
      list = list.filter(
        (product) => product.inStock
      );
    }

    // --------------------------------
    // 3. PRICE FILTER
    // --------------------------------
    list = list.filter(
      (product) =>
        product.price >= minPrice &&
        product.price <= maxPrice
    );

    // --------------------------------
    // 4. SORTING
    // --------------------------------
    switch (sort) {
      case "price-asc":
        list.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price-desc":
        list.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "name-asc":
        list.sort((a, b) =>
          a.name.localeCompare(
            b.name,
            undefined,
            {
              sensitivity: "base",
            }
          )
        );
        break;

      case "featured":
      default:
        /*
         * Keep API order for featured.
         * No category priority is applied here
         * because category is already a filter.
         */
        break;
    }

    return list;
  }, [
    products,
    category,
    inStockOnly,
    minPrice,
    maxPrice,
    sort,
  ]);

  const handleClearFilters = () => {
    setInStockOnly(false);
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setSort("featured");

    searchParams.delete("category");
    setSearchParams(searchParams);
  };
  


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
            {category ? category : 'Sarees'}
          </h1>
        </CCol>

        {/* Filters */}

        <CCol xs="auto">
          <CButton
            size="sm"
            className="d-flex align-items-center gap-1 px-2 drawerFilterBtn"
            onClick={handleClearFilters}
          >
            <CIcon
              icon={cilFilter}
              size="sm"
            />

            Clear Filters
          </CButton>
        </CCol>

        {/* Filters */}

        <CCol xs="auto">
          <CButton
            size="sm"
            className="d-flex align-items-center gap-1 px-2 drawerFilterBtn"
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
            className="sort-control d-flex align-items-center gap-2"
          >
            <span className="sort-label">
              SORT BY:
            </span>

            <div style={{width:"200px"}}>
            <CustomDropdown
              options={SORT_OPTIONS}
              label={'label'}
              value={sort}
              onChange={setSort}
            />
            </div>
          </CCol>

        {/* Product count */}

        <CCol
          xs="auto"
          className="text-muted medium"
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





