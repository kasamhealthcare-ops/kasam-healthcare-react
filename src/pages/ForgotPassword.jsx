import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Send } from 'lucide-react'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [developmentToken, setDevelopmentToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const baseUrl = import.meta.env.VITE_API_URL
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setIsSubmitted(true)
        // Store development token if provided
        if (data.developmentToken) {
          setDevelopmentToken(data.developmentToken)
        }
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setMessage({ 
        type: 'error', 
        text: 'Failed to process password reset request. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div className="forgot-password-page">
      <div className="container">
        <div className="forgot-password-container">
          <div className="forgot-password-header">
            <Link to="/login" className="back-link">
              <ArrowLeft size={20} />
              Back to Login
            </Link>
            <h1>Reset Your Password</h1>
            <p>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          {!isSubmitted ? (
            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your registered email address"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary forgot-password-btn" 
                disabled={loading}
              >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <CheckCircle size={48} className="success-icon" />
              <h3>Reset Code Sent!</h3>
              <p>
                If an account with the email <strong>{email}</strong> exists,
                a 6-digit reset code has been generated.
              </p>
              {developmentToken && (
                <div className="development-notice">
                  <p><strong>Development Mode - Reset Code:</strong></p>
                  <div className="token-display">{developmentToken}</div>
                  <p>Use this code on the reset password page.</p>
                </div>
              )}
              {!developmentToken && (
                <div className="development-notice">
                  <p><strong>Development Mode:</strong></p>
                  <p>Check the server console for your reset code, then use it on the reset password page.</p>
                </div>
              )}
              <div className="success-actions">
                <Link
                  to={`/reset-password?email=${encodeURIComponent(email)}${developmentToken ? `&token=${developmentToken}` : ''}`}
                  className="btn btn-primary"
                >
                  Enter Reset Code
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Return to Login
                </Link>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                    setMessage({ type: '', text: '' })
                  }}
                >
                  Try Another Email
                </button>
              </div>
            </div>
          )}

          <div className="forgot-password-footer">
            <p>
              Remember your password? <Link to="/login">Sign in here</Link>
            </p>
            <p>
              Don't have an account? <Link to="/login">Create one here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
