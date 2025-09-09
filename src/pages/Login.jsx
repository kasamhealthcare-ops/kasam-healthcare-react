import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react'
import EmailOTPAuth from '../components/EmailOTPAuth'
import './Login.css'

const Login = () => {
  const { login, loginWithOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [adminData, setAdminData] = useState({
    email: 'admin@kasamhealthcare.com',
    password: ''
  })

  const from = location.state?.from?.pathname

  const handleAdminChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value
    })
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const result = await login(adminData.email, adminData.password)

    if (result.success) {
      setMessage({ type: 'success', text: 'Admin login successful! Redirecting...' })
      setTimeout(() => {
        const redirectPath = from || '/admin'
        navigate(redirectPath, { replace: true })
      }, 1000)
    } else {
      setMessage({ type: 'error', text: result.error })
    }

    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleOTPSuccess = async (result) => {
    try {
      setMessage({ type: 'success', text: 'Authentication successful! Redirecting...' })

      // Use the loginWithOTP method from AuthContext
      const authResult = await loginWithOTP(result.token, result.user)

      if (authResult.success) {
        setTimeout(() => {
          const redirectPath = from || (result.user.role === 'admin' || result.user.role === 'doctor' ? '/admin' : '/dashboard')
          navigate(redirectPath, { replace: true })
        }, 1000)
      } else {
        setMessage({ type: 'error', text: authResult.error || 'Authentication failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Authentication failed' })
    }
  }

  const handleOTPError = (error) => {
    setMessage({ type: 'error', text: error.message || 'Authentication failed' })
  }


  return (
    <div className="auth-page">
      <div className="auth-layout">
        {/* Left Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-brand">
              <h1>Welcome Back!</h1>
              <p>Sign in to access your healthcare services</p>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                <span>{message.text}</span>
              </div>
            )}

            <div className="auth-forms">
              {!showAdminLogin ? (
                /* Email OTP Authentication */
                <div className="email-auth-container">
                  <EmailOTPAuth
                    onSuccess={handleOTPSuccess}
                    onError={handleOTPError}
                    loading={loading}
                    setLoading={setLoading}
                  />

                  <div className="admin-access">
                    <button
                      className="admin-login-toggle"
                      onClick={() => setShowAdminLogin(true)}
                      disabled={loading}
                    >
                      <Shield size={16} />
                      Admin Login
                    </button>
                  </div>
                </div>
            ) : (
              /* Admin Login Form */
              <div className="admin-login-form">
                <div className="admin-header">
                  <Shield size={24} />
                  <h3>Admin Login</h3>
                </div>

                <form onSubmit={handleAdminSubmit}>
                  <div className="form-group">
                    <label htmlFor="adminEmail">
                      <Mail size={18} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="adminEmail"
                      name="email"
                      value={adminData.email}
                      onChange={handleAdminChange}
                      required
                      placeholder="admin@kasamhealthcare.com"
                      disabled={loading}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adminPassword">
                      <Lock size={18} />
                      Password
                    </label>
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="adminPassword"
                        name="password"
                        value={adminData.password}
                        onChange={handleAdminChange}
                        required
                        placeholder="Enter admin password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In as Admin'}
                  </button>
                </form>

                <div className="back-to-email">
                  <button
                    className="back-button"
                    onClick={() => {
                      setShowAdminLogin(false)
                      setAdminData({ email: 'admin@kasamhealthcare.com', password: '' })
                      setMessage({ type: '', text: '' })
                    }}
                    disabled={loading}
                  >
                    ← Back to Email Sign-In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="auth-illustration-section">
        <div className="illustration-container">
          <div className="illustration-content">
            {/* Medical Healthcare Animation */}
            <div className="medical-animation">
              {/* Animated Stethoscope */}
              <div className="stethoscope-container">
                <div className="stethoscope-head">
                  <div className="head-inner"></div>
                </div>
                <div className="stethoscope-tube">
                  <div className="tube-segment s1"></div>
                  <div className="tube-segment s2"></div>
                  <div className="tube-segment s3"></div>
                  <div className="tube-segment s4"></div>
                </div>
                <div className="stethoscope-earpieces">
                  <div className="earpiece left"></div>
                  <div className="earpiece right"></div>
                </div>
              </div>

              {/* Heartbeat Monitor */}
              <div className="heartbeat-monitor">
                <div className="monitor-screen">
                  <div className="heartbeat-line">
                    <div className="beat-segment b1"></div>
                    <div className="beat-segment b2"></div>
                    <div className="beat-segment b3"></div>
                    <div className="beat-segment b4"></div>
                    <div className="beat-segment b5"></div>
                  </div>
                  <div className="heart-rate">72 BPM</div>
                </div>
              </div>

              {/* Medical Cross */}
              <div className="medical-cross-animated">
                <div className="cross-horizontal"></div>
                <div className="cross-vertical"></div>
                <div className="cross-glow"></div>
              </div>

              {/* Pills Animation */}
              <div className="pills-container">
                <div className="pill pill-1">
                  <div className="pill-half half-1"></div>
                  <div className="pill-half half-2"></div>
                </div>
                <div className="pill pill-2">
                  <div className="pill-half half-1"></div>
                  <div className="pill-half half-2"></div>
                </div>
                <div className="pill pill-3">
                  <div className="pill-half half-1"></div>
                  <div className="pill-half half-2"></div>
                </div>
              </div>

              {/* Medical Clipboard */}
              <div className="clipboard-container">
                <div className="clipboard">
                  <div className="clipboard-clip"></div>
                  <div className="clipboard-paper">
                    <div className="paper-line line-1"></div>
                    <div className="paper-line line-2"></div>
                    <div className="paper-line line-3"></div>
                    <div className="checkmark check-1">✓</div>
                    <div className="checkmark check-2">✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Login
