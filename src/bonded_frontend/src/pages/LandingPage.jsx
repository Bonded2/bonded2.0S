import { useNavigate } from 'react-router-dom'
import Landing from '@/components/landing/Landing'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleLoadingComplete = () => {
    navigate('/onboard')
  }

  return (
    <>
      <Landing onComplete={handleLoadingComplete} />
    </>
  )
}

export default LandingPage