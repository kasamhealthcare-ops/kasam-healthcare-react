import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDynamicCountry } from '../utils/locationUtils'
import { Link } from 'react-router-dom'
import './Profile.css'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalHistory: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Detect user's country dynamically
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const detectedCountry = await getDynamicCountry()
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            country: detectedCountry
          }
        }))
      } catch (error) {
        console.warn('Failed to detect country:', error)
        // Keep default 'India'
      }
    }

    // Detect country if user doesn't have one set OR if they have "USA" (legacy data)
    const currentCountry = user?.address?.country
    if (!currentCountry || currentCountry === 'USA' || currentCountry === 'United States') {
      detectCountry()
    }
  }, [user?.address?.country])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        },
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || '',
          relationship: user.emergencyContact?.relationship || ''
        },
        medicalHistory: user.medicalHistory || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Handle nested object properties
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Clean and format the data before sending
      const cleanPhoneNumber = (phone) => {
        if (!phone) return ''
        let cleaned = phone.replace(/[\s\-()]/g, '')
        // Remove leading 0 if present (common in Indian mobile numbers)
        if (cleaned.startsWith('0') && cleaned.length === 11) {
          cleaned = cleaned.substring(1)
        }
        return cleaned
      }

      const cleanedData = {
        ...formData,
        // Clean phone numbers
        phone: cleanPhoneNumber(formData.phone),
        // Ensure address object exists and is properly formatted
        address: {
          street: formData.address?.street || '',
          city: formData.address?.city || '',
          state: formData.address?.state || '',
          zipCode: formData.address?.zipCode || '',
          country: formData.address?.country || 'India'
        },
        // Ensure emergency contact object exists and is properly formatted
        emergencyContact: {
          name: formData.emergencyContact?.name || '',
          phone: cleanPhoneNumber(formData.emergencyContact?.phone),
          relationship: formData.emergencyContact?.relationship || ''
        }
      }

      // Remove empty nested objects
      if (!cleanedData.address.street && !cleanedData.address.city && !cleanedData.address.state && !cleanedData.address.zipCode) {
        delete cleanedData.address
      }

      if (!cleanedData.emergencyContact.name && !cleanedData.emergencyContact.phone) {
        delete cleanedData.emergencyContact
      }

      const result = await updateProfile(cleanedData)

      if (result.success) {
        setMessage('Profile updated successfully!')
        setIsEditing(false)
      } else {
        setMessage(result.error || 'Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsEditing(false)
    // Reset form data to original user data
    if (user) {
      let defaultCountry = user.address?.country || 'India'

      // If user doesn't have a country set OR has legacy "USA" data, detect it dynamically
      const currentCountry = user.address?.country
      if (!currentCountry || currentCountry === 'USA' || currentCountry === 'United States') {
        try {
          defaultCountry = await getDynamicCountry()
        } catch (error) {
          console.warn('Failed to detect country on cancel:', error)
          defaultCountry = 'India'
        }
      }

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: defaultCountry
        },
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          phone: user.emergencyContact?.phone || '',
          relationship: user.emergencyContact?.relationship || ''
        },
        medicalHistory: user.medicalHistory || ''
      })
    }
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <h1>Profile</h1>
          <p>Please log in to view your profile.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-actions">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true} // Email should not be editable
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContact.name">Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Emergency contact name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContact.phone">Emergency Contact Phone</label>
                <input
                  type="tel"
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Emergency contact number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContact.relationship">Relationship</label>
                <input
                  type="text"
                  id="emergencyContact.relationship"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Relationship (e.g., Father, Mother, Spouse)"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.street">Street Address</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="City"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="ZIP/Postal Code"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address.country">Country</label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Medical Information</h3>
            <div className="form-group">
              <label htmlFor="medicalHistory">Medical History</label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                placeholder="Any relevant medical history, allergies, or conditions"
              />
            </div>
          </div>
        </form>

        <div className="profile-links">
          <Link to="/dashboard" className="link">← Back to Dashboard</Link>
          <Link to="/profile/complete" className="link">Complete Profile →</Link>
        </div>
      </div>
    </div>
  )
}

export default Profile
