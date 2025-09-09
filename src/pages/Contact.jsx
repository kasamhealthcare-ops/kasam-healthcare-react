import { MapPin, Phone, Mail, Navigation } from 'lucide-react'
import DynamicReviews from '../components/DynamicReviews'
import '../components/DynamicReviews.css'
import './Contact.css'

const Contact = () => {

  return (
    <div className="contact">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content text-center">
            <h1>Contact Us</h1>
            <p>Get in touch with us for appointments, inquiries, or emergency care</p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section section-light">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon">
                <MapPin size={40} />
              </div>
              <h3>Ghodasar Clinic</h3>
              <p>R/1, Annapurna Society, Cadila Road<br />Ghodasar, Ahmedabad - 380050<br />Mon-Sat: 7:00 AM-12:00 PM, 1:00-2:00 PM, 8:30-10:30 PM</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">
                <MapPin size={40} />
              </div>
              <h3>Vastral Clinic</h3>
              <p>Vastral Cross Road<br />Vastral, Ahmedabad - 382418<br />Mon-Sat: 4:00-7:00 PM</p>
            </div>
            <div className="contact-info-card">
              <div className="contact-icon">
                <MapPin size={40} />
              </div>
              <h3>Gandhinagar Clinic</h3>
              <p>122/2, Sector 4/A<br />Gandhinagar, Gujarat<br />Sunday Only: 12:00-5:00 PM</p>
            </div>
            <div className="contact-info-card">
              <div className="contact-icon">
                <Phone size={40} />
              </div>
              <h3>Consultation</h3>
              <p>Expert Homeopathic Doctor<br />Consultation Fee: ₹1000<br />20+ Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information and Reviews */}
      <section className="section section-gray">
        <div className="container">
          <div className="contact-content">
            <div className="contact-sidebar">
              <div className="sidebar-card">
                <h3>Patient Reviews</h3>
                <DynamicReviews limit={2} showPlaceDetails={true} />
              </div>

              <div className="sidebar-card">
                <h3>Contact Numbers</h3>
                <div className="quick-contact-item">
                  <Phone size={20} />
                  <span>+91 98984 40880</span>
                </div>
                <div className="quick-contact-item">
                  <Phone size={20} />
                  <span>+91 79 2970 0880</span>
                </div>
                <div className="quick-contact-item">
                  <Phone size={20} />
                  <span>+91 90671 45149</span>
                </div>
                <div className="quick-contact-item">
                  <Mail size={20} />
                  <span>drjhp@yahoo.com</span>
                </div>
                <div className="quick-contact-item">
                  <Phone size={20} />
                  <a href="https://wa.me/919898440880" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    WhatsApp: +91 98984 40880
                  </a>
                </div>
              </div>



              <div className="sidebar-card">
                <h3>Main Location</h3>
                <p>R/1, Annapurna Society<br />Ghodasar, Ahmedabad - 380050</p>
                <div className="map-container">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8!2d72.61134051324319!3d22.988879753817518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2e8b7b5b5%3A0x1234567890abcdef!2sGhodasar%2C%20Ahmedabad%2C%20Gujarat%20380050!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`}
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kasam Healthcare Ghodasar Location"
                  ></iframe>
                  <div className="map-link">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=XJP6%2B9J%20Ahmedabad%2C%20Gujarat`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-button"
                    >
                      <Navigation size={16} />
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Locations Section */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Clinic Locations</h2>
            <p>Visit us at any of our five convenient locations across Ahmedabad and Gandhinagar</p>
          </div>

          <div className="locations-grid">
            <div className="location-card">
              <h3>Ghodasar Clinic</h3>
              <div className="location-details">
                <p><strong>Address:</strong> R/1, Annapurna Society, Cadila Road</p>
                <p>Ghodasar, Ahmedabad - 380050</p>
                <p>(Opposite Municipal Water Tank)</p>
              </div>
              <div className="location-map">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8!2d72.61134051324319!3d22.988879753817518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2e8b7b5b5%3A0x1234567890abcdef!2sAnnapurna%20Society%2C%20Ghodasar%2C%20Ahmedabad%2C%20Gujarat%20380050!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kasam Healthcare Ghodasar"
                ></iframe>
                <div className="map-link">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=XJP6%2B9J%20Ahmedabad%2C%20Gujarat`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-button"
                  >
                    <Navigation size={16} />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>





            <div className="location-card">
              <h3>Gandhinagar Clinic</h3>
              <div className="location-details">
                <p><strong>Address:</strong> 122/2, Sector 4/A</p>
                <p>Gandhinagar, Gujarat</p>
              </div>
              <div className="location-map">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.2!2d72.62446865673193!3d23.209192334491412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2e8b7b5b5%3A0x1234567890abcdef!2sSector%204%2FA%2C%20Gandhinagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1234567890126!5m2!1sen!2sin`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kasam Healthcare Gandhinagar"
                ></iframe>
                <div className="map-link">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=6J4F%2BCP%20Gandhinagar%2C%20Gujarat`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-button"
                  >
                    <Navigation size={16} />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            <div className="location-card">
              <h3>Vastral Clinic</h3>
              <div className="location-details">
                <p><strong>Address:</strong> 138, Asharvi Park Society, Vastral Road, Opp. Sumin Nagar, Nr. Harishchandra Water Tank, Vastral, Ahmedabad, Gujarat – 382418</p>
              </div>
              <div className="location-map">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.64498933997966!3d23.010146066893338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2e8b7b5b5%3A0x1234567890abcdef!2sVastral%2C%20Ahmedabad%2C%20Gujarat%20382418!5e0!3m2!1sen!2sin!4v1234567890127!5m2!1sen!2sin`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kasam Healthcare Vastral"
                ></iframe>
                <div className="map-link">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=2J4W%2BC6%20Ahmedabad%2C%20Gujarat`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-button"
                  >
                    <Navigation size={16} />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
