import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, User, Mail, Phone, Calendar, Clock, MessageSquare, CheckCircle, ArrowLeft, ArrowRight, RefreshCw, Send, MapPin, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useDoctor } from '../contexts/DoctorContext'
import { useNavigate } from 'react-router-dom'
import './BookingModal.css'

const BookingModal = ({ isOpen, onClose, rescheduleData = null, onSuccess = null }) => {
  const { isAuthenticated, user } = useAuth()
  const { getDoctorPhone } = useDoctor()
  const navigate = useNavigate()
  const modalRef = useRef(null)
  const isReschedule = rescheduleData?.isReschedule || false

  // Modal state
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: rescheduleData?.service || '',
    date: new Date().toISOString().split('T')[0], // Set current date as default
    time: '',
    message: isReschedule ? 'Rescheduling existing appointment' : ''
  })

  // Validation and slot states
  const [validationErrors, setValidationErrors] = useState({})
  const [fieldTouched, setFieldTouched] = useState({})
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Auto-populate user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Auto-filling user data:', user) // Debug log

      // Build full name from available fields
      let fullName = ''
      if (user.firstName && user.lastName) {
        fullName = `${user.firstName} ${user.lastName}`
      } else if (user.name) {
        fullName = user.name
      } else if (user.firstName) {
        fullName = user.firstName
      } else if (user.displayName) {
        fullName = user.displayName
      }

      setFormData(prev => ({
        ...prev,
        name: fullName || prev.name,
        email: user.email || prev.email,
        phone: user.phone || user.phoneNumber || prev.phone
      }))
    }
  }, [isAuthenticated, user, isOpen]) // Added isOpen to re-trigger when modal opens

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset modal state when closed and initialize when opened
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setSubmitMessage('')
      setValidationErrors({})
      setFieldTouched({})
      setSelectedSlot(null)
      setIsDropdownOpen(false)
    } else {
      // Modal is opening - reset form and auto-fill if authenticated
      setCurrentStep(1)
      setSubmitMessage('')
      setValidationErrors({})
      setFieldTouched({})
      setSelectedSlot(null)
      setIsDropdownOpen(false)

      // Initialize form data
      const initialFormData = {
        name: '',
        email: '',
        phone: '',
        date: new Date().toISOString().split('T')[0], // Set current date as default
        time: '',
        service: 'Homoepathic Medicine',
        message: ''
      }

      // Auto-fill if user is authenticated
      if (isAuthenticated && user) {
        console.log('Modal opening - auto-filling user data:', user) // Debug log

        // Build full name from available fields
        let fullName = ''
        if (user.firstName && user.lastName) {
          fullName = `${user.firstName} ${user.lastName}`
        } else if (user.name) {
          fullName = user.name
        } else if (user.firstName) {
          fullName = user.firstName
        } else if (user.displayName) {
          fullName = user.displayName
        }

        initialFormData.name = fullName
        initialFormData.email = user.email || ''
        initialFormData.phone = user.phone || user.phoneNumber || ''

        console.log('Auto-filled form data:', initialFormData) // Debug log
      }

      setFormData(initialFormData)

      // Automatically fetch slots for current date
      const currentDate = new Date().toISOString().split('T')[0]
      fetchAvailableSlots(currentDate)
    }
  }, [isOpen, isAuthenticated, user])

  // Validation functions (same as Contact.jsx)
  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === '') {
      return 'Mobile number is required for appointment booking'
    }

    let cleanPhone = phone.replace(/[\s\-()]/g, '')

    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1)
    }

    const indianMobilePatterns = [
      /^(\+91|91)?[6-9]\d{9}$/,
      /^[6-9]\d{9}$/,
    ]

    const isValid = indianMobilePatterns.some(pattern => pattern.test(cleanPhone))

    if (!isValid) {
      return 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9'
    }

    return null
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'phone':
        return validatePhoneNumber(value)
      case 'name':
        if (!value || value.trim() === '') {
          return 'Full name is required'
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters long'
        }
        return null
      case 'email': {
        if (!value || value.trim() === '') {
          return 'Email address is required'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address'
        }
        return null
      }
      default:
        return null
    }
  }

  // Fetch available slots - simple and direct
  const fetchAvailableSlots = async (selectedDate) => {
    if (!selectedDate) return

    setLoadingSlots(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setAvailableSlots([])
        return
      }

      const apiUrl = `http://localhost:5000/api/slots/available?date=${selectedDate}`

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        // Handle the response format from backend
        const slots = data.data?.slots || data.data || []
        setAvailableSlots(slots)
      } else {
        setAvailableSlots([])
      }
    } catch {
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    setFieldTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }))

    if (name === 'date') {
      setSelectedSlot(null)
      setFormData(prev => ({ ...prev, time: '' }))
      fetchAvailableSlots(value)
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setFieldTouched(prev => ({ ...prev, [name]: true }))

    const error = validateField(name, value)
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setFormData(prev => ({
      ...prev,
      time: slot.startTime
    }))
    setIsDropdownOpen(false)

    // Clear time slot validation error when a slot is selected
    setValidationErrors(prev => ({ ...prev, timeSlot: '' }))
    setFieldTouched(prev => ({ ...prev, timeSlot: false }))
  }

  // Helper functions
  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getClinicDisplayName = (location) => {
    const locationMap = {
      'ghodasar': 'Ghodasar Clinic',
      'vastral': 'Vastral Clinic',
      'gandhinagar': 'Gandhinagar Clinic'
    }
    return locationMap[location?.toLowerCase()] || location || 'Main Clinic'
  }

  const getGroupedSlots = () => {
    const filteredSlots = availableSlots

    const groups = {
      'Morning (6 AM - 12 PM)': [],
      'Afternoon (12 PM - 6 PM)': [],
      'Evening (6 PM - 10 PM)': []
    }

    filteredSlots.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0])
      if (hour >= 6 && hour < 12) {
        groups['Morning (6 AM - 12 PM)'].push(slot)
      } else if (hour >= 12 && hour < 18) {
        groups['Afternoon (12 PM - 6 PM)'].push(slot)
      } else {
        groups['Evening (6 PM - 10 PM)'].push(slot)
      }
    })

    return Object.entries(groups).map(([period, slots]) => ({ period, slots }))
  }

  // Navigation helpers
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone &&
               !validationErrors.name && !validationErrors.email && !validationErrors.phone
      case 2:
        return formData.date && selectedSlot
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep(currentStep + 1)
      // Clear any validation errors when successfully proceeding
      setValidationErrors(prev => ({ ...prev, timeSlot: '' }))
    } else {
      // Show validation error for missing time slot selection
      if (currentStep === 2 && !selectedSlot) {
        setValidationErrors(prev => ({
          ...prev,
          timeSlot: 'Please select an available time slot to continue.'
        }))
        setFieldTouched(prev => ({ ...prev, timeSlot: true }))
      }
    }
  }



  // Form submission
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setSubmitMessage('Please login to book an appointment')
      return
    }

    if (user?.role === 'admin' || user?.role === 'doctor') {
      setSubmitMessage('Admin/Doctor cannot book appointments for themselves')
      return
    }

    if (!selectedSlot) {
      setSubmitMessage('Please select an available time slot.')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      let response
      let successMessage

      if (isReschedule && rescheduleData?.appointmentId) {
        // For reschedule - backend automatically uses the single doctor
        const reschedulePayload = {
          appointmentDate: new Date(formData.date).toISOString(),
          appointmentTime: selectedSlot.startTime,
          service: formData.service || 'Homoepathic Medicine',
          reason: formData.message || 'General consultation',
          priority: 'normal',
          slotId: selectedSlot._id
        }

        // Reschedule existing appointment using dedicated reschedule endpoint
        response = await fetch(`http://localhost:5000/api/appointments/${rescheduleData.appointmentId}/reschedule`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(reschedulePayload)
        })
        successMessage = 'Appointment rescheduled successfully! Redirecting to your appointments...'
      } else {
        // For new appointment - backend automatically uses the single doctor
        const appointmentData = {
          appointmentDate: new Date(formData.date).toISOString(),
          appointmentTime: selectedSlot.startTime,
          service: formData.service || 'Homoepathic Medicine',
          reason: formData.message || 'General consultation',
          priority: 'normal',
          slotId: selectedSlot._id
        }

        // Create new appointment
        response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(appointmentData)
        })
        successMessage = 'Appointment booked successfully! Redirecting to your appointments...'
      }

      const data = await response.json()

      if (data.success) {
        setSubmitMessage(successMessage)

        // Call the success callback to refresh parent component data
        if (onSuccess) {
          onSuccess()
        }

        setTimeout(() => {
          onClose()
          navigate('/dashboard')
        }, 2000)
      } else {
        console.error('Appointment error:', data)
        setSubmitMessage(data.message || `Failed to ${isReschedule ? 'reschedule' : 'book'} appointment. Please try again.`)
      }
    } catch (error) {
      console.error('Network error:', error)
      setSubmitMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user is admin/doctor
  const isAdminOrDoctor = user?.role === 'admin' || user?.role === 'doctor'

  if (!isOpen) return null

  // Check if user needs to login first
  if (!isAuthenticated) {
    return createPortal(
      <div className="booking-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="booking-modal" ref={modalRef}>
          <div className="booking-modal-header">
            <h2>Login Required</h2>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="booking-modal-content">
            <div className="login-required-content">
              <div className="login-icon">
                <User size={60} />
              </div>
              <h3>Please Login to Book an Appointment</h3>
              <p>To ensure secure appointment booking and manage your medical records, please login to your account first.</p>
              <div className="login-benefits">
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Secure appointment booking</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>View your appointment history</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Manage your medical records</span>
                </div>
              </div>
              <div className="login-actions">
                <button
                  onClick={() => {
                    onClose()
                    navigate('/login')
                  }}
                  className="btn btn-primary"
                >
                  Login Now
                </button>
                <button
                  onClick={() => {
                    onClose()
                    navigate('/register')
                  }}
                  className="btn btn-outline"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  // Check if user is admin/doctor (they shouldn't book appointments for themselves)
  if (isAuthenticated && isAdminOrDoctor) {
    return createPortal(
      <div className="booking-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="booking-modal" ref={modalRef}>
          <div className="booking-modal-header">
            <h2>Access Restricted</h2>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="booking-modal-content">
            <div className="login-required-content">
              <div className="login-icon">
                <User size={60} />
              </div>
              <h3>Admin/Doctor Access Restricted</h3>
              <p>Administrators and doctors cannot book appointments for themselves. Please use the admin panel to manage appointments.</p>
              <div className="login-actions">
                <button
                  onClick={() => {
                    onClose()
                    navigate('/admin')
                  }}
                  className="btn btn-primary"
                >
                  Go to Admin Panel
                </button>
                <button
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="booking-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal" ref={modalRef}>
        <div className="booking-modal-header">
          <h2>{isReschedule ? 'Reschedule Appointment' : 'Book an Appointment'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>



        <div className="booking-modal-content">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="booking-step step-1">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={18} />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter your full name"
                  className={`${isAuthenticated && user && formData.name ? 'pre-filled' : ''} ${
                    fieldTouched.name && validationErrors.name ? 'error' : ''
                  } ${fieldTouched.name && !validationErrors.name && formData.name ? 'valid' : ''}`}
                />
                {fieldTouched.name && validationErrors.name && (
                  <div className="field-error">
                    <span className="error-icon">⚠️</span>
                    {validationErrors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter your email address"
                  className={`${isAuthenticated && user && formData.email ? 'pre-filled' : ''} ${
                    fieldTouched.email && validationErrors.email ? 'error' : ''
                  } ${fieldTouched.email && !validationErrors.email && formData.email ? 'valid' : ''}`}
                />
                {fieldTouched.email && validationErrors.email && (
                  <div className="field-error">
                    <span className="error-icon">⚠️</span>
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={18} />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter your mobile number"
                  className={`${isAuthenticated && user && formData.phone ? 'pre-filled' : ''} ${
                    fieldTouched.phone && validationErrors.phone ? 'error' : ''
                  } ${fieldTouched.phone && !validationErrors.phone && formData.phone ? 'valid' : ''}`}
                />
                {fieldTouched.phone && validationErrors.phone && (
                  <div className="field-error">
                    <span className="error-icon">⚠️</span>
                    {validationErrors.phone}
                  </div>
                )}
                {!fieldTouched.phone && !formData.phone && (
                  <div className="field-hint">
                    <span>💡</span>
                    Please enter a 10-digit mobile number starting with 6, 7, 8, or 9
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {currentStep === 2 && (
            <div className="booking-step step-2">
              <div className="form-group">
                <label htmlFor="date">
                  <Calendar size={18} />
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
                />
                <small className="date-info">
                  Select your preferred appointment date. Available slots will be shown below.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="time">
                  <Clock size={18} />
                  Available Time Slots
                  {loadingSlots && <RefreshCw size={14} className="loading-spinner" />}
                </label>
                {!formData.date ? (
                  <p className="slot-message">Please select a date first to see available slots</p>
                ) : loadingSlots ? (
                  <p className="slot-message">Loading available slots...</p>
                ) : availableSlots.length === 0 ? (
                  <div className="no-slots-container">
                    <p className="slot-message">No available slots for {new Date(formData.date).toLocaleDateString('en-GB')}.</p>
                    <div className="no-slots-suggestions">
                      <h4>Possible reasons:</h4>
                      <ul>
                        <li>All slots for this date are already booked</li>
                        <li>No slots exist in the database for this date</li>
                        <li>Try selecting a different date</li>
                        <li>Check browser console for detailed debugging info</li>
                      </ul>
                      <div className="contact-options">
                        <a href={`tel:${getDoctorPhone()}`} className="btn btn-outline btn-small">
                          <Phone size={16} />
                          Call Now
                        </a>
                        <button
                          onClick={() => {
                            // Try tomorrow
                            const tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            const tomorrowStr = tomorrow.toISOString().split('T')[0]
                            setFormData(prev => ({ ...prev, date: tomorrowStr }))
                            fetchAvailableSlots(tomorrowStr)
                          }}
                          className="btn btn-primary btn-small"
                        >
                          Try Tomorrow
                        </button>
                        {(user?.role === 'admin' || user?.role === 'doctor') && (
                          <button
                            onClick={() => {
                              onClose()
                              navigate('/admin')
                            }}
                            className="btn btn-outline btn-small"
                          >
                            Admin Panel
                          </button>
                        )}
                        <button
                          onClick={() => {
                            fetchAvailableSlots(formData.date)
                          }}
                          className="btn btn-primary btn-small"
                          disabled={loadingSlots}
                        >
                          <RefreshCw size={16} />
                          {loadingSlots ? 'Loading...' : 'Retry'}
                        </button>
                      </div>
                      <div className="slot-info">
                        <p><strong>Available Time Slots:</strong></p>
                        <ul>
                          <li><strong>Ghodasar:</strong> 7:00-8:30 AM, 9:00 AM-12:00 PM, 1:00-2:00 PM, 8:30-10:30 PM (Mon-Sat)</li>
                          <li><strong>Vastral:</strong> 4:00-7:00 PM (Mon-Sat)</li>
                          <li><strong>Gandhinagar:</strong> 12:00-5:00 PM (Sunday only)</li>
                        </ul>
                        <p><strong>Note:</strong> Ghodasar and Vastral are closed on Sundays. Only Gandhinagar is open on Sundays.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="slot-dropdown-container">
                    <button
                      type="button"
                      className={`slot-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="listbox"
                      aria-label="Select appointment time slot"
                    >
                      <div className="dropdown-trigger-content">
                        <Clock size={16} />
                        <span>
                          {selectedSlot
                            ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)} at ${getClinicDisplayName(selectedSlot.location)}`
                            : `Choose from ${availableSlots.filter(slot => !slot.isBooked).length} available slots`
                          }
                        </span>
                        <div className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="slot-dropdown-menu">
                        <div className="dropdown-content">
                          {/* Slot groups by time period */}
                          {getGroupedSlots().map(({ period, slots }) => {
                            if (slots.length === 0) return null

                            return (
                              <div key={period} className="slot-period-group">
                                <div className="period-header">
                                  <span className="period-title">{period}</span>
                                  <span className="period-count">({slots.length} slots)</span>
                                </div>
                                <div className="period-slots">
                                  {slots.map((slot) => (
                                    <button
                                      key={slot._id}
                                      type="button"
                                      className={`slot-dropdown-item ${
                                        selectedSlot?._id === slot._id ? 'selected' : ''
                                      } ${slot.isBooked ? 'booked' : ''}`}
                                      onClick={() => !slot.isBooked && handleSlotSelect(slot)}
                                      disabled={slot.isBooked}
                                    >
                                      <div className="slot-item-content">
                                        <div className="slot-time-info">
                                          <span className="slot-time">
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                          </span>
                                          <span className="slot-location">
                                            {getClinicDisplayName(slot.location)}
                                          </span>
                                        </div>
                                        <div className={`slot-status-badge ${slot.isBooked ? 'booked' : 'available'}`}>
                                          {slot.isBooked ? 'Booked' : 'Available'}
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Time slot validation error */}
                {fieldTouched.timeSlot && validationErrors.timeSlot && (
                  <div className="field-error">
                    <AlertCircle size={16} />
                    {validationErrors.timeSlot}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="service">
                  <MessageSquare size={18} />
                  Department / Problem Type
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="">Choose service type</option>
                  <option value="Gynaecological Problems">Gynaecological Problems</option>
                  <option value="Dermatologist Problems">Dermatologist Problems</option>
                  <option value="Ortho Problems">Ortho Problems</option>
                  <option value="Paediatric Problems">Paediatric Problems</option>
                  <option value="Skin Related Issues">Skin Related Issues</option>
                  <option value="Sex Related Problems">Sex Related Problems</option>
                  <option value="Urology Problems">Urology Problems</option>
                  <option value="Ayurvedic Treatment">Ayurvedic Treatment</option>
                  <option value="Homoepathic Medicine">Homoepathic Medicine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="booking-step step-3">
              <div className="form-group">
                <label htmlFor="message">
                  <MessageSquare size={18} />
                  Reason for Visit / Additional Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {currentStep === 4 && (
            <div className="booking-step step-4">
              <div className="appointment-summary">
                <div className="summary-section">
                  <h4>Personal Information</h4>
                  <div className="summary-item">
                    <User size={16} />
                    <span>{formData.name}</span>
                  </div>
                  <div className="summary-item">
                    <Mail size={16} />
                    <span>{formData.email}</span>
                  </div>
                  <div className="summary-item">
                    <Phone size={16} />
                    <span>{formData.phone}</span>
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Appointment Details</h4>
                  <div className="summary-item">
                    <Calendar size={16} />
                    <span>{new Date(formData.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  {selectedSlot && (
                    <>
                      <div className="summary-item">
                        <Clock size={16} />
                        <span>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</span>
                      </div>
                      <div className="summary-item">
                        <MapPin size={16} />
                        <span>{getClinicDisplayName(selectedSlot.location)}</span>
                      </div>
                    </>
                  )}
                  <div className="summary-item">
                    <MessageSquare size={16} />
                    <span>{formData.service || 'Homoepathic Medicine'}</span>
                  </div>
                </div>

                {formData.message && (
                  <div className="summary-section">
                    <h4>Additional Notes</h4>
                    <div className="summary-message">
                      {formData.message}
                    </div>
                  </div>
                )}
              </div>

              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
                  {submitMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Navigation */}
        <div className="booking-modal-footer">
          <div className="footer-buttons">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-back"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
              >
                <ArrowLeft size={18} />
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleNextStep()}
                disabled={isSubmitting}
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedSlot}
              >
                <Send size={18} />
                {isSubmitting ? 'Submitting...' : (isReschedule ? 'Reschedule Appointment' : 'Book Appointment')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default BookingModal
