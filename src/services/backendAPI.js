import axios from 'axios'

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  debug: import.meta.env.VITE_DEBUG_MODE === 'true'
}

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Debug logging removed for production

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Debug logging removed for production
    return response
  },
  (error) => {

    if (error.response) {
      const { status, data, config } = error.response

      // Handle authentication errors
      if (status === 401) {
        // Check if this is a login attempt (don't clear storage for login failures)
        const isLoginAttempt = config.url?.includes('/auth/login')

        if (!isLoginAttempt) {
          // Clear token and redirect to login for session expiration
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          throw new Error('Session expired. Please login again.')
        } else {
          // For login failures, use the server's error message or default
          const errorMessage = data?.message || 'Invalid email or password'
          throw new Error(errorMessage)
        }
      }

      // Handle other HTTP errors
      const errorMessage = data?.message || getDefaultErrorMessage(status)
      throw new Error(errorMessage)
    } else if (error.request) {
      throw new Error('Network error - please check your connection')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

// Helper function for default error messages
const getDefaultErrorMessage = (status) => {
  switch (status) {
    case 400:
      return 'Bad request - please check your input'
    case 403:
      return 'Access forbidden'
    case 404:
      return 'Resource not found'
    case 409:
      return 'Conflict - resource already exists'
    case 422:
      return 'Validation failed'
    case 429:
      return 'Too many requests - please try again later'
    case 500:
      return 'Server error - please try again later'
    case 503:
      return 'Service unavailable - please try again later'
    default:
      return 'An error occurred'
  }
}

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    })
    return response.data
  },

  // Verify token
  verifyToken: async () => {
    const response = await api.get('/auth/verify-token')
    return response.data
  },

  // Send OTP to email
  sendOTP: async (email) => {
    const response = await api.post('/auth/send-otp', { email })
    return response.data
  },

  // Verify OTP and login/register
  verifyOTP: async (email, otp, firstName = null, lastName = null) => {
    const payload = { email, otp }
    if (firstName && lastName) {
      payload.firstName = firstName
      payload.lastName = lastName
    }
    const response = await api.post('/auth/verify-otp', payload)
    return response.data
  }
}

// Users API
export const usersAPI = {

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
  }
}

// Appointments API
export const appointmentsAPI = {
  // Get appointments
  getAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params })
    return response.data
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    const response = await api.get('/appointments/upcoming')
    return response.data
  },

  // Create appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  },

  // Get appointment by ID
  getAppointment: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  // Update appointment
  updateAppointment: async (appointmentId, appointmentData) => {
    const response = await api.put(`/appointments/${appointmentId}`, appointmentData)
    return response.data
  },

  // Approve appointment (Admin only)
  approveAppointment: async (appointmentId) => {
    const response = await api.put(`/appointments/${appointmentId}/approve`)
    return response.data
  },

  // Reject appointment (Admin only)
  rejectAppointment: async (appointmentId, reason) => {
    const response = await api.put(`/appointments/${appointmentId}/reject`, { reason })
    return response.data
  },

  // Get pending appointments (Admin only)
  getPendingAppointments: async () => {
    const response = await api.get('/appointments/pending')
    return response.data
  },

  // Cancel appointment (mark as cancelled)
  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}/cancel`)
    return response.data
  },

  // Delete appointment (permanently delete cancelled appointment)
  deleteAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}`)
    return response.data
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId, appointmentData) => {
    const response = await api.put(`/appointments/${appointmentId}/reschedule`, appointmentData)
    return response.data
  }
}

// Medical Records API
export const medicalRecordsAPI = {
  // Get medical records
  getMedicalRecords: async (params = {}) => {
    const response = await api.get('/medical-records', { params })
    return response.data
  },

  // Get medical records for a patient
  getPatientRecords: async (patientId, params = {}) => {
    const response = await api.get(`/medical-records/patient/${patientId}`, { params })
    return response.data
  },

  // Create medical record
  createMedicalRecord: async (recordData) => {
    const response = await api.post('/medical-records', recordData)
    return response.data
  }
}

// Slots API
export const slotsAPI = {
  // Get available slots
  getAvailableSlots: async (date, doctorId = null) => {
    const params = { date }
    if (doctorId) params.doctorId = doctorId
    const response = await api.get('/slots/available', { params })
    return response.data
  },

  // Get all slots without pagination (for client-side pagination)
  getAllSlots: async () => {
    const response = await api.get('/slots/all')
    return response.data
  },

  // Get all slots
  getSlots: async (params = {}) => {
    const response = await api.get('/slots', { params })
    return response.data
  },

  // Create slot (Doctor/Admin only)
  createSlot: async (slotData) => {
    const response = await api.post('/slots', slotData)
    return response.data
  },

  // Update slot (Doctor/Admin only)
  updateSlot: async (slotId, slotData) => {
    const response = await api.put(`/slots/${slotId}`, slotData)
    return response.data
  },

  // Delete slot (Doctor/Admin only)
  deleteSlot: async (slotId) => {
    const response = await api.delete(`/slots/${slotId}`)
    return response.data
  },

  // Generate slots for date range (Admin only)
  generateSlots: async (params) => {
    const response = await api.post('/slots/generate', params)
    return response.data
  }
}

// Reviews API
export const reviewsAPI = {
  // Get Google Reviews
  getReviews: async (limit = 5) => {
    const response = await api.get('/reviews', { params: { limit } })
    return response.data
  },

  // Get place details
  getPlaceDetails: async () => {
    const response = await api.get('/reviews/place-details')
    return response.data
  },

  // Refresh reviews cache
  refreshReviews: async () => {
    const response = await api.post('/reviews/refresh')
    return response.data
  }
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health', { timeout: 5000 })
    return response.data
  } catch {
    throw new Error('Backend server is not available')
  }
}

// Export the main api instance for custom requests
export default api
