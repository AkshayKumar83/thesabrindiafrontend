import React from 'react'
import { CSpinner } from '@coreui/react'
const Loader = ()=>{
    return (
        <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "500px",
        color: "var(--forest-dark)",
      }}
    >
      <CSpinner style={{ width: "3rem", height: "3rem" }} />
    </div>     
    );
}

export default Loader;