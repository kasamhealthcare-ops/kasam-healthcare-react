import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useDoctor } from '../contexts/DoctorContext'
import BookingModal from './BookingModal'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()
  const { getFormattedPhone } = useDoctor()
  const location = useLocation()

  // Helper function to determine if a nav link is active
  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const handleNavClick = () => {
    setIsMenuOpen(false) // Close mobile menu when navigation link is clicked
    setIsUserMenuOpen(false) // Close user dropdown when navigation link is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="flos-header">
      {/* Main Header - Clean & Simple */}
      <div className="flos-main-header">
        <div className="container">
          <div className="main-header-content">
            {/* Logo */}
            <div className="flos-logo">
              <Link to="/" className="logo-link">
                <div className="logo-text">
                  <h1>Kasam Healthcare</h1>
                  <span className="tagline">Holistic Wellness & Care</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="flos-nav desktop-only">
              <ul className="nav-menu">
                <li><Link to="/" className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}>Home</Link></li>
                <li><Link to="/about" className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}>About Us</Link></li>
                <li><Link to="/services" className={`nav-link ${isActiveLink('/services') ? 'active' : ''}`}>Services</Link></li>
                <li><Link to="/contact" className={`nav-link ${isActiveLink('/contact') ? 'active' : ''}`}>Contact</Link></li>
              </ul>
            </nav>

            {/* Header Actions */}
            <div className="flos-header-actions">
              {isAuthenticated ? (
                <div className="user-menu">
                  <button
                    className="user-profile-btn"
                    onClick={toggleUserMenu}
                    aria-label="User menu"
                  >
                    <span className="user-name">{user?.firstName || 'User'}</span>
                    <svg className="dropdown-chevron" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <Link to="/dashboard" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                        Dashboard
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-link logout-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-actions">
                  <Link to="/login" className="flos-btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                    </svg>
                    Login
                  </Link>
                </div>
              )}

              {/* Theme Toggle Switch - Web.dev Pattern */}
              <button
                className="theme-switch"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                data-theme={isDark ? 'dark' : 'light'}
              >
                <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                  <mask className="moon" id="moon-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle cx="24" cy="10" r="6" fill="black" />
                  </mask>
                  <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
                  <g className="sun-beams" stroke="currentColor">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </g>
                </svg>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-toggle mobile-only"
                onClick={toggleMenu}
                aria-label="Toggle mobile menu"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Flos Style */}
      <div className={`flos-mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <div className="mobile-logo">
              <div className="logo-text">
                <h2>Kasam Healthcare</h2>
                <span>Holistic Wellness</span>
              </div>
            </div>
            <button
              className="mobile-nav-close"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="mobile-nav-menu">
            <Link to="/" className={`mobile-nav-link ${isActiveLink('/') ? 'active' : ''}`} onClick={handleNavClick}>
              Home
            </Link>
            <Link to="/about" className={`mobile-nav-link ${isActiveLink('/about') ? 'active' : ''}`} onClick={handleNavClick}>
              About Us
            </Link>
            <Link to="/services" className={`mobile-nav-link ${isActiveLink('/services') ? 'active' : ''}`} onClick={handleNavClick}>
              Services
            </Link>
            <Link to="/contact" className={`mobile-nav-link ${isActiveLink('/contact') ? 'active' : ''}`} onClick={handleNavClick}>
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="mobile-nav-link" onClick={handleNavClick}>
                  Dashboard
                </Link>
                <button
                  className="mobile-nav-link logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="mobile-nav-link" onClick={handleNavClick}>
                Login
              </Link>
            )}
          </nav>

          <div className="mobile-nav-footer">
            <div className="mobile-contact-info">
              <p>{getFormattedPhone()}</p>
              <p>info@kasamhealthcare.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </header>
  )
}

export default Header
