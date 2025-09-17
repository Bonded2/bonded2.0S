import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './scss/_bondPending.module.scss'
import Spinner from '@/loader/Spinner'


const PartnerPending = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const timerId = setTimeout(() => {
            navigate('/wizard/partner-confirmation', { replace: true })
        }, 1500)

        return () => clearTimeout(timerId)
    }, [navigate])

    return (
        <div className={styles.bondPendingContainer}>
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
            <div className={styles.header}>
                <p className={styles.title}>Waiting for your partner</p>
                <p className={styles.description}>
                    Your partner is now reviewing the details you’ve shared and adding their own information. Together, this completes your Relationship Passport.
                </p>
            </div>

        </div>
    )
}

export default PartnerPending