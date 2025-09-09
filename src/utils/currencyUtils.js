/**
 * Currency utility functions for INR (Indian Rupee)
 * Frontend version for React components
 */

// Default currency configuration
export const DEFAULT_CURRENCY = 'INR'
export const SUPPORTED_CURRENCIES = ['INR', 'USD']

// INR formatting configuration
const INR_CONFIG = {
  currency: 'INR',
  locale: 'en-IN',
  symbol: '₹',
  decimals: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.'
}

/**
 * Format amount in INR with proper Indian number formatting
 * @param {number} amount - Amount to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted currency string
 */
export const formatINR = (amount, options = {}) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0.00'
  }
  
  const {
    showSymbol = true,
    showDecimals = true,
    locale = 'en-IN',
    compact = false
  } = options
  
  try {
    let formatter
    
    if (compact && amount >= 1000) {
      // Compact format for large numbers (1K, 1L, 1Cr)
      if (amount >= 10000000) {
        const crores = amount / 10000000
        return showSymbol ? `₹${crores.toFixed(1)}Cr` : `${crores.toFixed(1)}Cr`
      } else if (amount >= 100000) {
        const lakhs = amount / 100000
        return showSymbol ? `₹${lakhs.toFixed(1)}L` : `${lakhs.toFixed(1)}L`
      } else if (amount >= 1000) {
        const thousands = amount / 1000
        return showSymbol ? `₹${thousands.toFixed(1)}K` : `${thousands.toFixed(1)}K`
      }
    }
    
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    })
    
    let formatted = formatter.format(amount)
    
    if (!showSymbol) {
      formatted = formatted.replace('₹', '').trim()
    }
    
    return formatted
  } catch (error) {
    // Fallback formatting
    const fixed = showDecimals ? amount.toFixed(2) : Math.round(amount).toString()
    const withCommas = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return showSymbol ? `₹${withCommas}` : withCommas
  }
}

/**
 * Parse INR string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed amount
 */
export const parseINR = (currencyString) => {
  if (typeof currencyString !== 'string') {
    return 0
  }
  
  // Remove currency symbol, spaces, and commas
  const cleaned = currencyString.replace(/[₹,\s]/g, '')
  
  // Handle compact notation
  if (cleaned.includes('Cr')) {
    const value = parseFloat(cleaned.replace('Cr', ''))
    return isNaN(value) ? 0 : value * 10000000
  } else if (cleaned.includes('L')) {
    const value = parseFloat(cleaned.replace('L', ''))
    return isNaN(value) ? 0 : value * 100000
  } else if (cleaned.includes('K')) {
    const value = parseFloat(cleaned.replace('K', ''))
    return isNaN(value) ? 0 : value * 1000
  }
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Validate INR amount for frontend forms
 * @param {number|string} amount - Amount to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateINRAmount = (amount, options = {}) => {
  const {
    min = 0,
    max = 10000000, // 1 crore
    allowZero = true,
    required = false
  } = options
  
  const errors = []
  
  // Handle empty values
  if (amount === '' || amount === null || amount === undefined) {
    if (required) {
      errors.push('Amount is required')
    }
    return { isValid: !required, errors, value: 0 }
  }
  
  // Convert string to number if needed
  let numAmount = typeof amount === 'string' ? parseINR(amount) : amount
  
  if (typeof numAmount !== 'number' || isNaN(numAmount)) {
    errors.push('Amount must be a valid number')
    return { isValid: false, errors, value: 0 }
  }
  
  if (!allowZero && numAmount === 0) {
    errors.push('Amount cannot be zero')
  }
  
  if (numAmount < min) {
    errors.push(`Amount cannot be less than ${formatINR(min)}`)
  }
  
  if (numAmount > max) {
    errors.push(`Amount cannot be more than ${formatINR(max)}`)
  }
  
  if (numAmount < 0) {
    errors.push('Amount cannot be negative')
  }
  
  // Check for too many decimal places
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length
  if (decimalPlaces > 2) {
    errors.push('Amount cannot have more than 2 decimal places')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: numAmount
  }
}

/**
 * Get consultation fee in INR based on service type
 * @param {string} serviceType - Type of service
 * @returns {number} Fee in INR
 */
export const getConsultationFee = (serviceType = 'general') => {
  const fees = {
    'general': 1000,
    'gynaecological problems': 1200,
    'dermatologist problems': 1100,
    'ortho problems': 1300,
    'paediatric problems': 1000,
    'skin related issues': 1100,
    'sex related problems': 1500,
    'urology problems': 1400,
    'ayurvedic treatment': 800,
    'homoepathic medicine': 800,
    'other': 1000,
    'follow-up': 500,
    'emergency': 1500,
    'online': 800,
    'home-visit': 2000
  }
  
  const key = serviceType.toLowerCase()
  return fees[key] || fees.general
}

/**
 * Calculate total amount with tax (if applicable)
 * @param {number} baseAmount - Base amount
 * @param {number} taxRate - Tax rate (e.g., 0.18 for 18%)
 * @returns {object} Calculation details
 */
export const calculateTotal = (baseAmount, taxRate = 0) => {
  if (typeof baseAmount !== 'number' || typeof taxRate !== 'number') {
    return { 
      baseAmount: 0, 
      taxAmount: 0, 
      totalAmount: 0, 
      taxRate: 0,
      formatted: {
        baseAmount: '₹0.00',
        taxAmount: '₹0.00',
        totalAmount: '₹0.00'
      }
    }
  }
  
  const taxAmount = Math.round((baseAmount * taxRate) * 100) / 100
  const totalAmount = baseAmount + taxAmount
  
  return {
    baseAmount,
    taxAmount,
    totalAmount,
    taxRate: taxRate * 100, // Convert to percentage
    formatted: {
      baseAmount: formatINR(baseAmount),
      taxAmount: formatINR(taxAmount),
      totalAmount: formatINR(totalAmount)
    }
  }
}

/**
 * Format amount for display in forms
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount for input fields
 */
export const formatForInput = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return ''
  }
  
  return amount.toString()
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency = DEFAULT_CURRENCY) => {
  const symbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  }
  
  return symbols[currency] || '₹'
}

/**
 * Check if amount is within reasonable limits for healthcare
 * @param {number} amount - Amount to check
 * @returns {object} Check result
 */
export const checkReasonableAmount = (amount) => {
  const warnings = []
  const errors = []
  
  if (amount > 50000) {
    warnings.push('This is a high amount for a consultation. Please verify.')
  }
  
  if (amount > 100000) {
    errors.push('Amount exceeds maximum limit for online payments.')
  }
  
  if (amount < 100 && amount > 0) {
    warnings.push('This amount seems unusually low for a consultation.')
  }
  
  return {
    isReasonable: errors.length === 0,
    hasWarnings: warnings.length > 0,
    warnings,
    errors
  }
}

/**
 * Get currency configuration
 * @returns {object} Currency configuration
 */
export const getCurrencyConfig = () => {
  return { ...INR_CONFIG }
}

export default {
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
  formatINR,
  parseINR,
  validateINRAmount,
  getConsultationFee,
  calculateTotal,
  formatForInput,
  getCurrencySymbol,
  checkReasonableAmount,
  getCurrencyConfig
}
