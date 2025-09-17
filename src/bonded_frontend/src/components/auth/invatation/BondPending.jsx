import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './scss/_bondPending.module.scss'
import Spinner from '@/loader/Spinner'

const BondPending = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const timerId = setTimeout(() => {
            navigate('/wizard/bond-confirmation', { replace: true })
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
                    We’ve sent your invitation. Once your partner accepts, we’ll begin syncing your details and building your Relationship Passport.
                </p>
            </div>

        </div>
    )
}

export default BondPending