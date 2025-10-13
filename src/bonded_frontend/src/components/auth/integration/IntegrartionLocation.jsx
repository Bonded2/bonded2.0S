import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './scss/_integrationphoto.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import Checkbox from '@/reusable/Checkbox'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLocationAccess, setLocationCoordinates } from '@/store/slices/integrationSlice'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// ANCHOR: Constants for geolocation
const STORAGE_KEY = 'integration.locationAccess'

// ANCHOR: Promise-based geolocation wrapper for better error handling
function getPosition(opts) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, opts)
    })
}

const IntegrartionLocation = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { location } = useAppSelector((state) => state.integration);

    // ANCHOR: State management for geolocation
    const [allowFullAccess, setAllowFullAccess] = useState(false)
    const [permState, setPermState] = useState('prompt')
    const [status, setStatus] = useState('')
    const [coords, setCoords] = useState(null)
    const [showInfoModal, setShowInfoModal] = useState(false)

    const handleNavigateToStep = (step) => {
        navigate(step);
    }

    // ANCHOR: Check if running in secure context (required for geolocation)
    const secure = useMemo(() => {
        // Required by browsers except localhost
        return window.isSecureContext || window.location.hostname === 'localhost'
    }, [])

    // ANCHOR: Boot: restore saved choice & detect capabilities
    useEffect(() => {
        // restore saved choice
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                setAllowFullAccess(saved === 'Full access')
                dispatch(setLocationAccess(saved))
            }
        } catch (_) { }

        // ANCHOR: Restore coordinates from Redux if available
        if (location.coordinates) {
            setCoords(location.coordinates)
            setPermState('granted')
        }

        // detect geolocation support
        if (!('geolocation' in navigator)) {
            setPermState('unsupported')
            setStatus('Geolocation is not supported on this device/browser.')
            return
        }

        // Permissions API (not on all browsers; Safari iOS is partial)
        if (navigator.permissions?.query) {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((res) => setPermState(res.state))
                .catch(() => { })
        }
    }, [dispatch, location.coordinates])

    // ANCHOR: Persist checkbox choice + redux
    useEffect(() => {
        const value = allowFullAccess ? 'Full access' : ''
        dispatch(setLocationAccess(value))
        try {
            localStorage.setItem(STORAGE_KEY, value)
        } catch (_) { }
    }, [allowFullAccess, dispatch])

    // ANCHOR: Request geolocation permission (triggered by user gesture)
    const requestOnce = async () => {
        setStatus('')

        // Check secure context requirement
        if (!secure) {
            setStatus('Location requires HTTPS. Serve your PWA over https:// (localhost is OK for dev).')
            return
        }

        // Check geolocation support
        if (!('geolocation' in navigator)) {
            setPermState('unsupported')
            setStatus('Geolocation not supported.')
            return
        }

        try {
            setStatus('Requesting location…')
            const pos = await getPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            })

            const { latitude, longitude, accuracy } = pos.coords
            const coordinates = { lat: latitude, lng: longitude, accuracy, ts: pos.timestamp }
            setCoords(coordinates)
            setPermState('granted')
            setAllowFullAccess(true)
            setStatus('Location enabled.')

            // ANCHOR: Store coordinates in Redux for persistence
            dispatch(setLocationCoordinates(coordinates))
        } catch (err) {
            if (err?.code === 1) {
                setPermState('denied')
                setAllowFullAccess(false)
                setStatus('Permission denied. You can enable it in your browser/site settings.')
            } else if (err?.code === 2) {
                setStatus('Location unavailable. Check GPS/network and try again.')
            } else if (err?.code === 3) {
                setStatus('Location request timed out. Move outside or try again.')
            } else {
                setStatus('Location error. Try again.')
            }
        }
    }

    // ANCHOR: Handle checkbox change with geolocation request
    const handleCheckbox = async (e) => {
        const checked = e.target.checked

        // Only request when turning on
        if (checked) {
            await requestOnce()
            // If it failed, keep it off
            if (permState !== 'granted' && !coords) {
                setAllowFullAccess(false)
                return
            }
            setAllowFullAccess(true)
        } else {
            setAllowFullAccess(false)
        }
    }

    const canProceed = true

    return (
        <div className={styles.integrationPhotoContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Geolocation
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            <div className={styles.integrationPhotoContent}>
                <p>
                    Enable location sharing with Bonded. We use your location to verify time spent together
                    with your partner. Other location data is ignored. Your location is used only while the
                    app is open. <button className={styles.inlineLink} onClick={() => setShowInfoModal(true)}>Read more</button>
                </p>

                {/* ANCHOR: Unsupported browser warning */}
                {permState === 'unsupported' && (
                    <p className={styles.warning}>This browser/device does not support geolocation.</p>
                )}
            </div>

            <div className={styles.integrationPhotoCheckbox}>
                <Checkbox
                    label="Enable Location"
                    checked={allowFullAccess}
                    onChange={handleCheckbox}
                />

                {/* ANCHOR: Status line with coordinates */}
                <div className={styles.statusLine}>
                    {status && <small>{status}</small>}
                    {coords && (
                        <small className={styles.dim}>
                            (lat {coords.lat.toFixed(5)}, lng {coords.lng.toFixed(5)}, ±{Math.round(coords.accuracy)}m)
                        </small>
                    )}
                </div>
            </div>

            <div className={styles.integrationPhotoButton}>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/integration-complete')}
                    disabled={!canProceed}
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
                        onClick={() => navigate('/wizard/integration-photo')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/integration-complete')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>

            {/* ANCHOR: Info Modal (Replaces alert()) */}
            {showInfoModal && (
                <div className={styles.modalOverlay} onClick={() => setShowInfoModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Location Access Details</h3>
                        <p className={styles.modalText}>
                            We request precise location once to confirm proximity. No background tracking is performed. 
                            You can revoke this permission anytime using your browser or device site settings.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => setShowInfoModal(false)}
                        >
                            Got It
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default IntegrartionLocation