import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './scss/_bondPending.module.scss'
import Spinner from '@/loader/Spinner'
import RejectedList from '@/reusable/RejectedList'

const IntegrationPending = () => {
    const navigate = useNavigate()
    const [reject, setReject] = useState(false)

    const hasRejectedItems = false
    const rejectedItems = hasRejectedItems ? [
        { name: "Instagram" },
        { name: "Outlook" }
    ] : []

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (hasRejectedItems) {
                setReject(true)
                setTimeout(() => {
                    navigate('/wizard/integration-confirmation', { replace: true })
                }, 2000)
            } else {
                navigate('/wizard/integration-confirmation', { replace: true })
            }
        }, 1500)

        return () => clearTimeout(timerId)
    }, [navigate, hasRejectedItems])

    return (
        <div className={styles.bondPendingContainer}>
            {reject ? (
                <div className={styles.rejectContainer}>
                    <p className={styles.rejectTitle}>Rejected</p>
                    <p className={styles.rejectDescription}>
                        Our partner has rejected the apps and services you've chosen to connect. Please try again.
                    </p>

                    <div className={styles.rejectedListContainer}>
                        <RejectedList rejectedItems={rejectedItems} />
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.spinnerContainer}>
                        <Spinner />
                    </div>
                    <div className={styles.header}>
                        <p className={styles.title}>Waiting for your partner</p>
                        <p className={styles.description}>
                            Our partner is now reviewing the apps and services you've chosen to connect. They'll confirm or update these selections to ensure you both agree before we proceed.
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default IntegrationPending