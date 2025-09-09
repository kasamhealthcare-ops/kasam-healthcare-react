import { useState } from 'react'
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react'
import { authAPI } from '../services/backendAPI'
import './EmailOTPAuth.css'

const EmailOTPAuth = ({ onSuccess, onError, loading, setLoading }) => {
  const [step, setStep] = useState('email') // 'email', 'otp', 'register'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [userExists, setUserExists] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [otpSent, setOtpSent] = useState(false)
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: ''
  })

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await authAPI.sendOTP(email)
      
      if (result.success) {
        setUserExists(result.userExists)
        setOtpSent(true)
        setStep('otp')
        setMessage({ 
          type: 'success', 
          text: result.message 
        })

        // Show development OTP if available
        if (result.developmentOTP) {
          setMessage({ 
            type: 'info', 
            text: `Development Mode: Your OTP is ${result.developmentOTP}` 
          })
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to send OTP' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send OTP' })
    }

    setLoading(false)
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (!userExists && (!registrationData.firstName || !registrationData.lastName)) {
        setStep('register')
        setLoading(false)
        return
      }

      const result = await authAPI.verifyOTP(
        email, 
        otp, 
        userExists ? null : registrationData.firstName,
        userExists ? null : registrationData.lastName
      )
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        onSuccess(result)
      } else {
        setMessage({ type: 'error', text: result.message || 'Invalid OTP' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to verify OTP' })
    }

    setLoading(false)
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await authAPI.verifyOTP(
        email, 
        otp, 
        registrationData.firstName,
        registrationData.lastName
      )
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Registration successful!' })
        onSuccess(result)
      } else {
        setMessage({ type: 'error', text: result.message || 'Registration failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Registration failed' })
    }

    setLoading(false)
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await authAPI.sendOTP(email)
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'OTP resent successfully!' 
        })

        // Show development OTP if available
        if (result.developmentOTP) {
          setMessage({ 
            type: 'info', 
            text: `Development Mode: Your new OTP is ${result.developmentOTP}` 
          })
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to resend OTP' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to resend OTP' })
    }

    setLoading(false)
  }

  const resetForm = () => {
    setStep('email')
    setEmail('')
    setOtp('')
    setUserExists(false)
    setOtpSent(false)
    setMessage({ type: '', text: '' })
    setRegistrationData({ firstName: '', lastName: '' })
  }

  return (
    <div className="email-otp-auth">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'error' ? <AlertCircle size={20} /> : 
           message.type === 'success' ? <CheckCircle size={20} /> : 
           <Shield size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="auth-form">
          <div className="form-header">
            <h3>Enter Email Address</h3>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Sending OTP...
              </>
            ) : (
              <>
                Send Verification Code
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOTPSubmit} className="auth-form">
          <div className="form-header">
            <h3>Enter OTP Code</h3>
            <p>Code sent to <strong>{email}</strong></p>
          </div>

          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="Enter 6-digit code"
              disabled={loading}
              maxLength={6}
              className="otp-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || otp.length !== 6}>
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Verifying...
              </>
            ) : (
              <>
                {userExists ? 'Sign In' : 'Continue'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResendOTP}
              disabled={loading}
            >
              Resend Code
            </button>
            <button
              type="button"
              className="btn btn-text"
              onClick={resetForm}
              disabled={loading}
            >
              <ArrowLeft size={16} />
              Change Email
            </button>
          </div>
        </form>
      )}

      {step === 'register' && (
        <form onSubmit={handleRegistrationSubmit} className="auth-form">
          <div className="form-header">
            <h3>Complete Registration</h3>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={registrationData.firstName}
              onChange={(e) => setRegistrationData({
                ...registrationData,
                firstName: e.target.value
              })}
              required
              placeholder="Enter your first name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={registrationData.lastName}
              onChange={(e) => setRegistrationData({
                ...registrationData,
                lastName: e.target.value
              })}
              required
              placeholder="Enter your last name"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="spinner" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-text"
              onClick={() => setStep('otp')}
              disabled={loading}
            >
              <ArrowLeft size={16} />
              Back to Verification
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EmailOTPAuth
