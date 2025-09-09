// Performance monitoring utilities

// Debounce function to limit function calls
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function to limit function calls
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading utility for images
export const lazyLoadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Performance measurement utility
export const measurePerformance = (name, fn) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()

  // Return timing information instead of logging
  return {
    result,
    timing: end - start,
    name
  }
}

// Memory usage monitoring (development only) - Returns memory stats instead of logging
export const getMemoryUsage = () => {
  if (typeof performance !== 'undefined' && performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576),
      total: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    }
  }
  return null
}

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options })
}

// Preload critical resources
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Optimize animations based on user preference
export const getOptimizedAnimationConfig = (config) => {
  if (prefersReducedMotion()) {
    return {
      ...config,
      duration: 0,
      delay: 0
    }
  }
  return config
}

// Initialize animations on page load - Clean Flos style
export const initializeAnimations = () => {
  // Add page-loaded class to trigger animations
  document.body.classList.add('page-loaded')

  // Force repaint to ensure animations start
  document.body.offsetHeight

  // Restart CSS animations that might have been paused
  const animatedElements = document.querySelectorAll('[class*="animate-"], [style*="animation"]')
  animatedElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element)
    if (computedStyle.animationName && computedStyle.animationName !== 'none') {
      element.style.animationPlayState = 'running'
    }
  })
}

// Call on page load and visibility change
export const setupAnimationHandlers = () => {
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations)
  } else {
    initializeAnimations()
  }

  // Reinitialize when page becomes visible (handles tab switching)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(initializeAnimations, 100)
    }
  })

  // Handle page refresh/reload
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      // Page was loaded from cache
      setTimeout(initializeAnimations, 50)
    }
  })
}
