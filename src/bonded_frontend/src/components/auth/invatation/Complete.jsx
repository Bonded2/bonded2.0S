import styles from './scss/_complete.module.scss'
import logo4 from '@/assets/logo/logo4.png'
import Button from '@/reusable/Button'
import { useNavigate } from 'react-router-dom'

const Complete = () => {
    const navigate = useNavigate()

    return (
        <div className={styles.completeContainer}>

            <div className={styles.completeContent}>
                <div className={styles.logoContainer}>
                    <img src={logo4} loading="eager" alt="logo" />
                </div>
                <div className={styles.textTitle}>
                    <p>
                        Your Relationship Passport is ready!
                    </p>
                </div>
                <div className={styles.textContainer}>
                    <p>
                        Your Relationship Passport is now active. Bonded will begin collecting approved stamps of evidence and syncing them securely, so you can build a trusted record together.
                    </p>
                </div>

                <div className={styles.buttonContainer}>
                    <Button variant="primary" onClick={() => navigate('/login')}>
                        Next
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default Complete