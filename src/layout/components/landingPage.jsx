import {
  CButton,
  CCard,
  CCardImage,
  CCol,
  CContainer,
  CImage,
  CRow,
} from '@coreui/react'

import {
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import ProductList from '../../components/product/productlist/ProductList.jsx';

import Contact from './Contact.jsx';

function LandingPage({ onNavigate }) {

  return (
    <>
      <main className="storefront">
        <section className="hero-section">
          <CContainer fluid="xxl">
            <CRow className="align-items-center g-4 g-lg-5">
              <CCol xs={12} lg={5}>
                <div className="hero-copy">
                  <p className="section-kicker">
                    THE FESTIVE EDIT · 2026
                  </p>
                  <h1> Sarees with a <br />
                    <em>story to tell.</em>
                  </h1>
                  <p>
                    Beautifully woven drapes for the moments you will
                    remember, chosen with patience and made to be lived in.
                  </p>
                  <CButton
                    color="dark"
                    className="dark-button d-inline-flex align-items-center gap-2"
                    onClick={() => onNavigate('shop')}
                  >
                    Explore the collection
                    <ArrowRight size={16} />
                  </CButton>
                </div>
              </CCol>
              <CCol xs={12} lg={7}>
                <CCard className="hero-image border-0">
                  <CCardImage
                    src="https://images.unsplash.com/photo-1610030469668-8e9f641aaf4b?auto=format&fit=crop&w=1300&q=88"
                    alt="Woman wearing a pink saree"
                  />
                  <div className="hero-note">
                    <Sparkles size={16} />
                    <span>
                      Made for your
                      <br />
                      <strong>special moments</strong>
                    </span>
                  </div>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        </section>
        <section className="promise-strip">
          <CContainer fluid="xxl">
            <CRow className="g-4">
              <CCol xs={12} md={4}>
                <div>
                  <span>01</span>
                  <strong>
                    Thoughtfully sourced
                  </strong>
                  <p>
                    Every weave has a maker and a story.
                  </p>
                </div>
              </CCol>
              <CCol xs={12} md={4}>
                <div>
                  <span>02</span>
                  <strong>
                    Easy, considered shopping
                  </strong>
                  <p>
                    Personal help whenever you need it.
                  </p>
                </div>
              </CCol>
              <CCol xs={12} md={4}>
                <div>
                  <span>03</span>
                  <strong>
                    Made to last
                  </strong>
                  <p>
                    Pieces to pass from one celebration to the next.
                  </p>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </section>
        
        <section className="product-section" id="shop" >
          <CContainer fluid="xxl">
            {/* Section heading */}
            <CRow className="section-header align-items-end">
              <CCol xs={12} md={8}>
                <div>
                  <p className="section-kicker">
                    THE COLLECTION
                  </p>
                  <h2>
                    Find your <em>forever drape.</em>
                  </h2>
                </div>
              </CCol>
              <CCol
                xs={12}
                md={4}
                className="d-flex justify-content-md-end mt-3 mt-md-0"
              >
                <CButton
                  color="light"
                  variant="ghost"
                  className="text-arrow d-inline-flex align-items-center gap-2"
                  onClick={() => onNavigate('shop')}
                >
                  View all sarees
                  <ArrowRight size={15} />
                </CButton>
              </CCol>
            </CRow>
            {/* Product List component 1 */}
            <ProductList category={'Hello'}/>
            {/* ++++++++++++++ */}
          </CContainer>
        </section>
        <section className="story-section">
          <CContainer fluid="xxl">
            <CRow className="align-items-center g-5">
              {/* Story image */}
              <CCol xs={12} lg={6}>
                <CCard className="story-image border-0">
                  <CImage
                    fluid
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
                    alt="Detail of a handwoven saree"
                  />
                </CCard>
              </CCol>
              {/* Story content */}
              <CCol xs={12} lg={6}>
                <div className="story-copy">
                  <p className="section-kicker">
                    OUR POINT OF VIEW
                  </p>
                  <h2>
                    More than a
                    <br />
                    <em>piece of cloth.</em>
                  </h2>
                  <p>
                    We believe getting dressed can be a small act of joy.
                    Our sarees are selected for their feel, their fall,
                    and the hands behind them, so they become part of
                    your story.
                  </p>
                  <CButton
                    color="light"
                    variant="ghost"
                    className="text-arrow d-inline-flex align-items-center gap-2 px-0"
                  >
                    Read our story
                    <ArrowRight size={15} />
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </section>
        {/* Product List component 2 */}
            <ProductList category={'Hello'}/>
            {/* ++++++++++++++ */}
      </main>
      <Contact /> 
    </>
  )
}

export default LandingPage