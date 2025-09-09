import {
  User,
  Award,
  Heart,
  Shield,
  Target,
  CheckCircle,
  Star,
  Calendar
} from 'lucide-react'
import './About.css'

const About = () => {
  return (
    <div className="about">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content text-center">
            <h1>About Kasam Healthcare</h1>
            <p>Leading Homeopathic Healthcare Provider in Ahmedabad & Gandhinagar with 20+ Years of Excellence</p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section section-light">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Kasam Healthcare was established in Ahmedabad by two visionary entrepreneurs: <strong>Harshadray Jagjivandas Parmar</strong>,
                a retired government employee from ITI Gandhinagar who served as Apprentice Adviser with vast experience of 27 years
                in government sector and 10 years in corporate dealing, and <strong>Dr. Jignesh H Parmar</strong>, a graduate in
                homeopathy from Anand Homeopathic Medical College (2001) and Sardar Patel University.
              </p>
              <p>
                Dr. Jignesh Parmar brings over 20+ years of extensive experience in homeopathic practice and serves as homeopathic
                consultant to Rajasthan Hospitals Ahmedabad, provides honorary services to Bharat Sevashram Sangh (an NGO with
                worldwide branches), works as panel consultant to ONGC since 2011, and serves as visiting homeopathic consultant
                to Cantonment Health Centre Ahmedabad since 2012. He was also a pioneer in starting online consultancy services
                in homeopathy for Gujarat since 2006.
              </p>
              <p>
                Their shared vision materialized on <strong>25th June 2012</strong> with the formation of Kasam Healthcare Private Limited -
                a dream come true that has grown into a chain of homeopathic clinics with branches in Ahmedabad and Gandhinagar,
                serving thousands of patients with natural healing solutions.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <CheckCircle size={24} />
                  <span>20+ Years of Excellence</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={24} />
                  <span>Ahmedabad & Gandhinagar Locations</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={24} />
                  <span>ONGC Panel Consultant</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle size={24} />
                  <span>Online Consultation Pioneer</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="about-placeholder">
                <Heart size={100} color="var(--primary-color)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section section-gray">
        <div className="container">
          <div className="mission-vision">
            <div className="mission-card">
              <div className="card-icon">
                <Target size={50} />
              </div>
              <h3>Our Mission</h3>
              <p>
                <strong>Our Motto: "Heal Well Heal Fast"</strong>
              </p>
              <p>
                Thinking of Homeopathy, think of Kasam Healthcare. We are your first and final step
                towards homeopathic management, providing safe, effective, and natural healthcare solutions
                that promote holistic healing and well-being across Ahmedabad and Gandhinagar.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <Star size={50} />
              </div>
              <h3>Our Vision</h3>
              <p>
                Homeopathy in each and every house of India. We envision a future where natural
                healing through homeopathy becomes accessible to every household, promoting wellness
                and healthy living across the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Core Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Heart size={40} />
              </div>
              <h4>Compassion</h4>
              <p>We treat every patient with empathy, kindness, and understanding.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Award size={40} />
              </div>
              <h4>Excellence</h4>
              <p>We strive for the highest standards in everything we do.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Shield size={40} />
              </div>
              <h4>Integrity</h4>
              <p>We conduct ourselves with honesty, transparency, and ethical behavior.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <User size={40} />
              </div>
              <h4>Collaboration</h4>
              <p>We work together as a team to provide the best possible care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header text-center">
            <h2>Meet Our Expert Team</h2>
            <p>Experienced homeopathic practitioners dedicated to your wellness</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="person-image">
                <User size={60} />
              </div>
              <h4>Dr. Jignesh H Parmar</h4>
              <p className="team-role">Chief Homeopathic Physician & Co-Founder</p>
              <p>Graduate from Anand Homeopathic Medical College (2001), Sardar Patel University. 20+ years experience.
              Consultant to Rajasthan Hospitals, ONGC Panel Consultant, Honorary services to Bharat Sevashram Sangh,
              Visiting consultant to Cantonment Health Centre. Pioneer of online homeopathic consultancy in Gujarat since 2006.</p>
            </div>
            <div className="team-card">
              <div className="person-image">
                <User size={60} />
              </div>
              <h4>Harshadray Jagjivandas Parmar</h4>
              <p className="team-role">Co-Founder & Director</p>
              <p>Retired government employee from ITI Gandhinagar, served as Apprentice Adviser. Diploma Automobile Engineer
              from Bhavnagar Bhavsinghji Polytechnique. 27 years government sector experience and 10 years corporate dealing experience.
              Brings extensive administrative and business expertise to healthcare management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header text-center">
            <h2>Our Journey</h2>
            <p>Milestones in our commitment to healthcare excellence</p>
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar size={24} />
              </div>
              <div className="timeline-content">
                <h4>2001</h4>
                <p>Dr. Jignesh Parmar graduated in homeopathy from Anand Homeopathic Medical College, Sardar Patel University.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar size={24} />
              </div>
              <div className="timeline-content">
                <h4>2006</h4>
                <p>Dr. Jignesh became pioneer in starting online consultancy services in homeopathy for Gujarat.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar size={24} />
              </div>
              <div className="timeline-content">
                <h4>25th June 2012</h4>
                <p>Kasam Healthcare Private Limited officially formed - a dream come true for both founders, establishing the foundation of our homeopathic healthcare chain.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar size={24} />
              </div>
              <div className="timeline-content">
                <h4>2011-2012</h4>
                <p>Dr. Jignesh became ONGC panel consultant and visiting homeopathic consultant to Cantonment Health Centre Ahmedabad.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar size={24} />
              </div>
              <div className="timeline-content">
                <h4>2018</h4>
                <p>Expanded operations with multiple clinic locations in Ahmedabad and Gandhinagar to serve more patients.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Calendar size={24} />
              </div>
              <div className="timeline-content">
                <h4>{new Date().getFullYear()}</h4>
                <p>Celebrating 20+ years of excellence in homeopathic healthcare with thousands of successful treatments and continued commitment to natural healing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
