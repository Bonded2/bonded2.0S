import { useState, useEffect } from 'react'

export const LandingFunction = (onComplete) => {
    const [isLoading, setIsLoading] = useState(false)
    const [logoLoaded, setLogoLoaded] = useState(false)
  
    const handleLogoLoad = () => {
      setLogoLoaded(true)
      // Start loading animation after logo is loaded
      setTimeout(() => {
        setIsLoading(true)
      }, 500) 
    }
  
    useEffect(() => {
      if (isLoading) {
        const loadingTimer = setTimeout(() => {
          if (onComplete) {
            onComplete()
          }
        }, 2500)
  
        return () => clearTimeout(loadingTimer)
      }
    }, [isLoading, onComplete])
  
    useEffect(() => {
      return () => {
        setIsLoading(false)
        setLogoLoaded(false)
      }
    }, [])

    return {
        isLoading,
        logoLoaded,
        handleLogoLoad,
    }
}