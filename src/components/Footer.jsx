import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import BookingModal from './BookingModal'
import './Footer.css'

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
  </svg>
)

const Footer = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleWhatsAppClick = () => {
    const phoneNumber = "919898440880" // Remove + and spaces
    const message = "Hello! I would like to book an appointment at Kasam Healthcare."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleBookingClick = (e) => {
    e.preventDefault()
    setIsBookingModalOpen(true)
  }

  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-section">
              <h3>Kasam Healthcare</h3>
              <p>
                Leading homeopathic healthcare provider in Ahmedabad with 20+ years of experience.
                Natural healing solutions by Dr. Jignesh Parmar across 3 convenient locations.
              </p>
              <div className="social-links">
                <button
                  onClick={handleWhatsAppClick}
                  className="whatsapp-btn"
                  aria-label="Contact us on WhatsApp"
                >
                  <WhatsAppIcon size={20} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><button onClick={handleBookingClick} className="footer-booking-link">Book Appointment</button></li>
                {isAuthenticated ? (
                  <li><Link to="/dashboard">Dashboard</Link></li>
                ) : (
                  <li><Link to="/login">Patient Login</Link></li>
                )}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4>Our Services</h4>
              <ul className="footer-links">
                <li>Homeopathic Treatment</li>
                <li>General Consultation</li>
                <li>Chronic Disease Management</li>
                <li>Preventive Healthcare</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4>Contact Information</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>R/1, Annapurna Society, Ghodasar, Ahmedabad - 380050</span>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+91 98984 40880</span>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+91 79 2970 0880</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>drjhp@yahoo.com</span>
                </div>
                <div className="contact-item">
                  <Clock size={18} />
                  <span>Dr. Jignesh Parmar - Consultation ₹1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {new Date().getFullYear()} Kasam Healthcare. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-service">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </footer>
  )
}

export default Footer
