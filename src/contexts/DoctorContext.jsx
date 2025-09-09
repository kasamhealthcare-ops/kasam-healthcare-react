import { createContext, useContext, useState } from 'react'

const DoctorContext = createContext()

export const useDoctor = () => {
  const context = useContext(DoctorContext)
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider')
  }
  return context
}

export const DoctorProvider = ({ children }) => {
  // Static doctor information
  const staticDoctor = {
    firstName: 'Dr. Jignesh',
    lastName: 'Parmar',
    phone: '+919898440880', // Real number from your website
    email: 'info@kasamhealthcare.in',
    specialization: 'General Medicine & Holistic Health'
  }

  const [doctor] = useState(staticDoctor)
  const [loading] = useState(false)
  const [error] = useState(null)

  // Helper functions
  const getDoctorPhone = () => {
    return doctor.phone
  }

  const getDoctorName = () => {
    return `${doctor.firstName} ${doctor.lastName}`
  }

  const getDoctorEmail = () => {
    return doctor.email
  }

  const getDoctorSpecialization = () => {
    return doctor.specialization
  }

  // Format phone number for display
  const getFormattedPhone = () => {
    const phone = getDoctorPhone()
    if (phone.startsWith('+91')) {
      // Format as +91 XXXXX XXXXX
      const number = phone.substring(3)
      return `+91 ${number.substring(0, 5)} ${number.substring(5)}`
    }
    return phone
  }

  // Get WhatsApp link
  const getWhatsAppLink = (message = 'Hello, I would like to book an appointment') => {
    const phone = getDoctorPhone().replace(/[^\d]/g, '') // Remove all non-digits
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const value = {
    doctor,
    loading,
    error,
    getDoctorPhone,
    getDoctorName,
    getDoctorEmail,
    getDoctorSpecialization,
    getFormattedPhone,
    getWhatsAppLink
  }

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  )
}

export default DoctorContext
