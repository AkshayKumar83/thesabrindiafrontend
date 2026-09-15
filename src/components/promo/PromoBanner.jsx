import React from "react";
import {
  CBadge,
} from "@coreui/react";
const PromoBanner = ()=>{
    return (
        <>
        <div
                  className="text-white rounded p-3 mb-3 position-relative"
                  style={{
                    background: "linear-gradient(135deg, #3a2f28, #1f1a16)",
                    border: "1px solid #caa15d",
                  }}
                >
                  <CBadge
                    color="warning"
                    className="position-absolute top-0 start-0 text-dark small px-2"
                    style={{ transform: "translate(-4px, -8px)" }}
                  >
                    HOT DEAL
                  </CBadge>
                  <div
                    className="text-center fw-bold mb-2 fst-italic"
                    style={{ color: "#e8c874", fontSize: "1.1rem" }}
                  >
                    Festive Threads Sale
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>🏷️ First Order</span>
                    <span>→ Save ₹100 | Code: WELCOME100</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>🏷️ Buy Any 2 Sarees</span>
                    <span>→ Save ₹300 | Code: GOLDEN300</span>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span>💳 Extra ₹100 OFF on Prepaid Orders</span>
                  </div>
                </div>
        </>
    )
}

export default PromoBanner;