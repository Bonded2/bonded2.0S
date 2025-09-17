import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './scss/_bondPending.module.scss'
import Spinner from '@/loader/Spinner'

const PaymentPending = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const timerId = setTimeout(() => {
            navigate('/wizard/payment-comfirmation', { replace: true })
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
                    Your partner now needs to confirm their subscription. We’ll only process payment once both of you have agreed, so you’re never charged alone.
                </p>
            </div>

        </div>
    )
}

export default PaymentPending