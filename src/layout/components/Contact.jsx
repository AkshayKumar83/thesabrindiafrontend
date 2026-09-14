

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
    <section className="contact-section" id="contact">

      <div className="section-kicker">
        LET'S TALK
      </div>

      <div className="contact-grid">

        {/* Contact Intro */}
        <div>
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
        </div>


        {/* Contact Details */}
        <div className="contact-details">

          <a href="mailto:hello@thesabrindia.com">
            <Mail size={18} />
            hello@thesabrindia.com
          </a>

          <a href="tel:+919876543210">
            <Phone size={18} />
            +91 98765 43210
          </a>

          <p>
            <MapPin size={18} />
            Jaipur, Rajasthan, India
          </p>

        </div>

      </div>


      {/* Contact Form */}
      <CForm
        className="contact-form"
        onSubmit={handleSubmit}
      >

        {/* Name */}
        <CFormInput
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          required
        />


        {/* Email */}
        <CFormInput
          type="email"
          placeholder="Your email"
          aria-label="Your email"
          required
        />


        {/* Phone */}
        <CFormInput
          type="tel"
          placeholder="Phone No."
          aria-label="Phone No."
          required
        />


        {/* Message */}
        <CFormTextarea
          placeholder="How can we help?"
          aria-label="Your message"
          rows={3}
          required
        />


        {/* Submit */}
        <CButton
          type="submit"
          className="dark-button"
        >
          Send a note <span>-&gt;</span>
        </CButton>

      </CForm>

    </section>
  )
}

export default Contact