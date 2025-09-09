import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { appointmentsAPI, slotsAPI } from '../services/backendAPI'
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  MapPin
} from 'lucide-react'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [allAppointments, setAllAppointments] = useState([])
  const [allSlots, setAllSlots] = useState([]) // Store all slots
  const [displayedSlots, setDisplayedSlots] = useState([]) // Current page slots
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const [slotsPageSize, setSlotsPageSize] = useState(20)
  const [availableSlotsCount, setAvailableSlotsCount] = useState(0)

  const [error, setError] = useState(null)
  const [showSlotForm, setShowSlotForm] = useState(false)
  const [slotFormData, setSlotFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: 'ghodasar'
  })

  // Define fetch functions before useEffect to avoid hoisting issues
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all appointments
      try {
        const allResponse = await appointmentsAPI.getAppointments()
        const allAppointments = allResponse.data.appointments || []
        setAllAppointments(allAppointments)
      } catch {
        setAllAppointments([])
      }
    } catch (error) {
      setError(`Failed to load appointments: ${error.message}`)

      // Set empty array as fallback
      setAllAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSlots = async () => {
    try {
      // Single API call to get all slots
      const response = await slotsAPI.getAllSlots()

      const slotsData = response.data.slots || []
      const availableSlots = response.data.availableSlots || 0

      setAllSlots(slotsData)
      setAvailableSlotsCount(availableSlots)

      // Update displayed slots for current page
      updateDisplayedSlots(slotsData, currentPage, slotsPageSize)
    } catch {
      // Error fetching slots
      setAllSlots([])
      setDisplayedSlots([])
      setAvailableSlotsCount(0)
    }
  }

  const updateDisplayedSlots = (slots = allSlots, page = currentPage, pageSize = slotsPageSize) => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedSlots = slots.slice(startIndex, endIndex)
    setDisplayedSlots(paginatedSlots)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    updateDisplayedSlots(allSlots, newPage, slotsPageSize)
  }

  // Calculate pagination info for client-side pagination
  const getPaginationInfo = () => {
    const totalSlots = allSlots.length
    const totalPages = Math.ceil(totalSlots / slotsPageSize)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    return {
      currentPage,
      totalPages,
      totalSlots,
      hasNextPage,
      hasPrevPage,
      availableSlots: availableSlotsCount
    }
  }

  const handlePageSizeChange = (newPageSize) => {
    setSlotsPageSize(newPageSize)
    // Reset to page 1 when changing page size
    setCurrentPage(1)
    updateDisplayedSlots(allSlots, 1, newPageSize)
  }



  // useEffect after functions are defined to avoid hoisting issues
  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    fetchAppointments()
    fetchAllSlots() // Fetch all slots data
  }, [activeTab])

  const handleCreateSlot = async (e) => {
    e.preventDefault()
    try {
      await slotsAPI.createSlot(slotFormData)
      setShowSlotForm(false)
      setSlotFormData({
        date: '',
        startTime: '',
        endTime: '',
        location: 'ghodasar'
      })

      // Scroll to slots table on mobile for better UX
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          const slotsTable = document.querySelector('.slots-table-container')
          if (slotsTable) {
            slotsTable.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }

      await fetchAllSlots()
    } catch {
      alert('Failed to create slot')
    }
  }

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await slotsAPI.deleteSlot(slotId)
        await fetchAllSlots()
      } catch {
        alert('Failed to delete slot')
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

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatTimeRange = (startTime, duration = 30) => {
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

  // Helper function to get clinic display name
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

  // Helper function to format doctor name with proper title
  const formatDoctorName = (firstName, lastName) => {
    if (!firstName || !lastName) return 'Dr. Admin'

    // Check if firstName already contains "Dr." prefix
    const hasTitle = firstName.toLowerCase().startsWith('dr.')

    if (hasTitle) {
      return `${firstName} ${lastName}`
    } else {
      return `Dr. ${firstName} ${lastName}`
    }
  }

  // Helper function to format first name for welcome message
  const formatWelcomeName = (firstName) => {
    if (!firstName) return 'Doctor'

    // Check if firstName already contains "Dr." prefix
    const hasTitle = firstName.toLowerCase().startsWith('dr.')

    if (hasTitle) {
      return firstName
    } else {
      return `Dr. ${firstName}`
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'confirmed': return 'status-confirmed'
      case 'completed': return 'status-completed'
      case 'cancelled': return 'status-cancelled'
      case 'rejected': return 'status-rejected'
      default: return 'status-default'
    }
  }

  const renderAppointmentCard = (appointment) => (
    <div key={appointment._id} className="appointment-card">
      <div className="card-content">
        <div className="patient-section">
          <div className="patient-avatar">
            {appointment.patient.firstName?.charAt(0)}{appointment.patient.lastName?.charAt(0)}
          </div>
          <div className="patient-details">
            <h3 className="patient-name">{appointment.patient.firstName} {appointment.patient.lastName}</h3>
            <div className="contact-row">
              <span className="contact-item">
                <Mail size={12} />
                {appointment.patient.email}
              </span>
              {appointment.patient.phone && (
                <span className="contact-item">
                  <Phone size={12} />
                  {appointment.patient.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="appointment-summary">
          <div className="time-location">
            <div className="primary-info">
              <span className="date-info">
                <Calendar size={14} />
                {formatDate(appointment.appointmentDate)}
              </span>
              <span className="time-info">
                <Clock size={14} />
                {formatTimeRange(appointment.appointmentTime, appointment.duration)}
              </span>
            </div>
            <div className="location-info">
              <MapPin size={12} />
              <span>{getClinicDisplayName(appointment.location)}</span>
            </div>
          </div>

          <div className="service-section">
            <div className="service-badge">
              <User size={12} />
              {appointment.service}
            </div>
            {appointment.reason && (
              <div className="reason-text">
                <MessageSquare size={12} />
                {appointment.reason}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-state">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchAppointments}>
            Try Again
          </button>
          <div className="error-details">
            <p><strong>Possible causes:</strong></p>
            <ul>
              <li>Backend server is not running</li>
              <li>Authentication token expired</li>
              <li>Network connection issues</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.firstName}!</p>
      </div>



      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments ({allAppointments.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          Time Slots ({allSlots.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="welcome-section">
              <h2>Welcome back, {formatWelcomeName(user?.firstName)}!</h2>
              <p>Here's your practice overview and recent activity</p>
            </div>

            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-icon today">
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <h3>{allAppointments.filter(apt => {
                    const today = new Date().toDateString();
                    return new Date(apt.appointmentDate).toDateString() === today;
                  }).length}</h3>
                  <p>Today's Appointments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon total">
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <h3>{allAppointments.length}</h3>
                  <p>Total Appointments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon slots">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <h3>{availableSlotsCount}</h3>
                  <p>Available Slots</p>
                </div>
              </div>
            </div>

            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="admin-quick-actions">
                <button
                  className="action-btn"
                  onClick={() => {
                    setActiveTab('appointments')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <Calendar size={20} />
                  View All Appointments
                </button>
                <button
                  className="action-btn"
                  onClick={() => {
                    setActiveTab('slots')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <Clock size={20} />
                  Manage Time Slots
                </button>

                <button
                  className="action-btn"
                  onClick={() => {
                    setActiveTab('profile')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <User size={20} />
                  Update Profile
                </button>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Upcoming Appointments</h3>
              {allAppointments.length > 0 ? (
                <div className="recent-appointments">
                  {allAppointments
                    .sort((a, b) => {
                      const dateTimeA = new Date(`${a.appointmentDate}T${a.appointmentTime}`)
                      const dateTimeB = new Date(`${b.appointmentDate}T${b.appointmentTime}`)
                      return dateTimeA.getTime() - dateTimeB.getTime()
                    })
                    .slice(0, 5)
                    .map(appointment => (
                    <div key={appointment._id} className="recent-appointment-item">
                      <div className="appointment-info">
                        <h4>{appointment.patient.firstName} {appointment.patient.lastName}</h4>
                        <p>{appointment.service}</p>
                        <div className="appointment-meta">
                          <span><Calendar size={14} /> {formatDate(appointment.appointmentDate)}</span>
                          <span><Clock size={14} /> {formatTimeRange(appointment.appointmentTime, appointment.duration)}</span>
                          <span><MapPin size={14} /> {getClinicDisplayName(appointment.location)}</span>
                        </div>
                      </div>
                      <div className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No recent appointments</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <h2>All Appointments</h2>
            {allAppointments.length > 0 ? (
              <div className="appointments-grid">
                {allAppointments.map(appointment =>
                  renderAppointmentCard(appointment)
                )}
              </div>
            ) : (
              <div className="empty-state">
                <Calendar size={60} />
                <h3>No Appointments</h3>
                <p>No appointments have been scheduled yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'slots' && (
          <div className="slots-section">
            <div className="section-header">
              <h2>Manage Time Slots</h2>
            </div>

            {showSlotForm && (
              <div className="slot-form-overlay">
                <div className="slot-form">
                  <h3>Create New Time Slot</h3>
                  <form onSubmit={handleCreateSlot}>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={slotFormData.date}
                        onChange={(e) => setSlotFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time</label>
                        <input
                          type="time"
                          value={slotFormData.startTime}
                          onChange={(e) => setSlotFormData(prev => ({ ...prev, startTime: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time</label>
                        <input
                          type="time"
                          value={slotFormData.endTime}
                          onChange={(e) => setSlotFormData(prev => ({ ...prev, endTime: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <select
                        value={slotFormData.location}
                        onChange={(e) => setSlotFormData(prev => ({ ...prev, location: e.target.value }))}
                      >
                        <option value="ghodasar">Ghodasar Clinic</option>
                        <option value="vastral">Vastral Clinic</option>
                        <option value="gandhinagar">Gandhinagar Clinic</option>
                      </select>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Create Slot</button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowSlotForm(false)
                          // Scroll to top of slots section on mobile
                          if (window.innerWidth <= 768) {
                            setTimeout(() => {
                              const slotsSection = document.querySelector('.slots-section')
                              if (slotsSection) {
                                slotsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }
                            }, 100)
                          }
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}



            <div className="slots-table-container">
              <table className="slots-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Patient</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSlots.map(slot => (
                    <tr key={slot._id} className={`slot-row ${slot.isBooked ? 'booked' : 'available'}`}>
                      <td className="slot-date-cell">
                        <div className="date-display">
                          <Calendar size={16} />
                          {formatDate(slot.date)}
                        </div>
                      </td>
                      <td className="slot-time-cell">
                        <div className="time-display">
                          <Clock size={16} />
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      </td>
                      <td className="slot-location-cell">
                        <div className="location-display">
                          <MapPin size={16} />
                          {slot.location}
                        </div>
                      </td>
                      <td className="slot-status-cell">
                        <span className={`status-badge ${slot.isBooked ? 'status-booked' : 'status-available'}`}>
                          {slot.isBooked ? 'Booked' : 'Available'}
                        </span>
                      </td>
                      <td className="slot-patient-cell">
                        {slot.isBooked && slot.bookedBy ? (
                          <div className="patient-info">
                            <User size={16} />
                            {slot.bookedBy.firstName} {slot.bookedBy.lastName}
                          </div>
                        ) : (
                          <span className="no-patient">-</span>
                        )}
                      </td>
                      <td className="slot-actions-cell">
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteSlot(slot._id)}
                          disabled={slot.isBooked}
                          title={slot.isBooked ? 'Cannot delete booked slot' : 'Delete slot'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {(() => {
              const paginationInfo = getPaginationInfo()
              return (paginationInfo.totalPages > 1 || paginationInfo.totalSlots > 0) && (
                <div className="pagination-container">
                  <div className="pagination-header">
                    <div className="pagination-info">
                      <span>
                        Showing page {paginationInfo.currentPage} of {paginationInfo.totalPages}
                        ({paginationInfo.totalSlots} total slots)
                      </span>
                    </div>
                  <div className="page-size-selector">
                    <label htmlFor="pageSize">Show:</label>
                    <select
                      id="pageSize"
                      value={slotsPageSize}
                      onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                      className="page-size-select"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span>per page</span>
                  </div>
                </div>
                {paginationInfo.totalPages > 1 && (
                  <div className="pagination-controls">
                  {/* Previous Button */}
                  <button
                    className="pagination-nav"
                    onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                    disabled={!paginationInfo.hasPrevPage}
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
                  {(() => {
                    const current = paginationInfo.currentPage
                    const total = paginationInfo.totalPages
                    const pages = []

                    // Always show first page
                    if (current > 3) {
                      pages.push(
                        <button
                          key={1}
                          className="pagination-number"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      )
                      if (current > 4) {
                        pages.push(<span key="dots1" className="pagination-dots">...</span>)
                      }
                    }

                    // Show pages around current
                    const start = Math.max(1, current - 2)
                    const end = Math.min(total, current + 2)

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`pagination-number ${i === current ? 'active' : ''}`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      )
                    }

                    // Always show last page
                    if (current < total - 2) {
                      if (current < total - 3) {
                        pages.push(<span key="dots2" className="pagination-dots">...</span>)
                      }
                      pages.push(
                        <button
                          key={total}
                          className="pagination-number"
                          onClick={() => handlePageChange(total)}
                        >
                          {total}
                        </button>
                      )
                    }

                    return pages
                  })()}

                  {/* Next Button */}
                  <button
                    className="pagination-nav"
                    onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                    disabled={!paginationInfo.hasNextPage}
                  >
                    ›
                  </button>
                </div>
                )}
              </div>
              )
            })()}

            {allSlots.length === 0 && (
              <div className="empty-state">
                <Clock size={60} />
                <h3>No Upcoming Time Slots</h3>
                <p>Create time slots for upcoming dates to start accepting appointments.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Admin Profile</h2>
              <button className="btn btn-outline" onClick={() => window.location.href = '/profile/complete'}>
                <Edit size={18} />
                Edit Profile
              </button>
            </div>

            <div className="admin-profile-content">
              <div className="profile-card">
                <div className="profile-avatar">
                  <User size={60} />
                </div>
                <div className="profile-info">
                  <h3>{formatDoctorName(user?.firstName, user?.lastName)}</h3>
                  <p className="profile-role">Healthcare Administrator</p>
                  <p className="member-since">Admin since {formatDate(user?.createdAt || Date.now())}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-group">
                  <h4>Contact Information</h4>
                  <div className="detail-item">
                    <Mail size={18} />
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="detail-item">
                      <Phone size={18} />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>



                <div className="detail-group">
                  <h4>Clinic Locations</h4>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <span>Ghodasar Clinic - R/1, Annapurna Society, Cadila Road</span>
                  </div>

                  <div className="detail-item">
                    <MapPin size={18} />
                    <span>Vastral Clinic - Vastral Cross Road, Vastral</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} />
                    <span>Gandhinagar Clinic - 122/2, Sector 4/A, Gandhinagar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
