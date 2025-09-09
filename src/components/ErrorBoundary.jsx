import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}>
          <AlertTriangle 
            size={64} 
            style={{ 
              color: 'var(--danger-color)', 
              marginBottom: '1rem' 
            }} 
          />
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Something went wrong
          </h2>
          
          <p style={{ 
            marginBottom: '2rem', 
            color: 'var(--text-secondary)',
            maxWidth: '500px'
          }}>
            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={this.handleRetry}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            
            <button
              onClick={this.handleGoHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)'
                e.target.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = 'var(--primary-color)'
              }}
            >
              <Home size={18} />
              Go Home
            </button>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <details style={{ 
              marginTop: '2rem', 
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius)',
              maxWidth: '100%',
              overflow: 'auto'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                marginBottom: '1rem',
                color: 'var(--text-secondary)'
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                fontSize: '0.875rem', 
                textAlign: 'left',
                color: 'var(--danger-color)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
