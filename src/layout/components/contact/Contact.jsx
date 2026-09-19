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

import './Contact.css'


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
            RIGHT SIDE — FORM CARD
            ================================================= */}

        <div className="contact-form-wrapper">

          <div className="contact-form-card">


            {/* =================================================
                FORM HEADER
                ================================================= */}

            <div className="contact-form-header">

              <span className="contact-form-kicker">
                GET IN TOUCH
              </span>

              <h3>
                Send us a note
              </h3>

              <p>
                Have a question about a saree or your order?
                We'd love to hear from you.
              </p>

            </div>



            {/* =================================================
                FORM
                ================================================= */}

            <CForm
              className="contact-form"
              onSubmit={handleSubmit}
            >


              {/* NAME */}

              <div className="contact-field">

                <label htmlFor="contact-name">
                  Your Name
                </label>

                <CFormInput
                  id="contact-name"
                  type="text"
                  placeholder="Enter your name"
                  aria-label="Your name"
                  required
                />

              </div>



              {/* PHONE */}

              <div className="contact-field">

                <label htmlFor="contact-phone">
                  Phone Number
                </label>

                <CFormInput
                  id="contact-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  aria-label="Phone number"
                  maxLength={10}
                  required
                />

              </div>



              {/* EMAIL */}

              <div className="contact-field contact-field--full">

                <label htmlFor="contact-email">
                  Email Address
                </label>

                <CFormInput
                  id="contact-email"
                  type="email"
                  placeholder="Enter your email address"
                  aria-label="Your email"
                  required
                />

              </div>



              {/* MESSAGE */}

              <div className="contact-field contact-field--full">

                <label htmlFor="contact-message">
                  Your Message
                </label>

                <CFormTextarea
                  id="contact-message"
                  placeholder="Tell us how we can help..."
                  aria-label="Your message"
                  rows={5}
                  required
                />

              </div>



              {/* SUBMIT */}

              <CButton
                type="submit"
                className="dark-button contact-submit"
              >

                <span>
                  Send a note
                </span>

                <span className="contact-submit-arrow">
                  →
                </span>

              </CButton>


            </CForm>


          </div>

        </div>

      </div>

    </section>
  )
}


export default Contact