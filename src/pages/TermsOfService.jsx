import './TermsOfService.css'

const TermsOfService = () => {
  return (
    <div className="terms-of-service">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content text-center">
            <h1>Terms of Service</h1>
            <p>Terms and conditions for using our healthcare services</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section section-light">
        <div className="container">
          <div className="terms-content">
            <div className="terms-section">
              <h2>Acceptance of Terms</h2>
              <p>By accessing and using Kasam Healthcare services, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>

            <div className="terms-section">
              <h2>Medical Services</h2>
              <p>Our healthcare services are provided by licensed medical professionals. We strive to provide accurate medical information and quality care, but:</p>
              <ul>
                <li>Medical advice should not replace professional consultation</li>
                <li>Emergency situations require immediate medical attention</li>
                <li>Treatment outcomes may vary between individuals</li>
                <li>Follow-up care is essential for optimal results</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>Appointment Policy</h2>
              <ul>
                <li>Appointments must be booked in advance through our system</li>
                <li>Cancellations should be made at least 24 hours in advance</li>
                <li>Late arrivals may result in shortened consultation time</li>
                <li>No-shows may be charged a consultation fee</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>Payment Terms</h2>
              <ul>
                <li>Consultation fees are due at the time of service</li>
                <li>We accept cash, card, and digital payments</li>
                <li>Insurance claims assistance is available</li>
                <li>Refunds are processed according to our refund policy</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>Privacy and Confidentiality</h2>
              <p>We maintain strict confidentiality of all medical records and personal information in accordance with healthcare privacy laws and regulations.</p>
            </div>

            <div className="terms-section">
              <h2>Limitation of Liability</h2>
              <p>Kasam Healthcare's liability is limited to the extent permitted by law. We are not liable for any indirect, incidental, or consequential damages.</p>
            </div>

            <div className="terms-section">
              <h2>Modifications</h2>
              <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.</p>
            </div>

            <div className="terms-section">
              <h2>Contact Information</h2>
              <p>For questions about these Terms of Service, contact us at:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> drjhp@yahoo.com</p>
                <p><strong>Phone:</strong> +91 98984 40880</p>
                <p><strong>Address:</strong> R/1, Annapurna Society, Ghodasar, Ahmedabad - 380050</p>
              </div>
            </div>

            <div className="terms-section">
              <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsOfService
