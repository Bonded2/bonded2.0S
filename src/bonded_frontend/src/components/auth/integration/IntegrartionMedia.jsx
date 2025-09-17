import React, { useEffect } from 'react'
import styles from './scss/_integrationmessage.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import ToggleSwitchList from '@/reusable/ToggleSwitchList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSocialMediaServices, setSingleSocialMediaService } from '@/store/slices/integrationSlice'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IntegrartionMedia = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { socialMedia } = useAppSelector((state) => state.integration);
    const handleNavigateToStep = (step) => {
        navigate(step);
    }

    const items = socialMedia.socialMediaChatPlatform.map(p => ({ id: p.code, label: p.name }))
    const disabledIds = items.map(i => i.id)
    const maskedValues = Object.fromEntries(items.map(it => [it.id, false]))

    const handleSocialMediaServicesChange = (next, meta) => {
        if (meta && typeof meta.id !== 'undefined') {
            dispatch(setSingleSocialMediaService({ id: meta.id, value: next[meta.id] }))
            return
        }
        dispatch(setSocialMediaServices(next))
    }

    useEffect(() => {
        try {
            const saved = localStorage.getItem('integration.socialMediaServices')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setSocialMediaServices(parsed))
                }
            }
        } catch (e) {

        }

    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.socialMediaServices',
                JSON.stringify(socialMedia.socialMediaServices || {})
            )
        } catch (e) {
        }
    }, [socialMedia.socialMediaServices])

    return (
        <div className={styles.integrationMessageContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Social media
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            <div className={styles.integrationMessageContent}>
                <p>Choose the video call platforms to connect with Bonded. Stamps are created only from calls between you and your partner. No unrelated calls are included. read more</p>
            </div>
            <div className={styles.toggleSwitchList}>
                <ToggleSwitchList
                    items={items}
                    values={maskedValues}
                    onChange={handleSocialMediaServicesChange}
                    disabledIds={disabledIds}
                />
            </div>

            <div className={styles.integrationMessageButton}>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/integration-video-calls')}
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
                        onClick={() => navigate('/wizard/integration-email')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/integration-video-calls')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default IntegrartionMedia