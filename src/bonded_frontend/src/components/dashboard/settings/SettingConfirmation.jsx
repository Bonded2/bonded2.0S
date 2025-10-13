import React, { useState, useEffect } from 'react'
import styles from './scss/_settingconfirmation.module.scss'
import Breadcrumb from '@/reusable/Breadcrumb'
import Button from '@/reusable/Button'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Spinner from '@/loader/Spinner'
import { useAppDispatch } from '@/store/hooks'
import { updateIntegrationStatus } from '@/store/slices/integrationSlice'

const SettingConfirmation = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    const breadcrumbItems = [
        { label: 'Settings', to: '/dashboard/settings' },
    ]

    useEffect(() => {
        // ANCHOR: First stage - Partner confirmation (1 second)
        const loadingTimer = setTimeout(() => {
            setIsLoading(false)
            setIsSuccess(true)

            // ANCHOR: Update Redux state to mark integrations as confirmed
            dispatch(updateIntegrationStatus({ 
                status: 'confirmed', 
                timestamp: Date.now(), 
                updatedBy: 'partner' 
            }))
        }, 1000)

        const successTimer = setTimeout(() => {
            navigate('/dashboard/settings')
        }, 2500)

        return () => {
            clearTimeout(loadingTimer)
            clearTimeout(successTimer)
        }
    }, [navigate, dispatch])

    return (
        <div className={styles.settingConfirmationContainer}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.settingConfirmationContent}>
                {isLoading ? (
                    <>
                        <div className={styles.spinnerContainer}>
                            <Spinner />
                        </div>
                        <div className={styles.header}>
                            <p className={styles.title}>Partner Confirmation Needed</p>
                            <p className={styles.description}>
                                Your integration settings have been sent to your partner for confirmation. Once they approve, the changes will be applied to your Relationship Passport.
                            </p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={() => navigate('/dashboard/settings')}
                                className={styles.backButton}
                            >
                                ← Back to Settings
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
                            <p className={styles.successTitle}>Integrations Updated</p>
                            <p className={styles.successDescription}>
                                Your integration settings have been successfully updated and confirmed by your partner.
                            </p>
                        </div>
                        <div className={styles.buttonContainer}>
                            <Button
                                variant="primary"
                                size="medium"
                                onClick={() => navigate('/dashboard/settings')}
                                className={styles.dashboardButton}
                            >
                                Back to Settings
                            </Button>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default SettingConfirmation