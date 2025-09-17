import styles from '../landing/scss/_landing.module.scss'
import logo1 from '@/assets/logo/logo1.png'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const BacktoLogIn = ({ onComplete }) => {
    const navigate = useNavigate()
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login')
        }, 1000)
        
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className={styles.landing}>
            <div className={styles.container}>
                <img
                    src={logo1}
                    loading="eager"
                    alt="logo"
                    className={styles.logo}
                />
            </div>
        </div>
    )
}

export default BacktoLogIn