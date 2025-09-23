import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { appointmentsAPI, medicalRecordsAPI } from '../services/backendAPI'
import {
  User,
  Calendar,
  FileText,
  Heart,
  Activity,
  Clock,
  MapPin
} from 'lucide-react'
import BookingModal from '../components/BookingModal'
import ProfileCompletionBanner from '../components/ProfileCompletionBanner'
import './Dashboard.css'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('overview')
  const [appointments, setAppointments] = useState(user?.appointments || [])
  const [medicalRecords, setMedicalRecords] = useState(user?.medicalHistory || [])
  const [loading, setLoading] = useState(false) // Start with false for immediate display
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [rescheduleData, setRescheduleData] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')

  // Background data refresh without blocking UI
  const refreshDashboardData = async () => {
    try {
      // Longer timeout for more reliable refresh
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      })

      // Fetch appointments and medical records in parallel
      const [appointmentsResponse, recordsResponse] = await Promise.allSettled([
        Promise.race([appointmentsAPI.getAppointments({ sort: 'appointmentDate' }), timeoutPromise]),
        Promise.race([medicalRecordsAPI.getMedicalRecords(), timeoutPromise])
      ])

      // Update appointments if successful
      if (appointmentsResponse.status === 'fulfilled') {
        const appointmentsArray = appointmentsResponse.value.data.appointments || []
        const validAppointments = appointmentsArray.filter(apt => apt && apt._id)

        // Sort appointments in ascending order (earliest first) as fallback
        const sortedAppointments = validAppointments.sort((a, b) => {
          const dateA = new Date(a.appointmentDate)
          const dateB = new Date(b.appointmentDate)
          if (dateA.getTime() === dateB.getTime()) {
            // If same date, sort by time
            return a.appointmentTime.localeCompare(b.appointmentTime)
          }
          return dateA - dateB
        })

        setAppointments(sortedAppointments)
        console.log('Appointments refreshed:', sortedAppointments.length)
      } else {
        console.log('Failed to refresh appointments:', appointmentsResponse.reason?.message)
      }

      // Update medical records if successful
      if (recordsResponse.status === 'fulfilled') {
        setMedicalRecords(recordsResponse.value.data.records || [])
      }

    } catch (error) {
      // Silently fail - keep existing data
      console.log('Background refresh failed:', error.message)
    }
  }

  // Initial data load function
  const fetchDashboardData = async () => {
    // Wait for background refresh to complete
    await refreshDashboardData()
  }

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (user && isAdmin) {
      navigate('/admin', { replace: true })
      return
    }

    if (user) {
      fetchDashboardData()
    } else {
      // If no user, stop loading immediately
      setLoading(false)
    }

    // Shorter failsafe: Stop loading after 5 seconds
    const failsafeTimeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    return () => clearTimeout(failsafeTimeout)
  }, [user, isAdmin, navigate]) // Removed 'loading' to prevent infinite loop

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message && location.state?.type === 'success') {
      setSuccessMessage(location.state.message)
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
      // Clear the navigation state
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate, location.pathname])

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [activeTab])





  const handleRescheduleAppointment = (appointmentId, appointmentService) => {
    // Set reschedule data and open booking modal
    setRescheduleData({
      appointmentId: appointmentId,
      service: appointmentService,
      isReschedule: true
    })
    setIsBookingModalOpen(true)
  }

  const handleCancelAppointment = async (appointmentId, appointmentService, appointmentDate, appointmentTime) => {
    if (!appointmentId) {
      alert('Error: No appointment ID found. Please refresh the page and try again.')
      return
    }

    const isPast = appointmentDate && appointmentTime ? isAppointmentInPast(appointmentDate, appointmentTime) : false
    const confirmMessage = isPast
      ? `Are you sure you want to cancel your past ${appointmentService} appointment? This will permanently delete the appointment.`
      : `Are you sure you want to cancel your ${appointmentService} appointment? This will permanently delete the appointment.`

    const confirmCancel = window.confirm(confirmMessage)

    if (confirmCancel) {
      try {
        // Show loading state by immediately removing the appointment from UI
        setAppointments(prevAppointments =>
          prevAppointments.filter(apt => apt._id !== appointmentId)
        )

        await appointmentsAPI.cancelAppointment(appointmentId)

        // Refresh the appointments list to ensure consistency
        await fetchDashboardData()

        alert(isPast ? 'Past appointment cancelled and deleted successfully' : 'Appointment cancelled and deleted successfully')
      } catch (error) {
        // If deletion failed, refresh to restore the correct state
        await fetchDashboardData()
        console.error('Cancel appointment error:', error)
        alert('Failed to cancel appointment. Please try again or contact support.')
      }
    }
  }



  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatMemberSince = (user) => {
    if (!user) return ''
    // Use createdAt if available, otherwise use current year
    const memberDate = user.createdAt || user.memberSince
    if (memberDate) {
      const date = new Date(memberDate)
      const month = date.toLocaleDateString('en-GB', { month: 'long' })
      const year = date.getFullYear()
      return `${month} ${year}`
    }
    return new Date().getFullYear().toString()
  }

  const getUserRole = (user) => {
    if (!user?.role) return 'Patient'
    return user.role.charAt(0).toUpperCase() + user.role.slice(1)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatTimeRange = (startTime, duration = 15) => {
    if (!startTime) return ''

    // Parse start time
    const [startHours, startMinutes] = startTime.split(':').map(Number)

    // Calculate end time
    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = startTotalMinutes + duration
    const endHours = Math.floor(endTotalMinutes / 60)
    const endMinutes = endTotalMinutes % 60

    // Format start time
    const startAmpm = startHours >= 12 ? 'PM' : 'AM'
    const startDisplayHour = startHours % 12 || 12
    const formattedStartTime = `${startDisplayHour}:${startMinutes.toString().padStart(2, '0')} ${startAmpm}`

    // Format end time
    const endAmpm = endHours >= 12 ? 'PM' : 'AM'
    const endDisplayHour = endHours % 12 || 12
    const formattedEndTime = `${endDisplayHour}:${endMinutes.toString().padStart(2, '0')} ${endAmpm}`

    return `${formattedStartTime} - ${formattedEndTime}`
  }

  const getClinicDisplayName = (location) => {
    const locationMap = {
      'ghodasar': 'Ghodasar Clinic',
      'vastral': 'Vastral Clinic',
      'gandhinagar': 'Gandhinagar Clinic',
      'clinic': 'Main Clinic',
      'hospital': 'Hospital',
      'home': 'Home Visit',
      'online': 'Online Consultation'
    }
    return locationMap[location?.toLowerCase()] || location || 'Main Clinic'
  }

  const isAppointmentInPast = (appointmentDate, appointmentTime) => {
    const now = new Date()
    const [hours, minutes] = appointmentTime.split(':')
    const appointmentDateTime = new Date(appointmentDate)
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    return appointmentDateTime < now
  }

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="welcome-section">
        <h2>Welcome back, {user.firstName}!</h2>
        <p>Here's your health summary and recent activity</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card hover-lift">
          <div className="stat-icon">
            <Calendar size={30} />
          </div>
          <div className="stat-content">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-icon">
            <FileText size={30} />
          </div>
          <div className="stat-content">
            <h3>{medicalRecords.length}</h3>
            <p>Medical Records</p>
          </div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-icon">
            <Heart size={30} />
          </div>
          <div className="stat-content">
            <h3>Excellent</h3>
            <p>Health Status</p>
          </div>
        </div>
        <div className="stat-card hover-lift">
          <div className="stat-icon">
            <Activity size={30} />
          </div>
          <div className="stat-content">
            <h3>Active</h3>
            <p>Member Since {formatMemberSince(user)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h3>Recent Appointments</h3>
          {appointments && appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.slice(0, 3).map(appointment => (
                <div key={appointment._id} className="appointment-item hover-lift">
                  <div className="appointment-info">
                    <h4>{appointment.service}</h4>
                    <p>{appointment.doctor?.firstName} {appointment.doctor?.lastName}</p>
                    <div className="appointment-meta">
                      <span><Calendar size={16} /> {formatDate(appointment.appointmentDate)}</span>
                      <span><Clock size={16} /> {formatTimeRange(appointment.appointmentTime, appointment.duration)}</span>
                      <span><MapPin size={16} /> {getClinicDisplayName(appointment.location)}</span>
                    </div>
                  </div>
                  <div className={`appointment-status ${appointment.status}`}>
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No appointments scheduled</p>
          )}
        </div>

        <div className="section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn hover-scale" onClick={() => setIsBookingModalOpen(true)}>
              <Calendar size={20} />
              Book Appointment
            </button>
            <button className="action-btn hover-scale" onClick={() => navigate('/profile/complete')}>
              <User size={20} />
              Update Profile
            </button>
            <button className="action-btn hover-scale" onClick={() => {
              setActiveTab('medical')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
              <FileText size={20} />
              View Records
            </button>

          </div>
        </div>
      </div>
    </div>
  )

  const renderAppointments = () => (
    <div className="appointments-section">
      <div className="section-header">
        <h2>My Appointments</h2>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="appointments-grid">
          {appointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.service}</h3>
                <div className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </div>
              </div>
              <div className="appointment-details">
                <p><strong>Doctor:</strong> {appointment.doctor?.firstName} {appointment.doctor?.lastName}</p>
                <p><Calendar size={16} /> {formatDate(appointment.appointmentDate)}</p>
                <p><Clock size={16} /> {formatTimeRange(appointment.appointmentTime, appointment.duration)}</p>
                <p><MapPin size={16} /> {getClinicDisplayName(appointment.location)}</p>
                {isAppointmentInPast(appointment.appointmentDate, appointment.appointmentTime) && (
                  <p className="past-appointment-note">
                    <span style={{color: '#856404', fontSize: '0.9rem', fontStyle: 'italic'}}>
                      ⏰ Past appointment - can still be cancelled if needed
                    </span>
                  </p>
                )}
                {appointment.reason && (
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                )}
              </div>
              <div className="appointment-actions">
                {appointment.status === 'pending' && (
                  <>
                    <span className="pending-note">Waiting for approval</span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        handleCancelAppointment(appointment._id, appointment.service, appointment.appointmentDate, appointment.appointmentTime)
                      }}
                      title="Cancel this appointment"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {appointment.status === 'confirmed' && (
                  <>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleRescheduleAppointment(appointment._id, appointment.service)}
                    >
                      Reschedule
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        handleCancelAppointment(appointment._id, appointment.service, appointment.appointmentDate, appointment.appointmentTime)
                      }}
                      title={isAppointmentInPast(appointment.appointmentDate, appointment.appointmentTime)
                        ? "Cancel this past appointment"
                        : "Cancel this appointment"}
                    >
                      {isAppointmentInPast(appointment.appointmentDate, appointment.appointmentTime)
                        ? "Cancel Past Appointment"
                        : "Cancel"}
                    </button>
                  </>
                )}
                {appointment.status === 'scheduled' && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      handleCancelAppointment(appointment._id, appointment.service, appointment.appointmentDate, appointment.appointmentTime)
                    }}
                    title={isAppointmentInPast(appointment.appointmentDate, appointment.appointmentTime)
                      ? "Cancel this past appointment"
                      : "Cancel this appointment"}
                  >
                    {isAppointmentInPast(appointment.appointmentDate, appointment.appointmentTime)
                      ? "Cancel Past Appointment"
                      : "Cancel"}
                  </button>
                )}

                {(appointment.status === 'completed' || appointment.status === 'no-show') && (
                  <span className="status-note">Appointment {appointment.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Calendar size={60} />
          <h3>No Appointments</h3>
          <p>You don't have any appointments scheduled yet.</p>
          <button className="btn btn-primary" onClick={() => setIsBookingModalOpen(true)}>
            Book Your First Appointment
          </button>
        </div>
      )}
    </div>
  )



  const renderMedicalHistory = () => (
    <div className="medical-history-section">
      <div className="section-header">
        <h2>Medical History</h2>
      </div>

      {medicalRecords && medicalRecords.length > 0 ? (
        <div className="medical-records">
          {medicalRecords.map(record => (
            <div key={record._id || record.id} className="medical-record">
              <div className="record-header">
                <h3>{record.diagnosis || record.recordType}</h3>
                <span className="record-date">{formatDate(record.recordDate || record.date)}</span>
              </div>
              <p><strong>Doctor:</strong> {record.doctor?.firstName} {record.doctor?.lastName}</p>
              <p><strong>Notes:</strong> {record.notes || record.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FileText size={60} />
          <h3>No Medical Records</h3>
          <p>Your medical history will appear here after your visits.</p>
        </div>
      )}
    </div>
  )



  // Only show loading if user is not available (should be very rare)
  if (!user) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        {successMessage && (
          <div className="success-banner">
            <span className="success-icon">✅</span>
            {successMessage}
          </div>
        )}

        {/* Profile Completion Banner */}
        <ProfileCompletionBanner />

        <div className="dashboard-layout">
          {/* Horizontal Navigation */}
          <div className="dashboard-header">
            <div className="user-info">
              <div className="user-avatar">
                <User size={40} />
              </div>
              <div className="user-details">
                <h3>{user.firstName} {user.lastName}</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <nav className="dashboard-nav">
              <button
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Activity size={20} />
                Overview
              </button>
              <button
                className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <Calendar size={20} />
                Appointments
              </button>
              <button
                className={`nav-item ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                <FileText size={20} />
                Medical History
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="dashboard-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'medical' && renderMedicalHistory()}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setRescheduleData(null)
        }}
        rescheduleData={rescheduleData}
        isReschedule={!!rescheduleData}
        onSuccess={fetchDashboardData}
      />
    </div>
  )
}

export default Dashboard
