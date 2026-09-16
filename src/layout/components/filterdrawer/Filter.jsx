import React, { useEffect, useState } from "react";
import {
  CButton,
  CFormInput,
  CFormRange,
  CFormSwitch,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from "@coreui/react";

import "./Filter.css";

export default function FilterDrawer({
  open,
  onClose,

  inStockOnly,
  onInStockOnlyChange,

  minPrice,
  maxPrice,

  priceBounds = {
    min: 0,
    max: 4000,
  },

  onPriceChange,
  resultCount,
  onApply,
}) {
  const [draftInStock, setDraftInStock] =
    useState(inStockOnly);

  const [draftMin, setDraftMin] =
    useState(minPrice);

  const [draftMax, setDraftMax] =
    useState(maxPrice);

  // Collapsible sections
  const [availabilityOpen, setAvailabilityOpen] =
    useState(true);

  const [priceOpen, setPriceOpen] =
    useState(true);

  // Sync values whenever drawer opens
  useEffect(() => {
    if (open) {
      setDraftInStock(inStockOnly);
      setDraftMin(minPrice);
      setDraftMax(maxPrice);
    }
  }, [
    open,
    inStockOnly,
    minPrice,
    maxPrice,
  ]);

  const handleApply = () => {
    onInStockOnlyChange?.(draftInStock);

    onPriceChange?.(
      draftMin,
      draftMax
    );

    onApply?.();

    onClose?.();
  };

  const handleMinChange = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) return;

    const newMin = Math.max(
      priceBounds.min,
      Math.min(number, draftMax)
    );

    setDraftMin(newMin);
  };

  const handleMaxChange = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) return;

    const newMax = Math.min(
      priceBounds.max,
      Math.max(number, draftMin)
    );

    setDraftMax(newMax);
  };

  return (
    <COffcanvas
      placement="start"
      visible={open}
      onHide={onClose}
      backdrop={true}
      scroll={false}
      className="filter-drawer"
      aria-labelledby="filter-drawer-title"
    >
      {/* =========================
          HEADER
      ========================= */}
      <COffcanvasHeader className="filter-drawer-header">
        <COffcanvasTitle
          id="filter-drawer-title"
          className="filter-drawer-title"
        >
          Filters
        </COffcanvasTitle>

        <button
          type="button"
          className="filter-close-btn"
          onClick={onClose}
          aria-label="Close filters"
        >
          ×
        </button>
      </COffcanvasHeader>

      {/* =========================
          BODY
      ========================= */}
      <COffcanvasBody className="filter-drawer-body">

        {/* =========================
            AVAILABILITY
        ========================= */}
        <section className="filter-section">

          <button
            type="button"
            className="filter-section-header filter-section-toggle"
            onClick={() =>
              setAvailabilityOpen(
                (prev) => !prev
              )
            }
            aria-expanded={availabilityOpen}
          >
            <span className="filter-section-title">
              Availability
            </span>

            <span
              className={`filter-section-arrow ${
                availabilityOpen
                  ? "open"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>

          {availabilityOpen && (
            <div className="filter-switch-row">

              <CFormSwitch
                id="filter-in-stock"
                checked={draftInStock}
                onChange={(event) =>
                  setDraftInStock(
                    event.target.checked
                  )
                }
              />

              <label
                htmlFor="filter-in-stock"
                className="filter-switch-label"
              >
                In stock only
              </label>

            </div>
          )}

        </section>


        {/* =========================
            PRICE
        ========================= */}
        <section className="filter-section">

          <button
            type="button"
            className="filter-section-header filter-section-toggle"
            onClick={() =>
              setPriceOpen(
                (prev) => !prev
              )
            }
            aria-expanded={priceOpen}
          >
            <span className="filter-section-title">
              Price
            </span>

            <span
              className={`filter-section-arrow ${
                priceOpen
                  ? "open"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>


          {priceOpen && (
            <>

              {/* Range */}
              <div className="filter-range-wrapper">
                <CFormRange
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={50}
                  value={draftMax}
                  onChange={(event) =>
                    handleMaxChange(
                      event.target.value
                    )
                  }
                  className="filter-range"
                />
              </div>


              {/* Min / Max */}
              <div className="filter-price-inputs">

                {/* Minimum */}
                <div className="filter-price-input">

                  <span className="filter-currency">
                    ₹
                  </span>

                  <CFormInput
                    type="number"
                    min={priceBounds.min}
                    max={draftMax}
                    value={draftMin}
                    onChange={(event) =>
                      handleMinChange(
                        event.target.value
                      )
                    }
                    className="filter-input"
                  />

                </div>


                <span className="filter-price-to">
                  to
                </span>


                {/* Maximum */}
                <div className="filter-price-input">

                  <span className="filter-currency">
                    ₹
                  </span>

                  <CFormInput
                    type="number"
                    min={draftMin}
                    max={priceBounds.max}
                    value={draftMax}
                    onChange={(event) =>
                      handleMaxChange(
                        event.target.value
                      )
                    }
                    className="filter-input"
                  />

                </div>

              </div>

            </>
          )}

        </section>

      </COffcanvasBody>


      {/* =========================
          FOOTER
      ========================= */}
      <div className="filter-drawer-footer">

        <CButton
          className="filter-result-btn"
          onClick={handleApply}
        >
          VIEW RESULTS

          {typeof resultCount === "number"
            ? ` (${resultCount})`
            : ""}
        </CButton>

      </div>

    </COffcanvas>
  );
}
