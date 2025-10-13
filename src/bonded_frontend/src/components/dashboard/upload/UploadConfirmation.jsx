import React, { useState, useEffect } from 'react'
import styles from './scss/_uploadconfirmation.module.scss'
import Breadcrumb from '@/reusable/Breadcrumb'
import Button from '@/reusable/Button'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Spinner from '@/loader/Spinner'

const UploadConfirmation = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    const breadcrumbItems = [
        { label: 'Dashboard', to: '/dashboard' },
    ]

    useEffect(() => {
        // ANCHOR: Simulate upload process for 1 second (mockup)
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
            setIsSuccess(true)
        }, 1000)

        // ANCHOR: After showing success, navigate to dashboard
        const successTimer = setTimeout(() => {
            navigate('/dashboard')
        }, 2500)

        return () => {
            clearTimeout(loadingTimer)
            clearTimeout(successTimer)
        }
    }, [navigate])

    return (
        <div className={styles.uploadConfirmationContainer}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.uploadConfirmationContent}>
                {isLoading ? (
                    <>
                        <div className={styles.spinnerContainer}>
                            <Spinner />
                        </div>
                        <div className={styles.header}>
                            <p className={styles.title}>Partner Confirmation Needed</p>
                            <p className={styles.description}>
                                Your request to upload has been sent to your partner. Once they confirm, your files will be added to your relationship partners.
                            </p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={() => navigate('/dashboard')}
                                className={styles.backButton}
                            >
                                ← Back
                            </Button>
                        </div>
                    </>
                ) : isSuccess ? (
                    <>
                        <div className={styles.iconContainer}>
                            <div className={styles.successIcon}>
                                <Check size={64} />
                            </div>
                        </div>
                        <div className={styles.header}>
                            <p className={styles.successTitle}>Upload successful</p>
                            <p className={styles.successDescription}>
                                Your new file upload has been approved by your partner.
                            </p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => navigate('/dashboard')}
                                className={styles.dashboardButton}
                            >
                                Back to dashboard
                            </Button>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default UploadConfirmation