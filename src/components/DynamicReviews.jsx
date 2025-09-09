import { useState, useEffect, useCallback } from 'react'
import { Star, RefreshCw, MapPin, Phone } from 'lucide-react'
import { reviewsAPI } from '../services/backendAPI'
import './DynamicReviews.css'

const DynamicReviews = ({ limit = 5, showPlaceDetails = false, autoRefreshInterval = 1800000 }) => { // 30 minutes default - reduced frequency
  const [reviews, setReviews] = useState([])
  const [placeDetails, setPlaceDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await reviewsAPI.getReviews(limit)
      setReviews(response.data.reviews || [])
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const loadPlaceDetails = useCallback(async () => {
    try {
      const response = await reviewsAPI.getPlaceDetails()
      setPlaceDetails(response.data)
    } catch {
      // Silently handle place details loading errors
    }
  }, [])

  const autoRefreshReviews = useCallback(async () => {
    try {
      // Silently refresh reviews in the background
      await reviewsAPI.refreshReviews()
      await loadReviews()
      if (showPlaceDetails) {
        await loadPlaceDetails()
      }
    } catch {
      // Don't set error state for auto-refresh failures to avoid disrupting user experience
    }
  }, [loadReviews, showPlaceDetails, loadPlaceDetails])

  useEffect(() => {
    loadReviews()
    if (showPlaceDetails) {
      loadPlaceDetails()
    }

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      autoRefreshReviews()
    }, autoRefreshInterval)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [limit, showPlaceDetails, autoRefreshInterval, loadReviews, autoRefreshReviews, loadPlaceDetails])

  const formatExactDate = (timestamp) => {
    const date = new Date(timestamp * 1000) // Convert to milliseconds
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  if (loading) {
    return (
      <div className="reviews-loading">
        <RefreshCw className="loading-spinner" size={24} />
        <p>Loading reviews...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="reviews-error">
        <p>{error}</p>
        <button onClick={loadReviews} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="dynamic-reviews">
      {showPlaceDetails && placeDetails && (
        <div className="place-details">
          <div className="place-header">
            <h3>{placeDetails.name}</h3>
          </div>
          <div className="place-rating">
            <div className="rating-stars">
              {renderStars(Math.floor(placeDetails.rating))}
            </div>
            <span className="rating-text">
              {placeDetails.rating}/5 ({placeDetails.totalRatings} reviews)
            </span>
          </div>
          {placeDetails.address && (
            <div className="place-info">
              <MapPin size={14} />
              <span>{placeDetails.address}</span>
            </div>
          )}
          {placeDetails.phone && (
            <div className="place-info">
              <Phone size={14} />
              <span>{placeDetails.phone}</span>
            </div>
          )}
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews available</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  {review.profilePhoto && (
                    <img 
                      src={review.profilePhoto} 
                      alt={review.author}
                      className="reviewer-avatar"
                    />
                  )}
                  <div>
                    <h4 className="reviewer-name">{review.author}</h4>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="review-time">
                  {formatExactDate(review.time)}
                </div>
              </div>
              <div className="review-text">
                {review.text}
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  )
}

export default DynamicReviews
