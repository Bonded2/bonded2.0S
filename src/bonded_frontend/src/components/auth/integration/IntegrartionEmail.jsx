import React, { useEffect } from 'react'
import styles from './scss/_integrationmessage.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import ToggleSwitchList from '@/reusable/ToggleSwitchList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setEmailServices, setSingleEmailService } from '@/store/slices/integrationSlice'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IntegrartionEmail = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email } = useAppSelector((state) => state.integration);
    const handleNavigateToStep = (step) => {
        navigate(step);
    }

    const items = email.emailChatPlatform.map(p => ({ id: p.code, label: p.name }))
    const disabledIds = items.map(i => i.id)
    const maskedValues = Object.fromEntries(items.map(it => [it.id, false]))

    const handleEmailServicesChange = (next, meta) => {
        if (meta && typeof meta.id !== 'undefined') {
            dispatch(setSingleEmailService({ id: meta.id, value: next[meta.id] }))
            return
        }
        dispatch(setEmailServices(next))
    }

    useEffect(() => {
        try {
            const saved = localStorage.getItem('integration.emailServices')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setEmailServices(parsed))
                }
            }
        } catch (e) {

        }

    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.emailServices',
                JSON.stringify(email.emailServices || {})
            )
        } catch (e) {
        }
    }, [email.emailServices])

    return (
        <div className={styles.integrationMessageContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Emails
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            <div className={styles.integrationMessageContent}>
                <p>Pick the social media platforms to connect with Bonded. Stamps are created only when posts, photos or interactions clearly include both you and your partner. Everything else is ignored. read more</p>
            </div>
            <div className={styles.toggleSwitchList}>
                <ToggleSwitchList
                    items={items}
                    values={maskedValues}
                    onChange={handleEmailServicesChange}
                    disabledIds={disabledIds}
                />
            </div>

            <div className={styles.integrationMessageButton}>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/integration-media')}
                >
                    Next
                </Button>
            </div>

            {/* Navigation Buttons */}
            <div className={styles.nationalitiesButton}>
                <div className={styles.nationalitiesButtonDual}>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualLeft}
                        onClick={() => navigate('/wizard/integration-message')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/integration-media')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default IntegrartionEmail