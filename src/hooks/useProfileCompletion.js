import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  analyzeProfileCompletion, 
  getCompletionStatusMessage, 
  getNextAction 
} from '../utils/profileCompletion'

/**
 * Custom hook for managing profile completion state
 * @returns {Object} Profile completion data and methods
 */
export const useProfileCompletion = () => {
  const { user, isAuthenticated } = useAuth()
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false)
  const [dismissedPrompts, setDismissedPrompts] = useState(new Set())

  // Analyze profile completion
  const analysis = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        isComplete: false,
        completionPercentage: 0,
        missingFields: [],
        missingCategories: [],
        completedCategories: [],
        totalFields: 0,
        completedFields: 0,
        categoryAnalysis: {}
      }
    }
    
    return analyzeProfileCompletion(user)
  }, [user, isAuthenticated])

  // Get status message
  const statusMessage = useMemo(() => {
    return getCompletionStatusMessage(analysis)
  }, [analysis])

  // Get next recommended action
  const nextAction = useMemo(() => {
    return getNextAction(analysis)
  }, [analysis])

  // Check if profile completion should be shown
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setShowCompletionPrompt(false)
      return
    }

    // Don't show for admin/doctor users
    if (user.role === 'admin' || user.role === 'doctor') {
      setShowCompletionPrompt(false)
      return
    }

    // Don't show if profile is complete
    if (analysis.isComplete) {
      setShowCompletionPrompt(false)
      return
    }

    // Always show for incomplete profiles on refresh/page load
    // Only check dismissed prompts for temporary dismissals within the same session
    const dismissKey = `completion_${analysis.completionPercentage}`
    const sessionDismissed = sessionStorage.getItem(`dismissed_${dismissKey}`)

    if (sessionDismissed) {
      setShowCompletionPrompt(false)
      return
    }

    // Show completion prompt for incomplete profiles
    setShowCompletionPrompt(true)
  }, [analysis, isAuthenticated, user, dismissedPrompts])

  // Load dismissed prompts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dismissedProfilePrompts')
      if (saved) {
        setDismissedPrompts(new Set(JSON.parse(saved)))
      }
    } catch (error) {
      console.error('Error loading dismissed prompts:', error)
    }
  }, [])

  // Save dismissed prompts to localStorage
  const saveDismissedPrompts = (prompts) => {
    try {
      localStorage.setItem('dismissedProfilePrompts', JSON.stringify([...prompts]))
    } catch (error) {
      console.error('Error saving dismissed prompts:', error)
    }
  }

  // Dismiss completion prompt
  const dismissPrompt = (temporary = false) => {
    setShowCompletionPrompt(false)
    const dismissKey = `completion_${analysis.completionPercentage}`

    if (temporary) {
      // Temporary dismissal - only for current session
      sessionStorage.setItem(`dismissed_${dismissKey}`, 'true')
    } else {
      // Permanent dismissal - save to localStorage
      const newDismissed = new Set(dismissedPrompts)
      newDismissed.add(dismissKey)
      setDismissedPrompts(newDismissed)
      saveDismissedPrompts(newDismissed)
      // Also set session storage to prevent showing again in same session
      sessionStorage.setItem(`dismissed_${dismissKey}`, 'true')
    }
  }

  // Force show completion prompt
  const showPrompt = () => {
    setShowCompletionPrompt(true)
  }

  // Force refresh profile completion check (useful after profile updates)
  const refreshCompletionCheck = () => {
    const dismissKey = `completion_${analysis.completionPercentage}`
    sessionStorage.removeItem(`dismissed_${dismissKey}`)

    if (!analysis.isComplete && user?.role !== 'admin' && user?.role !== 'doctor') {
      setShowCompletionPrompt(true)
    }
  }

  // Reset all dismissed prompts
  const resetDismissedPrompts = () => {
    setDismissedPrompts(new Set())
    saveDismissedPrompts(new Set())

    // Clear all session storage dismissals
    const keysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('dismissed_completion_')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))

    setShowCompletionPrompt(!analysis.isComplete && user?.role !== 'admin' && user?.role !== 'doctor')
  }

  // Check if specific category needs attention
  const needsCategory = (category) => {
    return analysis.missingCategories.includes(category)
  }

  // Get completion percentage for specific category
  const getCategoryCompletion = (category) => {
    return analysis.categoryAnalysis[category]?.completionPercentage || 0
  }

  // Check if user should be redirected to profile completion
  const shouldRedirectToProfile = () => {
    if (!isAuthenticated || !user) return false
    if (user.role === 'admin' || user.role === 'doctor') return false

    // Redirect if completion is very low (less than 50%)
    return analysis.completionPercentage < 50
  }

  // Check if user can access certain features
  const canAccessFeature = (feature) => {
    switch (feature) {
      case 'appointments':
        // Need basic info and phone for appointments
        return analysis.completionPercentage >= 50 && 
               !needsCategory('basic')
      case 'medical_records':
        // Need more complete profile for medical records
        return analysis.completionPercentage >= 75
      case 'emergency_services':
        // Need emergency contact for emergency services
        return !needsCategory('emergency')
      default:
        return true
    }
  }

  // Get missing fields for a specific feature
  const getMissingFieldsForFeature = (feature) => {
    switch (feature) {
      case 'appointments':
        return analysis.missingFields.filter(field => 
          field.category === 'basic' || field.path === 'phone'
        )
      case 'medical_records':
        return analysis.missingFields.filter(field => 
          ['basic', 'address', 'personal'].includes(field.category)
        )
      case 'emergency_services':
        return analysis.missingFields.filter(field => 
          field.category === 'emergency'
        )
      default:
        return []
    }
  }

  return {
    // Analysis data
    analysis,
    statusMessage,
    nextAction,
    
    // State
    showCompletionPrompt,
    isComplete: analysis.isComplete,
    completionPercentage: analysis.completionPercentage,
    
    // Methods
    dismissPrompt,
    showPrompt,
    resetDismissedPrompts,
    refreshCompletionCheck,
    
    // Utility methods
    needsCategory,
    getCategoryCompletion,
    shouldRedirectToProfile,
    canAccessFeature,
    getMissingFieldsForFeature,
    
    // Computed values
    hasBasicInfo: !needsCategory('basic'),
    hasAddress: !needsCategory('address'),
    hasEmergencyContact: !needsCategory('emergency'),
    hasPersonalInfo: !needsCategory('personal')
  }
}

export default useProfileCompletion
