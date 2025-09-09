import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <div className="error-code">404</div>
            <div className="error-message">Page Not Found</div>
          </div>
          
          <div className="not-found-text">
            <h1>Oops! Page Not Found</h1>
            <p>
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, it happens to the best of us!
            </p>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <Home size={18} />
              Go Home
            </Link>
            <Link to="/contact" className="btn btn-outline">
              <Search size={18} />
              Contact Us
            </Link>
          </div>

          <div className="helpful-links">
            <h3>You might be looking for:</h3>
            <div className="links-grid">
              <Link to="/about" className="helpful-link">
                <span>About Us</span>
                <p>Learn more about Kasam Healthcare</p>
              </Link>
              <Link to="/services" className="helpful-link">
                <span>Our Services</span>
                <p>Explore our medical services</p>
              </Link>
              <Link to="/contact" className="helpful-link">
                <span>Book Appointment</span>
                <p>Schedule your consultation</p>
              </Link>
              <Link to="/login" className="helpful-link">
                <span>Patient Portal</span>
                <p>Access your account</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
