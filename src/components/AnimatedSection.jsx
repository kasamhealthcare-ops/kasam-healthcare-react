import { useInView } from 'react-intersection-observer'
import { useState, useEffect, useRef } from 'react'

const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  duration = 0.4,
  once = true
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    setIsInitialized(true)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [ref, inView] = useInView({
    threshold: isMobile ? 0.05 : 0.1,
    triggerOnce: once,
    rootMargin: isMobile ? '150px' : '100px',
    // Add initial trigger for elements already in view on page load
    initialInView: false
  })

  // Handle animation state
  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true
    }
  }, [inView])

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={{ opacity: 1, transform: 'none' }}>
        {children}
      </div>
    )
  }

  // On mobile, use simpler animation
  if (isMobile) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: isInitialized ? (inView ? 1 : 0.8) : 1,
          transform: isInitialized ? (inView ? 'translateY(0)' : 'translateY(10px)') : 'none',
          transition: isInitialized ? `opacity ${duration * 0.7}s ease-out ${delay}s, transform ${duration * 0.7}s ease-out ${delay}s` : 'none'
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        minHeight: 'auto',
        opacity: isInitialized ? (inView || hasAnimated.current ? 1 : 0.2) : 1,
        transform: isInitialized ? (inView || hasAnimated.current ? 'translateY(0)' : 'translateY(20px)') : 'none',
        transition: isInitialized ? `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s` : 'none',
        // Ensure content is always accessible
        visibility: 'visible'
      }}
    >
      {children}
    </div>
  )
}

export default AnimatedSection
