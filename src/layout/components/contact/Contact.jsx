import {
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'

import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'


function Contact() {

  const handleSubmit = (event) => {
    event.preventDefault()
  }


  return (
    <section
      className="contact-section"
      id="contact"
    >

      <div className="section-kicker">
        LET'S TALK
      </div>


      <div className="contact-grid">


        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <div className="contact-intro">

          <h2>
            Questions about
            <br />
            <em>your saree?</em>
          </h2>


          <p>
            We are a small team and we love helping you find the one
            that feels just right. Reach us Monday to Saturday,
            10am to 6pm.
          </p>


          {/* =================================================
              CONTACT INFORMATION
              ================================================= */}

          <div className="contact-details">

            <a href="mailto:hello@thesabrindia.com">

              <Mail size={18} />

              <span>
                hello@thesabrindia.com
              </span>

            </a>


            <a href="tel:+919876543210">

              <Phone size={18} />

              <span>
                +91 98765 43210
              </span>

            </a>


            <div className="contact-location">

              <MapPin size={18} />

              <span>
                Jaipur, Rajasthan, India
              </span>

            </div>

          </div>

        </div>



        {/* =================================================
            RIGHT SIDE — FORM ONLY
            ================================================= */}

        <div className="contact-form-wrapper">

          <CForm
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <CFormInput
              type="text"
              placeholder="Your name"
              aria-label="Your name"
              required
            />


            {/* EMAIL */}

            <CFormInput
              type="email"
              placeholder="Your email"
              aria-label="Your email"
              required
            />


            {/* PHONE */}

            <CFormInput
              type="tel"
              placeholder="Phone No."
              aria-label="Phone No."
              required
            />


            {/* MESSAGE */}

            <CFormTextarea
              placeholder="How can we help?"
              aria-label="Your message"
              rows={5}
              required
            />


            {/* SUBMIT */}

            <CButton
              type="submit"
              className="dark-button"
            >
              Send a note <span>→</span>
            </CButton>

          </CForm>

        </div>

      </div>

    </section>
  )
}


export default Contact