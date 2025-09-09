import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import './ResetPassword.css'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    resetToken: searchParams.get('token') || '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' })
    }
  }

  const validateForm = () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Email is required' })
      return false
    }
    if (!formData.resetToken) {
      setMessage({ type: 'error', text: 'Reset token is required' })
      return false
    }
    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' })
      return false
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const baseUrl = import.meta.env.VITE_API_URL
      const response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          resetToken: formData.resetToken,
          newPassword: formData.newPassword
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to reset password. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reset-password-page">
      <div className="container">
        <div className="reset-password-container">
          <div className="reset-password-header">
            <Link to="/forgot-password" className="back-link">
              <ArrowLeft size={20} />
              Back to Forgot Password
            </Link>
            <h1>Reset Your Password</h1>
            <p>
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          {!isSuccess ? (
            <form className="reset-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="resetToken">Reset Code</label>
                <input
                  type="text"
                  id="resetToken"
                  name="resetToken"
                  value={formData.resetToken}
                  onChange={handleChange}
                  required
                  placeholder="Enter the 6-digit reset code"
                  maxLength="6"
                />
                <small>Check the server console for your reset code (development mode)</small>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">
                  <Lock size={18} />
                  New Password
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter your new password"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={18} />
                  Confirm New Password
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your new password"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary reset-password-btn" 
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Password Reset Successful!</h3>
              <p>
                Your password has been reset successfully. You will be redirected to the login page in a few seconds.
              </p>
              <Link to="/login" className="btn btn-primary">
                Go to Login Now
              </Link>
            </div>
          )}

          <div className="reset-password-footer">
            <p>
              Remember your password? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
