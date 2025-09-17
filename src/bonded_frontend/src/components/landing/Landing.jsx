import styles from './scss/_landing.module.scss'
import logo1 from '@/assets/logo/logo1.png'
import { LandingFunction } from './LandingFunction'

const Landing = ({ onComplete }) => {
  const { isLoading, logoLoaded, handleLogoLoad } = LandingFunction(onComplete)

  return (
    <div className={styles.landing}>
      <div className={styles.container}>
        <img
          src={logo1}
          loading="eager"
          alt="logo"
          onLoad={handleLogoLoad}
          className={styles.logo}
        />
      </div>
    </div>
  )
}

export default Landing