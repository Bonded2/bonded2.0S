import React, { useEffect } from 'react'
import styles from './scss/_integrationmessage.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import ToggleSwitchList from '@/reusable/ToggleSwitchList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setVideoCallsServices, setSingleVideoCallsService } from '@/store/slices/integrationSlice'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IntegrartionVideoCalls = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { videoCalls } = useAppSelector((state) => state.integration);
    const handleNavigateToStep = (step) => {
        navigate(step);
    }

    const items = videoCalls.videoCallsChatPlatform.map(p => ({ id: p.code, label: p.name }))
    const disabledIds = items.map(i => i.id)
    const maskedValues = Object.fromEntries(items.map(it => [it.id, false]))

    const handleVideoCallsServicesChange = (next, meta) => {
        if (meta && typeof meta.id !== 'undefined') {
            dispatch(setSingleVideoCallsService({ id: meta.id, value: next[meta.id] }))
            return
        }
        dispatch(setVideoCallsServices(next))
    }

    useEffect(() => {
        try {
            const saved = localStorage.getItem('integration.videoCallsServices')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setVideoCallsServices(parsed))
                }
            }
        } catch (e) {

        }

    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.videoCallsServices',
                JSON.stringify(videoCalls.videoCallsServices || {})
            )
        } catch (e) {
        }
    }, [videoCalls.videoCallsServices])

    return (
        <div className={styles.integrationMessageContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Video calls
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            <div className={styles.integrationMessageContent}>
                <p>Select the calendars to connect with Bonded. Stamps are created only from events that involve both you and your partner. Other entries are ignored. read more</p>
            </div>
            <div className={styles.toggleSwitchList}>
                <ToggleSwitchList
                    items={items}
                    values={maskedValues}
                    onChange={handleVideoCallsServicesChange}
                    disabledIds={disabledIds}
                />
            </div>

            <div className={styles.integrationMessageButton}>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/integration-calendar')}
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
                        onClick={() => navigate('/wizard/integration-video-calls')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/integration-calendar')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default IntegrartionVideoCalls