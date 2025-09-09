import React from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight, User, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useProfileCompletion } from '../hooks/useProfileCompletion'
import './ProfileCompletionBanner.css'

const ProfileCompletionBanner = () => {
  const {
    showCompletionPrompt,
    analysis,
    statusMessage,
    nextAction,
    dismissPrompt
  } = useProfileCompletion()

  // Banner will show on every page refresh if profile is incomplete
  // Temporary dismissals only last for the current session
  if (!showCompletionPrompt) {
    return null
  }

  const getStatusIcon = () => {
    switch (statusMessage.type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'warning':
        return <AlertCircle size={20} />
      case 'info':
        return <Info size={20} />
      case 'error':
        return <AlertCircle size={20} />
      default:
        return <User size={20} />
    }
  }

  const getStatusColor = () => {
    switch (statusMessage.type) {
      case 'success':
        return 'success'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      case 'error':
        return 'error'
      default:
        return 'info'
    }
  }

  return (
    <div className={`profile-completion-banner ${getStatusColor()}`}>
      <div className="banner-content">
        <div className="banner-icon">
          {getStatusIcon()}
        </div>
        
        <div className="banner-text">
          <h4>{statusMessage.title}</h4>
          <p>{statusMessage.message}</p>
          
          {nextAction && (
            <div className="next-action">
              <span className="next-action-icon">{nextAction.categoryIcon}</span>
              <span className="next-action-text">{nextAction.message}</span>
            </div>
          )}
        </div>

        <div className="banner-progress">
          <div className="progress-circle">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${analysis.completionPercentage * 1.005} 100.5`}
                strokeDashoffset="25.125"
                transform="rotate(-90 20 20)"
                className="progress-fill"
              />
            </svg>
            <span className="progress-text">{analysis.completionPercentage}%</span>
          </div>
        </div>

        <div className="banner-actions">
          {statusMessage.action && (
            <Link
              to="/profile/complete"
              className="btn btn-primary btn-sm"
              onClick={() => dismissPrompt(true)}
            >
              {statusMessage.action}
              <ArrowRight size={16} />
            </Link>
          )}

          <button
            onClick={() => dismissPrompt(true)}
            className="btn-close"
            title="Hide for this session (will reappear on page refresh)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Detailed breakdown for lower completion */}
      {analysis.completionPercentage < 70 && (
        <div className="banner-details">
          <div className="missing-categories">
            <span className="details-label">Missing:</span>
            {analysis.missingCategories.slice(0, 3).map((category, index) => (
              <span key={category} className="missing-category">
                {analysis.categoryAnalysis[category]?.icon} {analysis.categoryAnalysis[category]?.name}
                {index < Math.min(analysis.missingCategories.length, 3) - 1 && ', '}
              </span>
            ))}
            {analysis.missingCategories.length > 3 && (
              <span className="more-categories">
                +{analysis.missingCategories.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCompletionBanner
