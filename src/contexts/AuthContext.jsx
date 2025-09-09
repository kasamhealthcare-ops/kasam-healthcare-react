import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { authAPI, usersAPI } from '../services/backendAPI.js'
import { analyzeProfileCompletion } from '../utils/profileCompletion'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = Cookies.get('user')
        const token = localStorage.getItem('token')

        if (savedUser && token) {
          try {
            // Create timeout for auth validation - shorter timeout
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Auth validation timeout')), 5000)
            })

            try {
              // Check if backend is accessible first
              const serverUrl = import.meta.env.VITE_API_URL.replace('/api', '')
              const healthCheck = await Promise.race([
                fetch(`${serverUrl}/health`), // Use /health instead of /api/health
                new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 3000))
              ])

              if (healthCheck.ok) {
                // Backend is accessible, verify token
                const result = await Promise.race([
                  authAPI.getProfile(),
                  timeoutPromise
                ])

                if (result.success) {
                  setUser(result.data.user)
                } else {
                  clearAuthData()
                }
              } else {
                throw new Error('Backend not accessible')
              }
            } catch {
              // Use stored user data when backend is not accessible
              try {
                const parsedUser = JSON.parse(savedUser)
                setUser(parsedUser)
              } catch {
                clearAuthData()
              }
            }
          } catch (error) {
            // If it's a timeout or network error, try to use stored user data
            if (error.message.includes('timeout') || error.message.includes('Network')) {
              try {
                const parsedUser = JSON.parse(savedUser)
                setUser(parsedUser)
              } catch {
                clearAuthData()
              }
            } else {
              clearAuthData()
            }
          }
        }
      } catch {
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const clearAuthData = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    Cookies.remove('user')
  }

  const login = async (email, password, options = {}) => {
    try {
      // Handle Google OAuth login (legacy support)
      if (options.isGoogleAuth) {
        const { token, userData } = options

        setUser(userData)

        // Store user and token (already stored by AuthCallback)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })

        return { success: true, user: userData }
      }

      // Regular email/password login (for admin)
      const result = await authAPI.login(email, password)

      if (result.success) {
        const { user, token } = result.data

        setUser(user)

        // Store user and token
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        Cookies.set('user', JSON.stringify(user), { expires: 7 }) // 7 days

        return { success: true, user }
      }

      return { success: false, error: 'Login failed' }

    } catch (error) {

      // Return specific error messages
      if (error.message.includes('Network error')) {
        return { success: false, error: 'Unable to connect to server. Please check your internet connection.' }
      } else if (error.message.includes('401')) {
        return { success: false, error: 'Invalid email or password' }
      } else {
        return { success: false, error: error.message || 'Login failed. Please try again.' }
      }
    }
  }

  // Login with OTP (new method)
  const loginWithOTP = async (token, userData) => {
    try {
      setUser(userData)

      // Store user and token
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)
      Cookies.set('user', JSON.stringify(userData), { expires: 7 }) // 7 days

      return { success: true, user: userData }
    } catch (error) {
      console.error('OTP login error:', error)
      return { success: false, error: error.message || 'OTP login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const result = await authAPI.register(userData)

      if (result.success) {
        const { user, token } = result.data

        setUser(user)

        // Store user and token
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        Cookies.set('user', JSON.stringify(user), { expires: 7 })

        return { success: true, user }
      }

      return { success: false, error: 'Registration failed' }

    } catch (error) {

      // Return specific error messages
      if (error.message.includes('Network error')) {
        return { success: false, error: 'Unable to connect to server. Please check your internet connection.' }
      } else if (error.message.includes('already exists')) {
        return { success: false, error: 'User with this email already exists' }
      } else if (error.message.includes('validation')) {
        return { success: false, error: 'Please check your input and try again' }
      } else {
        return { success: false, error: error.message || 'Registration failed. Please try again.' }
      }
    }
  }

  const logout = async () => {
    try {
      // Try backend logout
      await authAPI.logout()
    } catch {
      // Backend logout failed, continue with local cleanup
    }

    // Clear local state and storage
    clearAuthData()
  }

  const updateProfile = async (updatedData) => {
    try {
      if (!user?._id) {
        throw new Error('User not found')
      }

      const result = await usersAPI.updateUser(user._id, updatedData)

      if (result.success) {
        const updatedUser = { ...user, ...result.data.user }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 })

        return { success: true, user: updatedUser }
      }

      return { success: false, error: 'Profile update failed' }

    } catch (error) {

      // Extract error message from different possible sources
      let errorMessage = 'Profile update failed'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors
        errorMessage = validationErrors.map(err => err.message).join(', ')
      } else if (error.message?.includes('Network error')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.'
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage,
        details: error.response?.data
      }
    }
  }

  const checkProfileCompletion = () => {
    if (!user) return null
    return analyzeProfileCompletion(user)
  }

  const value = {
    user,
    loading,
    login,
    loginWithOTP,
    register,
    logout,
    updateProfile,
    checkProfileCompletion,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'doctor',
    isPatient: user?.role === 'patient'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
