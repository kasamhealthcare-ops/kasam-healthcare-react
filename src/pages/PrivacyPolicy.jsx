import './PrivacyPolicy.css'

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content text-center">
            <h1>Privacy Policy</h1>
            <p>How we collect, use, and protect your personal information</p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="section section-light">
        <div className="container">
          <div className="privacy-content">
            <div className="policy-section">
              <h2>Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you:</p>
              <ul>
                <li>Create an account or book an appointment</li>
                <li>Contact us for support or inquiries</li>
                <li>Subscribe to our newsletter</li>
                <li>Use our services or interact with our website</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our healthcare services</li>
                <li>Process appointments and manage your medical records</li>
                <li>Send you important updates about your appointments</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
            </div>

            <div className="policy-section">
              <h2>Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </div>

            <div className="policy-section">
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>File a complaint with relevant authorities</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> drjhp@yahoo.com</p>
                <p><strong>Phone:</strong> +91 98984 40880</p>
                <p><strong>Address:</strong> R/1, Annapurna Society, Ghodasar, Ahmedabad - 380050</p>
              </div>
            </div>

            <div className="policy-section">
              <p><strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
