/**
 * Date utility functions for IST timezone and dd/mm/yyyy format
 * Frontend version for React components
 */

// IST timezone offset (UTC+5:30)
const IST_OFFSET = 5.5 * 60 * 60 * 1000

/**
 * Get current date/time in IST
 * @param {Date} date - Optional date to convert to IST
 * @returns {Date} Date object in IST
 */
export const getISTDate = (date = new Date()) => {
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(utcTime + IST_OFFSET)
}

/**
 * Parse dd/mm/yyyy format to Date object
 * @param {string} dateString - Date in dd/mm/yyyy format
 * @returns {Date|null} Date object or null if invalid
 */
export const parseISTDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null
  
  const [day, month, year] = dateString.split('/')
  if (!day || !month || !year) return null
  
  const dayNum = parseInt(day, 10)
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)
  
  // Validate ranges
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) {
    return null
  }
  
  // Create date (month is 0-indexed in JavaScript)
  const date = new Date(yearNum, monthNum - 1, dayNum)
  
  // Verify the date is valid (handles invalid dates like 31/02/2023)
  if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
    return null
  }
  
  return date
}

/**
 * Format Date object to dd/mm/yyyy string in IST
 * @param {Date} date - Date object to format
 * @returns {string} Date in dd/mm/yyyy format
 */
export const formatDateIST = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  
  const istDate = getISTDate(date)
  const day = String(istDate.getDate()).padStart(2, '0')
  const month = String(istDate.getMonth() + 1).padStart(2, '0')
  const year = istDate.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format Date object to yyyy-mm-dd string for HTML input (IST)
 * @param {Date} date - Date object to format
 * @returns {string} Date in yyyy-mm-dd format
 */
export const formatDateForInput = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  
  const istDate = getISTDate(date)
  const day = String(istDate.getDate()).padStart(2, '0')
  const month = String(istDate.getMonth() + 1).padStart(2, '0')
  const year = istDate.getFullYear()
  return `${year}-${month}-${day}`
}

/**
 * Convert yyyy-mm-dd format to dd/mm/yyyy
 * @param {string} inputDate - Date in yyyy-mm-dd format
 * @returns {string} Date in dd/mm/yyyy format
 */
export const convertInputToDisplayDate = (inputDate) => {
  if (!inputDate) return ''
  
  const [year, month, day] = inputDate.split('-')
  if (!year || !month || !day) return ''
  
  return `${day}/${month}/${year}`
}

/**
 * Convert dd/mm/yyyy format to yyyy-mm-dd
 * @param {string} displayDate - Date in dd/mm/yyyy format
 * @returns {string} Date in yyyy-mm-dd format
 */
export const convertDisplayToInputDate = (displayDate) => {
  if (!displayDate) return ''
  
  const [day, month, year] = displayDate.split('/')
  if (!year || !month || !day) return ''
  
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

/**
 * Format Date object to dd/mm/yyyy HH:mm string in IST
 * @param {Date} date - Date object to format
 * @returns {string} Date and time in dd/mm/yyyy HH:mm format
 */
export const formatDateTimeIST = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ''
  }
  
  const istDate = getISTDate(date)
  const day = String(istDate.getDate()).padStart(2, '0')
  const month = String(istDate.getMonth() + 1).padStart(2, '0')
  const year = istDate.getFullYear()
  const hours = String(istDate.getHours()).padStart(2, '0')
  const minutes = String(istDate.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Get today's date in IST as dd/mm/yyyy
 * @returns {string} Today's date in dd/mm/yyyy format
 */
export const getTodayIST = () => {
  return formatDateIST(getISTDate())
}

/**
 * Get today's date for HTML input (yyyy-mm-dd)
 * @returns {string} Today's date in yyyy-mm-dd format
 */
export const getTodayForInput = () => {
  return formatDateForInput(getISTDate())
}

/**
 * Check if a date is today in IST
 * @param {Date|string} date - Date to check (Date object or dd/mm/yyyy string)
 * @returns {boolean} True if date is today in IST
 */
export const isToday = (date) => {
  let checkDate
  
  if (typeof date === 'string') {
    checkDate = parseISTDate(date)
  } else if (date instanceof Date) {
    checkDate = date
  } else {
    return false
  }
  
  if (!checkDate) return false
  
  const today = getISTDate()
  const todayStr = formatDateIST(today)
  const checkStr = formatDateIST(checkDate)
  
  return todayStr === checkStr
}

/**
 * Check if a date is in the past (IST)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  let checkDate
  
  if (typeof date === 'string') {
    checkDate = parseISTDate(date)
  } else if (date instanceof Date) {
    checkDate = date
  } else {
    return false
  }
  
  if (!checkDate) return false
  
  const today = getISTDate()
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate.getTime() < today.getTime()
}

/**
 * Check if a date is in the future (IST)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFutureDate = (date) => {
  let checkDate
  
  if (typeof date === 'string') {
    checkDate = parseISTDate(date)
  } else if (date instanceof Date) {
    checkDate = date
  } else {
    return false
  }
  
  if (!checkDate) return false
  
  const today = getISTDate()
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  
  return checkDate.getTime() > today.getTime()
}

/**
 * Add days to a date in IST
 * @param {Date|string} date - Base date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export const addDaysIST = (date, days) => {
  let baseDate
  
  if (typeof date === 'string') {
    baseDate = parseISTDate(date)
  } else if (date instanceof Date) {
    baseDate = new Date(date)
  } else {
    baseDate = getISTDate()
  }
  
  if (!baseDate) return getISTDate()
  
  const newDate = getISTDate(baseDate)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

/**
 * Calculate age from birth date in IST
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
export const calculateAge = (birthDate) => {
  let birth
  
  if (typeof birthDate === 'string') {
    birth = parseISTDate(birthDate)
  } else if (birthDate instanceof Date) {
    birth = birthDate
  } else {
    return 0
  }
  
  if (!birth) return 0
  
  const today = getISTDate()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return Math.max(0, age)
}

/**
 * Get IST timezone info
 * @returns {object} Timezone information
 */
export const getISTInfo = () => {
  return {
    name: 'India Standard Time',
    abbreviation: 'IST',
    offset: '+05:30',
    offsetMinutes: 330
  }
}

export default {
  getISTDate,
  parseISTDate,
  formatDateIST,
  formatDateForInput,
  convertInputToDisplayDate,
  convertDisplayToInputDate,
  formatDateTimeIST,
  getTodayIST,
  getTodayForInput,
  isToday,
  isPastDate,
  isFutureDate,
  addDaysIST,
  calculateAge,
  getISTInfo
}
