import React, { useEffect } from 'react'
import styles from './scss/_integrationmessage.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import ToggleSwitchList from '@/reusable/ToggleSwitchList'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setMessageServices, setSingleMessageService } from '@/store/slices/integrationSlice'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IntegrartionMessage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { directMessage } = useAppSelector((state) => state.integration);
    const handleNavigateToStep = (step) => {
        navigate(step);
    }

    const items = directMessage.chatPlatform.map(p => ({ id: p.code, label: p.name }))
    const enabledIds = ['openchat','telegram']
    const enabledSet = new Set(enabledIds)
    const maskedValues = Object.fromEntries(
        items.map(it => [it.id, enabledSet.has(String(it.id).toLowerCase()) ? Boolean(directMessage.messageServices[it.id]) : false])
    )

    const handleMessageServicesChange = (next, meta) => {
        if (meta && typeof meta.id !== 'undefined') {
            dispatch(setSingleMessageService({ id: meta.id, value: next[meta.id] }))
            return
        }
        dispatch(setMessageServices(next))
    }

    useEffect(() => {
        try {
            const saved = localStorage.getItem('integration.messageServices')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setMessageServices(parsed))
                }
            }
        } catch (e) {

        }

    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.messageServices',
                JSON.stringify(directMessage.messageServices || {})
            )
        } catch (e) {
        }
    }, [directMessage.messageServices])

    return (
        <div className={styles.integrationMessageContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Direct messaging
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            <div className={styles.integrationMessageContent}>
                <p>Choose which direct messaging services to connect with Bonded. Stamps are created only when it’s clear the message relates to your relationship. All other conversations are ignored. read more</p>
            </div>
            <div className={styles.toggleSwitchList}>
                <ToggleSwitchList
                    items={items}
                    values={maskedValues}
                    onChange={handleMessageServicesChange}
                    disabledIds={items
                        .map(i => i.id)
                        .filter(id => !enabledSet.has(String(id).toLowerCase()))}
                />
            </div>

            <div className={styles.integrationMessageButton}>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/integration-email')}
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
                        onClick={() => navigate('/wizard/integration')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/integration-email')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default IntegrartionMessage