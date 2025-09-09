/**
 * Profile Completion Utility
 * 
 * This utility checks user profile completeness and provides guidance
 * for completing missing information.
 */

// Define required fields for different user roles
export const REQUIRED_FIELDS = {
  patient: {
    basic: ['firstName', 'lastName', 'email', 'phone'],
    address: ['address.street', 'address.city', 'address.state', 'address.zipCode'],
    personal: ['dateOfBirth'],
    emergency: ['emergencyContact.name', 'emergencyContact.phone'],
    medical: [] // Optional for patients
  },
  doctor: {
    basic: ['firstName', 'lastName', 'email', 'phone'],
    address: ['address.street', 'address.city', 'address.state', 'address.zipCode'],
    personal: ['dateOfBirth'],
    emergency: ['emergencyContact.name', 'emergencyContact.phone'],
    medical: [] // Not applicable for doctors
  },
  admin: {
    basic: ['firstName', 'lastName', 'email', 'phone'],
    address: [],
    personal: [],
    emergency: [],
    medical: []
  }
}

// Field categories with user-friendly names and descriptions
export const FIELD_CATEGORIES = {
  basic: {
    name: 'Basic Information',
    description: 'Essential contact details',
    icon: '👤',
    priority: 1
  },
  address: {
    name: 'Address Information',
    description: 'Your residential address for appointments and billing',
    icon: '🏠',
    priority: 2
  },
  personal: {
    name: 'Personal Details',
    description: 'Additional personal information',
    icon: '📅',
    priority: 3
  },
  emergency: {
    name: 'Emergency Contact',
    description: 'Someone to contact in case of emergency',
    icon: '🚨',
    priority: 4
  },
  medical: {
    name: 'Medical Information',
    description: 'Health-related information (optional)',
    icon: '🏥',
    priority: 5
  }
}

// Field display names and validation rules
export const FIELD_INFO = {
  'firstName': { name: 'First Name', type: 'text', required: true },
  'lastName': { name: 'Last Name', type: 'text', required: true },
  'email': { name: 'Email Address', type: 'email', required: true },
  'phone': { name: 'Mobile Number', type: 'tel', required: true, validation: 'indian_mobile' },
  'address.street': { name: 'Street Address', type: 'text', required: true },
  'address.city': { name: 'City', type: 'text', required: true },
  'address.state': { name: 'State', type: 'text', required: true },
  'address.zipCode': { name: 'ZIP/Postal Code', type: 'text', required: true },
  'address.country': { name: 'Country', type: 'text', required: false, default: 'India', dynamic: true },
  'dateOfBirth': { name: 'Date of Birth', type: 'date', required: true },
  'emergencyContact.name': { name: 'Emergency Contact Name', type: 'text', required: true },
  'emergencyContact.phone': { name: 'Emergency Contact Phone', type: 'tel', required: true, validation: 'indian_mobile' },
  'emergencyContact.relationship': { name: 'Relationship', type: 'text', required: false }
}

/**
 * Get nested object value using dot notation
 * @param {Object} obj - Object to search
 * @param {string} path - Dot notation path (e.g., 'address.street')
 * @returns {*} - Value at path or undefined
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Check if a field has a valid value
 * @param {*} value - Field value
 * @param {Object} fieldInfo - Field information
 * @returns {boolean} - True if field is complete
 */
export const isFieldComplete = (value, fieldInfo) => {
  if (!fieldInfo.required) return true
  
  if (value === null || value === undefined) return false
  if (typeof value === 'string' && value.trim() === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  
  // Special validation for phone numbers
  if (fieldInfo.validation === 'indian_mobile') {
    let cleanPhone = value.replace(/[\s\-()]/g, '')

    // Remove leading 0 if present (common in Indian mobile numbers)
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = cleanPhone.substring(1)
    }

    const indianMobilePatterns = [
      /^(\+91|91)?[6-9]\d{9}$/,
      /^[6-9]\d{9}$/,
    ]
    return indianMobilePatterns.some(pattern => pattern.test(cleanPhone))
  }
  
  return true
}

/**
 * Analyze user profile completeness
 * @param {Object} user - User object
 * @returns {Object} - Profile completion analysis
 */
export const analyzeProfileCompletion = (user) => {
  if (!user) {
    return {
      isComplete: false,
      completionPercentage: 0,
      missingFields: [],
      missingCategories: [],
      completedCategories: [],
      totalFields: 0,
      completedFields: 0
    }
  }

  const userRole = user.role || 'patient'
  const requiredFields = REQUIRED_FIELDS[userRole] || REQUIRED_FIELDS.patient
  
  const analysis = {
    isComplete: true,
    completionPercentage: 0,
    missingFields: [],
    missingCategories: [],
    completedCategories: [],
    totalFields: 0,
    completedFields: 0,
    categoryAnalysis: {}
  }

  // Analyze each category
  Object.entries(requiredFields).forEach(([category, fields]) => {
    if (fields.length === 0) return // Skip empty categories
    
    const categoryAnalysis = {
      name: FIELD_CATEGORIES[category]?.name || category,
      description: FIELD_CATEGORIES[category]?.description || '',
      icon: FIELD_CATEGORIES[category]?.icon || '📋',
      priority: FIELD_CATEGORIES[category]?.priority || 999,
      totalFields: fields.length,
      completedFields: 0,
      missingFields: [],
      isComplete: true
    }

    fields.forEach(fieldPath => {
      const fieldValue = getNestedValue(user, fieldPath)
      const fieldInfo = FIELD_INFO[fieldPath]
      const isComplete = isFieldComplete(fieldValue, fieldInfo)
      
      analysis.totalFields++
      
      if (isComplete) {
        analysis.completedFields++
        categoryAnalysis.completedFields++
      } else {
        analysis.isComplete = false
        categoryAnalysis.isComplete = false
        analysis.missingFields.push({
          path: fieldPath,
          name: fieldInfo?.name || fieldPath,
          category: category,
          type: fieldInfo?.type || 'text',
          validation: fieldInfo?.validation
        })
        categoryAnalysis.missingFields.push({
          path: fieldPath,
          name: fieldInfo?.name || fieldPath,
          type: fieldInfo?.type || 'text',
          validation: fieldInfo?.validation
        })
      }
    })

    categoryAnalysis.completionPercentage = categoryAnalysis.totalFields > 0 
      ? Math.round((categoryAnalysis.completedFields / categoryAnalysis.totalFields) * 100)
      : 100

    analysis.categoryAnalysis[category] = categoryAnalysis

    if (categoryAnalysis.isComplete) {
      analysis.completedCategories.push(category)
    } else {
      analysis.missingCategories.push(category)
    }
  })

  analysis.completionPercentage = analysis.totalFields > 0 
    ? Math.round((analysis.completedFields / analysis.totalFields) * 100)
    : 100

  return analysis
}

/**
 * Get user-friendly completion status message
 * @param {Object} analysis - Profile completion analysis
 * @returns {Object} - Status message and type
 */
export const getCompletionStatusMessage = (analysis) => {
  if (analysis.isComplete) {
    return {
      type: 'success',
      title: '🎉 Profile Complete!',
      message: 'Your profile is fully complete. You can now access all features.',
      action: null
    }
  }

  const percentage = analysis.completionPercentage
  
  if (percentage >= 80) {
    return {
      type: 'warning',
      title: '⚡ Almost There!',
      message: `Your profile is ${percentage}% complete. Just a few more details needed.`,
      action: 'Complete Profile'
    }
  } else if (percentage >= 50) {
    return {
      type: 'info',
      title: '📝 Profile In Progress',
      message: `Your profile is ${percentage}% complete. Please add more information.`,
      action: 'Continue Setup'
    }
  } else {
    return {
      type: 'error',
      title: '🚀 Let\'s Complete Your Profile',
      message: `Your profile is only ${percentage}% complete. Please add your information to get started.`,
      action: 'Complete Profile'
    }
  }
}

/**
 * Get next recommended action for profile completion
 * @param {Object} analysis - Profile completion analysis
 * @returns {Object} - Next action recommendation
 */
export const getNextAction = (analysis) => {
  if (analysis.isComplete) {
    return null
  }

  // Find the highest priority incomplete category
  const incompleteCategories = analysis.missingCategories
    .map(category => ({
      category,
      ...analysis.categoryAnalysis[category]
    }))
    .sort((a, b) => a.priority - b.priority)

  if (incompleteCategories.length === 0) {
    return null
  }

  const nextCategory = incompleteCategories[0]
  const nextField = nextCategory.missingFields[0]

  return {
    category: nextCategory.category,
    categoryName: nextCategory.name,
    categoryIcon: nextCategory.icon,
    field: nextField,
    message: `Please add your ${nextField.name.toLowerCase()}`
  }
}

export default {
  REQUIRED_FIELDS,
  FIELD_CATEGORIES,
  FIELD_INFO,
  analyzeProfileCompletion,
  getCompletionStatusMessage,
  getNextAction,
  isFieldComplete,
  getNestedValue
}
