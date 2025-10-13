import styles from './scss/_kycfunction.module.scss'
import { useState } from 'react'
import ValidationChecklist from '@/reusable/ValidationChecklist'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '@/reusable/Button'
import { Session } from '../../../routes/SessionProvider'

const Kyc = () => {
    const navigate = useNavigate()
    const [verifyMethod, setVerifyMethod] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [sessionInfo, setSessionInfo] = useState(null)
    const { userData } = Session()

    const validationRules = [
        { text: 'Step one: Prove your identity', isMet: true },
        { text: 'Step two: Confirm your primary address', isMet: true },
        { text: 'Step three: Additional Checks (if required)', isMet: true },
    ]

    const startYotiVerification = async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch('https://yoti-eight.vercel.app/yoti/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userTrackingId: userData?.email || 'guest-user' })
            })

            if (!res.ok) throw new Error('Failed to create Yoti session')

            const { clientSessionToken, sessionId } = await res.json()
            setSessionInfo({ clientSessionToken, sessionId })

            console.log('Verification succeeded!')
            console.log('Session Token: ', clientSessionToken)
            console.log('Session Id: ', sessionId)
            setVerifyMethod(true)
            // Dynamically load Yoti SDK
            const script = document.createElement('script')
            script.src = 'https://www.yoti.com/sdk/js/yoti-idv.js'
            script.async = true
            script.onload = () => {
                // @ts-ignore
                const idv = new window.YotiIdv()
                idv.start({
                    clientSessionToken,
                    onSuccess: () => {
                        console.log('Verification succeeded!')
                        setVerifyMethod(true)
                    },
                    onError: (err) => {
                        console.error('Yoti verification failed', err)
                        setError('Verification failed. Please try again.')
                    }
                })
            }
            document.body.appendChild(script)
        } catch (err) {
            console.error(err)
            setError('Something went wrong starting Yoti verification.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.kycContainer}>
            <div className={styles.kycContent}>
                {verifyMethod ? (
                    <div className={styles.verifyMethod}>
                        <div className={styles.header}>
                            <p className={styles.title}>Your identity is verified</p>
                            <p className={styles.description}>
                                Great, your details are confirmed! The next step is to invite your partner
                                to join you so that we can create your shared Relationship Passport.
                            </p>
                        {sessionInfo && (
                            <div className={styles.sessionInfo}>
                                <br/>
                                <p><strong>Session ID:</strong> {sessionInfo.sessionId}</p>
                                <p><strong>Client Token:</strong> {sessionInfo.clientSessionToken}</p>
                            </div>
                        )}
                        </div>
                        <div className={styles.kycButton}>
                            {userData?.status === 'Single' && (
                                <Button
                                    variant='primary'
                                    onClick={() => navigate('/wizard/bond-invitation')}
                                >
                                    Continue
                                </Button>
                            )}
                            {userData?.status === 'Complicated' && (
                                <Button
                                    variant='primary'
                                    onClick={() => navigate('/wizard/bond-pending')}
                                >
                                    Continue
                                </Button>
                            )}
                            {userData?.status === 'Bonded' && (
                                <Button
                                    variant='primary'
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Go to Dashboard
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.verifyMethod}>
                        <div className={styles.header}>
                            <p className={styles.title}>We need to verify your identity</p>
                            <p className={styles.description}>
                                To keep your Relationship Passport secure, we need to confirm who you are using our trusted partner, YOTI.
                            </p>
                        </div>

                        <ValidationChecklist validationRules={validationRules} />

                        <div className={styles.kycButton}>
                            <Button
                                variant='primary'
                                onClick={startYotiVerification}
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Start verification with YOTI'}
                            </Button>

                            <Button
                                variant='secondary'
                                onClick={() => navigate('/wizard/complete-profile')}
                            >
                                <ArrowLeft size={16} />
                                Back
                            </Button>
                        </div>

                        {error && <p className={styles.errorText}>{error}</p>}

                    </div>
                )}
            </div>
        </div>
    )
}

export default Kyc
