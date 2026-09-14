import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import {
  CContainer,
} from '@coreui/react'

import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'

import policiesData from './policiesData'

import './PolicyPage.css'


function PolicyPage() {

  const { policy } = useParams()

  const currentPolicy = policiesData[policy]

  const policyHeaderRef = useRef(null)


  /* =====================================================
     SCROLL TO POLICY CONTENT
     ===================================================== */

  useEffect(() => {

    if (currentPolicy && policyHeaderRef.current) {

      setTimeout(() => {

        policyHeaderRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        })

      }, 0)

    }

  }, [policy, currentPolicy])


  /* =====================================================
     INVALID POLICY
     ===================================================== */

  if (!currentPolicy) {

    return (
      <>

        <Header />

        <main className="sabr-policy-page">

          {/* WATERMARK */}

          <div className="sabr-policy-watermark">
            THE SABR INDIA
          </div>


          <CContainer>

            <div className="sabr-policy-not-found">

              <h1>
                Policy Not Found
              </h1>

              <p>
                The policy you are looking for does not exist.
              </p>

            </div>

          </CContainer>

        </main>

        <Footer />

      </>
    )
  }


  /* =====================================================
     VALID POLICY
     ===================================================== */

  return (
    <>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <Header />


      {/* =====================================================
          POLICY CONTENT
          ===================================================== */}

      <main className="sabr-policy-page">


        {/* =================================================
            WATERMARK
            ================================================= */}

        {/* <div className="sabr-policy-watermark">
          THE SABR INDIA
        </div> */}


        <CContainer>

          <div className="sabr-policy-wrapper">


            {/* =================================================
                POLICY HEADER
                ================================================= */}

            <div
              ref={policyHeaderRef}
              className="sabr-policy-header"
            >

              <h1 className="sabr-policy-title">
                {currentPolicy.title}
              </h1>

              <p className="sabr-policy-updated">
                Last updated: {currentPolicy.lastUpdated}
              </p>

            </div>


            {/* =================================================
                POLICY CONTENT
                ================================================= */}

            <div className="sabr-policy-content">

              {currentPolicy.sections.map((section, index) => (

                <section
                  key={index}
                  className="sabr-policy-section"
                >

                  <h2>
                    {section.heading}
                  </h2>

                  <p>
                    {section.content}
                  </p>

                </section>

              ))}

            </div>


          </div>

        </CContainer>

      </main>


      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer />

    </>
  )
}


export default PolicyPage