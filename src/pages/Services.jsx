import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  Activity,
  UserCheck,
  Bone,
  Eye,
  Brain,
  Heart,
  Microscope,
  Ambulance,
  Pill,
  Shield,
  Clock
} from 'lucide-react'
import BookingModal from '../components/BookingModal'
import './Services.css'

const Services = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const handleBookingClick = (e) => {
    e.preventDefault()
    setIsBookingModalOpen(true)
  }
  const services = [
    {
      icon: <Stethoscope size={50} />,
      title: "Gynaecological Problems",
      description: "Specialized homeopathic treatment for women's health issues including menstrual disorders, PCOS, and fertility problems.",
      features: ["Menstrual Irregularities", "PCOS Treatment", "Fertility Enhancement", "Menopausal Symptoms"]
    },
    {
      icon: <Activity size={50} />,
      title: "Dermatologist Problems",
      description: "Natural homeopathic solutions for various skin conditions and dermatological issues.",
      features: ["Eczema & Psoriasis", "Acne Treatment", "Hair Loss", "Skin Allergies"]
    },
    {
      icon: <Bone size={50} />,
      title: "Ortho Problems",
      description: "Homeopathic treatment for joint pain, arthritis, and musculoskeletal disorders without side effects.",
      features: ["Arthritis Relief", "Joint Pain", "Back Pain", "Sports Injuries"]
    },
    {
      icon: <UserCheck size={50} />,
      title: "Paediatric Problems",
      description: "Safe and gentle homeopathic treatments for children's health issues and developmental concerns.",
      features: ["Growth Disorders", "Behavioral Issues", "Allergies in Children", "Digestive Problems"]
    },
    {
      icon: <Eye size={50} />,
      title: "Skin Related Issues",
      description: "Comprehensive homeopathic care for various skin conditions with natural healing approach.",
      features: ["Chronic Skin Conditions", "Allergic Reactions", "Pigmentation", "Wound Healing"]
    },
    {
      icon: <Brain size={50} />,
      title: "Sex Related Problems",
      description: "Confidential homeopathic treatment for sexual health issues with personalized care.",
      features: ["Erectile Dysfunction", "Low Libido", "Premature Ejaculation", "Sexual Wellness"]
    },
    {
      icon: <Microscope size={50} />,
      title: "Urology Problems",
      description: "Homeopathic solutions for urinary tract issues and kidney-related problems.",
      features: ["UTI Treatment", "Kidney Stones", "Prostate Issues", "Bladder Problems"]
    },
    {
      icon: <Pill size={50} />,
      title: "Ayurvedic Treatment",
      description: "Traditional Ayurvedic medicine combined with homeopathic principles for holistic healing.",
      features: ["Panchakarma", "Herbal Medicine", "Lifestyle Counseling", "Detoxification"]
    },
    {
      icon: <Heart size={50} />,
      title: "Homoepathic Medicine",
      description: "Classical homeopathic treatment following the principles of like cures like with individualized remedies.",
      features: ["Constitutional Treatment", "Acute Care", "Chronic Conditions", "Preventive Medicine"]
    }
  ]

  return (
    <div className="services">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content text-center">
            <h1>Homeopathic Treatment Services</h1>
            <p>Natural healing solutions with 20+ years of expertise in homeopathic medicine</p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header text-center">
            <h2>Excellence in Homeopathic Medicine</h2>
            <p>We offer specialized homeopathic treatments delivered by Dr. Jignesh Parmar with 20+ years of experience</p>
          </div>
          
          <div className="services-features">
            <div className="feature-item">
              <Shield size={40} />
              <h4>Natural Healing</h4>
              <p>Safe and effective homeopathic treatments without side effects</p>
            </div>
            <div className="feature-item">
              <Clock size={40} />
              <h4>3 Locations</h4>
              <p>Convenient clinic locations across Ahmedabad for easy access</p>
            </div>
            <div className="feature-item">
              <Heart size={40} />
              <h4>Expert Care</h4>
              <p>Dr. Jignesh Parmar with 20+ years of homeopathic expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section section-gray">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn-outline">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Information */}
      <section className="section section-dark">
        <div className="container">
          <div className="emergency-content text-center">
            <div className="emergency-icon">
              <Stethoscope size={80} />
            </div>
            <h2>Expert Consultation</h2>
            <p>
              Our experienced homeopathic doctor provides personalized consultations with 20+ years of experience
              in treating various health conditions naturally and effectively.
            </p>
            <div className="emergency-features">
              <div className="emergency-feature">
                <h4>Experienced Doctor</h4>
                <p>20+ years of expertise in homeopathic medicine</p>
              </div>
              <div className="emergency-feature">
                <h4>Natural Treatment</h4>
                <p>Safe homeopathic remedies without harmful side effects</p>
              </div>
              <div className="emergency-feature">
                <h4>Personalized Care</h4>
                <p>Individual treatment plans based on patient's unique symptoms</p>
              </div>
            </div>
            <div className="emergency-contact">
              <h3>Consultation Fee: ₹1000</h3>
              <p>Available at 3 convenient locations across Ahmedabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-light">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready for Natural Healing?</h2>
            <p>Schedule your homeopathic consultation with Dr. Jignesh Parmar today</p>
            <div className="cta-buttons">
              <button onClick={handleBookingClick} className="btn btn-primary">
                Book Appointment
              </button>
              <Link to="/contact" className="btn btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  )
}

export default Services
