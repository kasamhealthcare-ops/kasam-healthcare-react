import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getDynamicCountry,
  getCountryFromTimezone,
  getCountryFromLocale,
  clearCountryCache,
  forceRefreshCountry,
  hasLegacyUSAData,
  DEFAULT_COUNTRY
} from '../utils/locationUtils'

/**
 * Test component to verify country detection functionality
 * This component can be temporarily added to any page for testing
 */
const CountryDetectionTest = () => {
  const { user } = useAuth()
  const [detectionResults, setDetectionResults] = useState({
    dynamic: null,
    timezone: null,
    locale: null,
    loading: true
  })

  useEffect(() => {
    const runTests = async () => {
      setDetectionResults(prev => ({ ...prev, loading: true }))

      try {
        // Test timezone detection
        const timezoneCountry = getCountryFromTimezone()
        
        // Test locale detection
        const localeCountry = getCountryFromLocale()
        
        // Test dynamic detection
        const dynamicCountry = await getDynamicCountry()

        setDetectionResults({
          dynamic: dynamicCountry,
          timezone: timezoneCountry,
          locale: localeCountry,
          loading: false
        })
      } catch (error) {
        console.error('Country detection test failed:', error)
        setDetectionResults(prev => ({ ...prev, loading: false }))
      }
    }

    runTests()
  }, [])

  const handleClearCache = () => {
    clearCountryCache()
    window.location.reload()
  }

  const handleForceRefresh = async () => {
    setDetectionResults(prev => ({ ...prev, loading: true }))
    try {
      const refreshedCountry = await forceRefreshCountry()
      setDetectionResults(prev => ({
        ...prev,
        dynamic: refreshedCountry,
        loading: false
      }))
    } catch (error) {
      console.error('Force refresh failed:', error)
      setDetectionResults(prev => ({ ...prev, loading: false }))
    }
  }

  if (detectionResults.loading) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #007bff', 
        borderRadius: '8px', 
        margin: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>🌍 Country Detection Test</h3>
        <p>Testing country detection methods...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #007bff', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🌍 Country Detection Test Results</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Default Country:</strong> {DEFAULT_COUNTRY}
      </div>

      {user && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: hasLegacyUSAData(user) ? '#fff3cd' : '#d4edda', borderRadius: '4px' }}>
          <strong>Current User Country:</strong> {user.address?.country || 'Not set'}
          {hasLegacyUSAData(user) && (
            <div style={{ color: '#856404', fontSize: '12px', marginTop: '5px' }}>
              ⚠️ Legacy USA data detected - will be auto-updated to dynamic detection
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Timezone Detection:</strong> {detectionResults.timezone}
        <small style={{ marginLeft: '10px', color: '#666' }}>
          (Based on: {Intl.DateTimeFormat().resolvedOptions().timeZone})
        </small>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Locale Detection:</strong> {detectionResults.locale}
        <small style={{ marginLeft: '10px', color: '#666' }}>
          (Based on: {navigator.language || navigator.userLanguage})
        </small>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Dynamic Detection:</strong> {detectionResults.dynamic}
        <small style={{ marginLeft: '10px', color: '#666' }}>
          (Combined result with caching)
        </small>
      </div>

      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleClearCache}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Cache & Reload
        </button>

        <button
          onClick={handleForceRefresh}
          disabled={detectionResults.loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: detectionResults.loading ? 'not-allowed' : 'pointer',
            opacity: detectionResults.loading ? 0.6 : 1
          }}
        >
          {detectionResults.loading ? 'Detecting...' : 'Force Refresh'}
        </button>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Note:</strong> This test component should be removed in production.
        <br />
        The dynamic detection will use cached results for 24 hours to avoid repeated API calls.
      </div>
    </div>
  )
}

export default CountryDetectionTest
