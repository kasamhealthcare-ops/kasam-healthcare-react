import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  Shield,
  Users,
  Clock,
  Award,
  Stethoscope,
  Activity,
  UserCheck,
  Phone,
  ArrowRight,
  Leaf,
  Star,
  CheckCircle,
  Calendar,
  MapPin
} from 'lucide-react'
import DynamicReviews from '../components/DynamicReviews'
import AnimatedSection from '../components/AnimatedSection'
import BookingModal from '../components/BookingModal'
import { useDoctor } from '../contexts/DoctorContext'
import './Home.css'

const Home = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { getFormattedPhone, getDoctorPhone } = useDoctor()

  const handleBookingClick = (e) => {
    e.preventDefault()
    setIsBookingModalOpen(true)
  }
  return (
    <div className="home">
      {/* Hero Section - Enhanced Flos Style */}
      <section className="hero flos-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-floating-shapes">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="floating-shape shape-4"></div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content flos-layout">
            <div className="hero-left-section">
              <div className="hero-large-typography">
                <h1 className="hero-main-title hero-animated">
                  <span className="title-line healing">NATURAL</span>
                  <span className="title-line nature">HEALING</span>
                </h1>
              </div>
              <div className="hero-description-section">
                <div className="hero-badge hero-fade-in">
                  <Leaf size={16} />
                  <span>Heal Well Heal Fast</span>
                </div>
                <p className="hero-subtitle hero-fade-in">
                  Experience the transformative power of homeopathic medicine with our expert doctor.
                  Over 20+ years of expertise in natural healing, serving patients across Ahmedabad and Gandhinagar
                  with personalized, gentle care and guaranteed results.
                </p>
                <div className="hero-buttons hero-fade-in">
                  <button onClick={handleBookingClick} className="btn btn-primary btn-large hero-btn-primary">
                    <Calendar size={20} />
                    Book Appointment Now
                  </button>
                  <Link to="/services" className="btn btn-outline btn-large hero-btn-secondary">
                    <Stethoscope size={20} />
                    Our Services
                  </Link>
                </div>
              </div>
            </div>
            <div className="hero-right-section">
              <div className="hero-image-container hero-image-animated">
                <div className="hero-main-image">
                  <img
                    src="https://awakenedtemplates.com/flos/wp-content/uploads/sites/23/elementor/thumbs/flos-01-r2ddf2b0wyt7amb8xuyf3nczezw1i2ltvm9tyn4qg8.jpg"
                    alt="Natural Healthcare Professional - Flos Theme"
                    className="hero-img"
                    onLoad={(e) => {
                      e.target.nextSibling.style.display = 'none';
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hero-image-placeholder" style={{display: 'none'}}>
                    <div className="hero-image-content">
                      <div className="hero-image-icon">
                        <UserCheck size={80} />
                      </div>
                      <div className="hero-image-text">Dr. Jignesh Parmar</div>
                      <div className="hero-image-subtitle">Natural Healthcare Professional</div>
                    </div>
                  </div>
                </div>
                <div className="hero-decorative-elements">
                  <div className="floating-element floating-1 hero-float-1">
                    <Leaf size={40} />
                  </div>
                  <div className="floating-element floating-2 hero-float-2">
                    <Heart size={35} />
                  </div>
                  <div className="floating-element floating-3 hero-float-3">
                    <Star size={30} />
                  </div>
                  <div className="hero-flower-decoration">
                    <div className="flower-petals hero-rotate"></div>
                  </div>
                  <div className="hero-glow-effect"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-features">
        <div className="container">
          <AnimatedSection className="section-header text-center">
            <div className="section-badge">
              <CheckCircle size={16} />
              <span>Why Choose Us</span>
            </div>
            <h2>Your Trusted Partner in Natural Healing</h2>
            <p>Experience the difference with our holistic approach to healthcare, combining traditional wisdom with modern understanding</p>
          </AnimatedSection>
          <div className="features-grid">
            <AnimatedSection delay={0.1} className="feature-card">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
              <h3>Guaranteed Results</h3>
              <p>Dr. Jignesh Parmar brings over 20+ years of specialized experience with proven track record and guaranteed results in homeopathic medicine.</p>
              <div className="feature-highlight">Proven Results</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="feature-card">
              <div className="feature-icon">
                <Clock size={40} />
              </div>
              <h3>100% Feedback</h3>
              <p>We ensure complete patient satisfaction with 100% feedback and continuous improvement in our treatment approaches.</p>
              <div className="feature-highlight">100% Satisfaction</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3} className="feature-card">
              <div className="feature-icon">
                <Star size={40} />
              </div>
              <h3>Multiple Locations</h3>
              <p>Conveniently located clinics in Ahmedabad and Gandhinagar for easy accessibility and comprehensive care.</p>
              <div className="feature-highlight">Ahmedabad & Gandhinagar</div>
            </AnimatedSection>
            <AnimatedSection delay={0.4} className="feature-card">
              <div className="feature-icon">
                <Leaf size={40} />
              </div>
              <h3>Natural & Safe</h3>
              <p>Gentle homeopathic treatments that work with your body's natural healing processes without side effects.</p>
              <div className="feature-highlight">Zero Side Effects</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section section-services">
        <div className="container">
          <AnimatedSection className="section-header text-center">
            <div className="section-badge">
              <Stethoscope size={16} />
              <span>Our Specialties</span>
            </div>
            <h2>Comprehensive Natural Healing Solutions</h2>
            <p>Discover our range of specialized homeopathic treatments designed to address your unique health needs with gentle, effective care</p>
          </AnimatedSection>
          <div className="services-preview">
            <AnimatedSection delay={0.1} className="service-card">
              <div className="service-number">01</div>
              <div className="service-icon">
                <Stethoscope size={50} />
              </div>
              <h3>Homeopathic Consultation</h3>
              <p>Comprehensive homeopathic consultation where the doctor will assess your condition, understand your symptoms, and provide personalized treatment plans.</p>
              <ul className="service-features">
                <li>Detailed Case Taking</li>
                <li>Personalized Treatment</li>
                <li>Follow-up Care</li>
              </ul>
              <Link to="/services" className="service-link">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="service-card">
              <div className="service-number">02</div>
              <div className="service-icon">
                <Activity size={50} />
              </div>
              <h3>Online Consultation</h3>
              <p>We are available for online consultation via video calling and phone calling for your convenience and accessibility.</p>
              <ul className="service-features">
                <li>Video Consultation</li>
                <li>Phone Consultation</li>
                <li>Remote Care</li>
              </ul>
              <Link to="/services" className="service-link">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.3} className="service-card">
              <div className="service-number">03</div>
              <div className="service-icon">
                <UserCheck size={50} />
              </div>
              <h3>School Pack</h3>
              <p>This school pack is a tailor-made package for school children who are studying in school, designed specifically for their health needs.</p>
              <ul className="service-features">
                <li>Child-Specific Remedies</li>
                <li>Growth Support</li>
                <li>Immunity Boost</li>
              </ul>
              <Link to="/services" className="service-link">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>

          {/* Additional Services Row */}
          <div className="services-preview" style={{ marginTop: '40px' }}>
            <AnimatedSection delay={0.4} className="service-card">
              <div className="service-number">04</div>
              <div className="service-icon">
                <Users size={50} />
              </div>
              <h3>College Pack</h3>
              <p>This college pack is a tailor-made package for college students who are studying in college, addressing their specific health challenges.</p>
              <ul className="service-features">
                <li>Stress Management</li>
                <li>Academic Pressure Relief</li>
                <li>Lifestyle Support</li>
              </ul>
              <Link to="/services" className="service-link">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.5} className="service-card">
              <div className="service-number">05</div>
              <div className="service-icon">
                <Heart size={50} />
              </div>
              <h3>Senior Citizen Pack</h3>
              <p>This senior citizen pack is a tailor-made package for senior citizens who have crossed 60 years, focusing on age-related health concerns.</p>
              <ul className="service-features">
                <li>Age-Related Issues</li>
                <li>Chronic Condition Management</li>
                <li>Quality of Life Enhancement</li>
              </ul>
              <Link to="/services" className="service-link">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
            <AnimatedSection delay={0.6} className="service-card">
              <div className="service-number">06</div>
              <div className="service-icon">
                <Star size={50} />
              </div>
              <h3>Woman's Pack</h3>
              <p>It's a pack for full women's health. This is the best ever pack designed by any company in the world for comprehensive women's wellness.</p>
              <ul className="service-features">
                <li>Hormonal Balance</li>
                <li>Reproductive Health</li>
                <li>Complete Women's Care</li>
              </ul>
              <Link to="/services" className="service-link">
                Learn More <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>
          <AnimatedSection delay={0.4} className="text-center">
            <Link to="/services" className="btn btn-primary btn-large">
              <Stethoscope size={20} />
              View All Services
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section section-stats">
        <div className="stats-background">
          <div className="stats-pattern"></div>
        </div>
        <div className="container">
          <AnimatedSection className="stats-content">
            <div className="stats-header">
              <h2>Trusted by Thousands</h2>
              <p>Our commitment to natural healing has helped countless patients achieve better health</p>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Award size={30} />
                </div>
                <div className="stat-number">20+</div>
                <div className="stat-label">Years of Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <MapPin size={30} />
                </div>
                <div className="stat-number">3</div>
                <div className="stat-label">Active Clinics</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Star size={30} />
                </div>
                <div className="stat-number">4.7★</div>
                <div className="stat-label">Patient Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Heart size={30} />
                </div>
                <div className="stat-number">₹1000</div>
                <div className="stat-label">Consultation Fee</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="section section-reviews">
        <div className="container">
          <AnimatedSection className="section-header text-center">
            <div className="section-badge">
              <Star size={16} />
              <span>Patient Stories</span>
            </div>
            <h2>Healing Stories from Our Patients</h2>
            <p>Discover real experiences and transformative journeys of patients who have found wellness through our natural healing approach</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <DynamicReviews limit={3} showPlaceDetails={false} />
          </AnimatedSection>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="section section-cta">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="container">
          <div className="cta-content text-center">
            <div className="cta-badge" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(74, 103, 65, 0.15)', color: '#4a6741', padding: '8px 16px', borderRadius: '50px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '20px', border: '1px solid rgba(74, 103, 65, 0.3)'}}>
              <Leaf size={16} />
              <span>Start Your Healing Journey</span>
            </div>
            <h2 style={{color: '#2d4a2b !important', fontSize: '2.75rem', fontWeight: '700', marginBottom: '20px'}}>Ready to Experience Natural Healing?</h2>
            <p style={{color: '#4a6741 !important', fontSize: '1.25rem', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto'}}>Join thousands of satisfied patients who have found wellness through our gentle, effective homeopathic treatments. Book your consultation today and take the first step towards better health.</p>

            <div className="cta-stats" style={{display: 'flex', justifyContent: 'center', gap: '60px', margin: '40px 0 50px', flexWrap: 'wrap'}}>
              <div className="cta-stat" style={{textAlign: 'center'}}>
                <div className="cta-stat-number" style={{fontSize: '2.5rem', fontWeight: '700', color: '#4a6741', marginBottom: '8px', display: 'block'}}>20+</div>
                <div className="cta-stat-label" style={{fontSize: '0.9rem', color: '#4a6741', fontWeight: '500'}}>Years Experience</div>
              </div>
              <div className="cta-stat" style={{textAlign: 'center'}}>
                <div className="cta-stat-number" style={{fontSize: '2.5rem', fontWeight: '700', color: '#4a6741', marginBottom: '8px', display: 'block'}}>100%</div>
                <div className="cta-stat-label" style={{fontSize: '0.9rem', color: '#4a6741', fontWeight: '500'}}>Feedback</div>
              </div>
              <div className="cta-stat" style={{textAlign: 'center'}}>
                <div className="cta-stat-number" style={{fontSize: '2.5rem', fontWeight: '700', color: '#4a6741', marginBottom: '8px', display: 'block'}}>4.7★</div>
                <div className="cta-stat-label" style={{fontSize: '0.9rem', color: '#4a6741', fontWeight: '500'}}>Patient Rating</div>
              </div>
            </div>

            <div className="cta-buttons">
              <button onClick={handleBookingClick} className="btn btn-primary btn-large cta-primary-btn">
                <Calendar size={20} />
                Book Consultation - ₹1000
              </button>
              <a href={`tel:${getDoctorPhone()}`} className="btn btn-outline btn-large cta-call-btn">
                <Phone size={20} />
                Call: {getFormattedPhone()}
              </a>
            </div>

            <div className="cta-trust-indicators">
              <div className="trust-item">
                <Shield size={16} />
                <span>Safe & Natural</span>
              </div>
              <div className="trust-item">
                <Award size={16} />
                <span>Certified Doctor</span>
              </div>
              <div className="trust-item">
                <Clock size={16} />
                <span>Same Day Appointments</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Floating Booking Button */}
      <button onClick={handleBookingClick} className="floating-booking-btn">
        <Calendar size={20} />
        <span>Book Now</span>
      </button>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  )
}

export default Home
