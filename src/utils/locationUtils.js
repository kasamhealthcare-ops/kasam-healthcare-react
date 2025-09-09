/**
 * Location and Country Detection Utilities
 * Provides dynamic country detection based on user's location, timezone, or IP
 */

// Default country for the healthcare application
export const DEFAULT_COUNTRY = 'India'

// Country mapping based on timezone
const TIMEZONE_COUNTRY_MAP = {
  'Asia/Kolkata': 'India',
  'Asia/Mumbai': 'India',
  'Asia/Delhi': 'India',
  'Asia/Chennai': 'India',
  'Asia/Bangalore': 'India',
  'America/New_York': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Chicago': 'United States',
  'Europe/London': 'United Kingdom',
  'Europe/Paris': 'France',
  'Europe/Berlin': 'Germany',
  'Asia/Tokyo': 'Japan',
  'Asia/Shanghai': 'China',
  'Australia/Sydney': 'Australia',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Singapore': 'Singapore'
}

// Common country codes and names
export const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' }
]

/**
 * Get user's country based on timezone
 * @returns {string} Country name
 */
export const getCountryFromTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return TIMEZONE_COUNTRY_MAP[timezone] || DEFAULT_COUNTRY
  } catch (error) {
    console.warn('Could not detect timezone:', error)
    return DEFAULT_COUNTRY
  }
}

/**
 * Get user's country based on browser locale
 * @returns {string} Country name
 */
export const getCountryFromLocale = () => {
  try {
    const locale = navigator.language || navigator.userLanguage
    const countryCode = locale.split('-')[1]?.toUpperCase()
    
    if (countryCode) {
      const country = COUNTRIES.find(c => c.code === countryCode)
      return country ? country.name : DEFAULT_COUNTRY
    }
    
    return DEFAULT_COUNTRY
  } catch (error) {
    console.warn('Could not detect country from locale:', error)
    return DEFAULT_COUNTRY
  }
}

/**
 * Get user's country using IP-based geolocation (requires external API)
 * @returns {Promise<string>} Country name
 */
export const getCountryFromIP = async () => {
  try {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 5000
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.country_name || DEFAULT_COUNTRY
    }
    
    return DEFAULT_COUNTRY
  } catch (error) {
    console.warn('Could not detect country from IP:', error)
    return DEFAULT_COUNTRY
  }
}

/**
 * Get user's country using browser geolocation API
 * @returns {Promise<string>} Country name
 */
export const getCountryFromGeolocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_COUNTRY)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Use reverse geocoding to get country
          // This is a simplified example - in production, you'd use a proper geocoding service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            resolve(data.countryName || DEFAULT_COUNTRY)
          } else {
            resolve(DEFAULT_COUNTRY)
          }
        } catch (error) {
          console.warn('Geocoding failed:', error)
          resolve(DEFAULT_COUNTRY)
        }
      },
      (error) => {
        console.warn('Geolocation failed:', error)
        resolve(DEFAULT_COUNTRY)
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    )
  })
}

/**
 * Get user's country using multiple detection methods
 * Falls back to default if all methods fail
 * @returns {Promise<string>} Country name
 */
export const detectUserCountry = async () => {
  // Try timezone detection first (fastest and most reliable)
  const timezoneCountry = getCountryFromTimezone()
  if (timezoneCountry !== DEFAULT_COUNTRY) {
    return timezoneCountry
  }

  // Try locale detection
  const localeCountry = getCountryFromLocale()
  if (localeCountry !== DEFAULT_COUNTRY) {
    return localeCountry
  }

  // Try IP-based detection (requires internet)
  try {
    const ipCountry = await getCountryFromIP()
    if (ipCountry !== DEFAULT_COUNTRY) {
      return ipCountry
    }
  } catch (error) {
    console.warn('IP-based country detection failed:', error)
  }

  // Fallback to default
  return DEFAULT_COUNTRY
}

/**
 * Get dynamic country for form initialization
 * Uses cached result to avoid repeated API calls
 * @returns {Promise<string>} Country name
 */
export const getDynamicCountry = async () => {
  // Check if we have a cached result
  const cached = localStorage.getItem('detectedCountry')
  const cacheTime = localStorage.getItem('detectedCountryTime')
  
  // Use cached result if it's less than 24 hours old
  if (cached && cacheTime) {
    const age = Date.now() - parseInt(cacheTime)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (age < maxAge) {
      return cached
    }
  }

  // Detect country and cache the result
  try {
    const country = await detectUserCountry()
    localStorage.setItem('detectedCountry', country)
    localStorage.setItem('detectedCountryTime', Date.now().toString())
    return country
  } catch (error) {
    console.warn('Country detection failed:', error)
    return DEFAULT_COUNTRY
  }
}

/**
 * Clear cached country detection
 */
export const clearCountryCache = () => {
  localStorage.removeItem('detectedCountry')
  localStorage.removeItem('detectedCountryTime')
}

/**
 * Force refresh country detection (ignores cache)
 * @returns {Promise<string>} Country name
 */
export const forceRefreshCountry = async () => {
  try {
    clearCountryCache()
    const country = await detectUserCountry()
    localStorage.setItem('detectedCountry', country)
    localStorage.setItem('detectedCountryTime', Date.now().toString())
    return country
  } catch (error) {
    console.warn('Force refresh country detection failed:', error)
    return DEFAULT_COUNTRY
  }
}

/**
 * Check if current user has legacy USA country data
 * @param {Object} user - User object
 * @returns {boolean} True if user has legacy USA data
 */
export const hasLegacyUSAData = (user) => {
  const country = user?.address?.country
  return country === 'USA' || country === 'United States' || country === 'US'
}

export default {
  DEFAULT_COUNTRY,
  COUNTRIES,
  getCountryFromTimezone,
  getCountryFromLocale,
  getCountryFromIP,
  getCountryFromGeolocation,
  detectUserCountry,
  getDynamicCountry,
  clearCountryCache,
  forceRefreshCountry,
  hasLegacyUSAData
}
