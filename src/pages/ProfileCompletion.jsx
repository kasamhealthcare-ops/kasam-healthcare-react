import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getDynamicCountry } from '../utils/locationUtils'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import './ProfileCompletion.css'
import '../components/EnhancedButton.css'

const ProfileCompletion = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India' // Will be updated dynamically
    }
  })
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  // Detect user's country dynamically
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const detectedCountry = await getDynamicCountry()
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            country: detectedCountry
          }
        }))
      } catch (error) {
        console.warn('Failed to detect country:', error)
        // Keep default 'India'
      }
    }

    // Detect country if user doesn't have one set OR if they have "USA" (legacy data)
    const currentCountry = user?.address?.country
    if (!currentCountry || currentCountry === 'USA' || currentCountry === 'United States') {
      detectCountry()
    }
  }, [user?.address?.country])

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        }
      })
    }
  }, [user])

  // Form steps configuration
  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      icon: <User size={24} />,
      description: 'Your essential contact details',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      id: 'address',
      title: 'Address Information',
      icon: <MapPin size={24} />,
      description: 'Your residential address (optional)',
      fields: ['address.street', 'address.city', 'address.state', 'address.zipCode']
    },
    {
      id: 'personal',
      title: 'Personal Details',
      icon: <Calendar size={24} />,
      description: 'Additional personal information',
      fields: ['dateOfBirth']
    }
  ]

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === '') {
      return 'Mobile number is required'
    }

    // Remove all spaces, hyphens, and other non-digit characters except +
    let cleanPhone = phone.replace(/[\s\-()]/g, '')

    // Remove leading 0 if present (common in Indian mobile numbers)
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

  // Validate current step
  const validateStep = (stepIndex) => {
    const step = steps[stepIndex]
    const errors = {}

    step.fields.forEach(fieldPath => {
      const value = getNestedValue(formData, fieldPath)

      // Skip validation for address fields (they are optional)
      if (fieldPath.startsWith('address.')) {
        return
      }

      if (fieldPath.includes('phone')) {
        const error = validatePhoneNumber(value)
        if (error) errors[fieldPath] = error
      } else if (fieldPath === 'email') {
        if (!value || !value.includes('@')) {
          errors[fieldPath] = 'Please enter a valid email address'
        }
      } else if (!value || value.trim() === '') {
        errors[fieldPath] = 'This field is required'
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Get nested value helper
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // Set nested value helper
  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = { ...formData }
    setNestedValue(newFormData, name, value)
    setFormData(newFormData)
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Clean and format the data before sending
      const cleanPhoneNumber = (phone) => {
        if (!phone) return ''
        let cleaned = phone.replace(/[\s\-()]/g, '')
        // Remove leading 0 if present (common in Indian mobile numbers)
        if (cleaned.startsWith('0') && cleaned.length === 11) {
          cleaned = cleaned.substring(1)
        }
        return cleaned
      }

      const cleanedData = {
        ...formData,
        // Clean phone numbers
        phone: cleanPhoneNumber(formData.phone),
        // Ensure address object exists (optional)
        address: {
          street: formData.address?.street || '',
          city: formData.address?.city || '',
          state: formData.address?.state || '',
          zipCode: formData.address?.zipCode || '',
          country: formData.address?.country || 'India'
        }
      }

      // Remove empty address object if all fields are empty
      if (!cleanedData.address.street && !cleanedData.address.city && !cleanedData.address.state && !cleanedData.address.zipCode) {
        delete cleanedData.address
      }

      const result = await updateProfile(cleanedData)

      if (result.success) {
        setSubmitMessage('Profile updated successfully!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        const errorMessage = result.error || 'Failed to update profile. Please try again.'
        setSubmitMessage(errorMessage)
        console.error('Profile update failed:', result)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.'
      setSubmitMessage(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Skip profile completion
  const handleSkip = () => {
    navigate('/dashboard')
  }

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="profile-completion">
      <div className="container">
        <div className="completion-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="header-content">
            <h1>Complete Your Profile</h1>
            <p>Help us provide you with the best healthcare experience</p>
          </div>
          
          <button onClick={handleSkip} className="btn-skip">
            Skip for now
          </button>
        </div>

        <div className="completion-progress">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`progress-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              >
                <div className="step-icon">
                  {index < currentStep ? <CheckCircle size={20} /> : step.icon}
                </div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="completion-content">
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon-large">
                {currentStepData.icon}
              </div>
              <h2>{currentStepData.title}</h2>
              <p>{currentStepData.description}</p>
            </div>

            <form className="step-form">
              {currentStepData.fields.map(fieldPath => (
                <div key={fieldPath} className="form-group">
                  <label htmlFor={fieldPath}>
                    {getFieldLabel(fieldPath)}
                    {isFieldRequired(fieldPath) && <span className="required">*</span>}
                  </label>
                  <input
                    type={getFieldType(fieldPath)}
                    id={fieldPath}
                    name={fieldPath}
                    value={getNestedValue(formData, fieldPath) || ''}
                    onChange={handleChange}
                    placeholder={getFieldPlaceholder(fieldPath)}
                    className={validationErrors[fieldPath] ? 'error' : ''}
                  />
                  {validationErrors[fieldPath] && (
                    <div className="field-error">
                      {validationErrors[fieldPath]}
                    </div>
                  )}
                  {!validationErrors[fieldPath] && !getNestedValue(formData, fieldPath) && getFieldHint(fieldPath) && (
                    <div className="field-hint">
                      {getFieldHint(fieldPath)}
                    </div>
                  )}
                </div>
              ))}
            </form>

            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
          </div>

          <div className="step-actions">
            {currentStep > 0 && (
              <button 
                onClick={handlePrevious}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving...'
              ) : isLastStep ? (
                <>
                  <Save size={18} />
                  Complete Profile
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
const getFieldLabel = (fieldPath) => {
  const labels = {
    'firstName': 'First Name',
    'lastName': 'Last Name',
    'email': 'Email Address',
    'phone': 'Mobile Number',
    'dateOfBirth': 'Date of Birth',
    'address.street': 'Street Address',
    'address.city': 'City',
    'address.state': 'State',
    'address.zipCode': 'ZIP/Postal Code'
  }
  return labels[fieldPath] || fieldPath
}

const getFieldType = (fieldPath) => {
  if (fieldPath.includes('email')) return 'email'
  if (fieldPath.includes('phone')) return 'tel'
  if (fieldPath === 'dateOfBirth') return 'date'
  return 'text'
}

const getFieldPlaceholder = (fieldPath) => {
  const placeholders = {
    'firstName': 'Enter your first name',
    'lastName': 'Enter your last name',
    'email': 'Enter your email address',
    'phone': 'e.g., 9876543210',
    'dateOfBirth': 'Select your date of birth',
    'address.street': 'Enter your street address (optional)',
    'address.city': 'Enter your city (optional)',
    'address.state': 'Enter your state (optional)',
    'address.zipCode': 'Enter your ZIP/postal code (optional)'
  }
  return placeholders[fieldPath] || ''
}

const isFieldRequired = (fieldPath) => {
  // Address fields are optional
  if (fieldPath.startsWith('address.')) {
    return false
  }
  return true
}

const getFieldHint = (fieldPath) => {
  const hints = {
    'phone': '📱 Enter your 10-digit mobile number (starts with 6, 7, 8, or 9)',
    'address.street': '🏠 Optional: Your street address for better service',
    'address.city': '🏙️ Optional: Your city for location-based services',
    'address.state': '🗺️ Optional: Your state/province',
    'address.zipCode': '📮 Optional: Your postal/ZIP code'
  }
  return hints[fieldPath] || ''
}

export default ProfileCompletion
