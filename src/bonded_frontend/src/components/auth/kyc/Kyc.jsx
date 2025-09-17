import styles from './scss/_kycfunction.module.scss'
import { useState } from 'react'
import ValidationChecklist from '@/reusable/ValidationChecklist'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import Button from '@/reusable/Button'

const Kyc = () => {
    const navigate = useNavigate()
    const [verifyMethod, setVerifyMethod] = useState(false)
    const validationRules = [
        {
            text: 'Step one: Prove your identity',
            isMet: true
        },
        {
            text: 'Step two: Confirm your primary address',
            isMet: true
        },
        {
            text: 'Step three: Additional Checks (if required)',
            isMet: true
        },
    ]
    return (
        <div className={styles.kycContainer}>

            <div className={styles.kycContent}>
                {
                    verifyMethod ? (
                        <div className={styles.verifyMethod}>
                            <div className={styles.header}>
                                <p className={styles.title}>
                                    Your identity is verified
                                </p>
                                <p className={styles.description}>
                                    Great, your details are confirmed! The next step is to invite your partner to join you so that we can create your shared Relationship Passport.
                                </p>
                            </div>
                            <div className={styles.kycButton}>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/wizard/bond-invitation')}
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.verifyMethod}>
                            <div className={styles.header}>
                                <p className={styles.title}>
                                    We need to verify your identity
                                </p>
                                <p className={styles.description}>
                                    To keep your Relationship Passport secure, we need to confirm who you are using our trusted partner, Matter ID.
                                </p>
                            </div>
                            <ValidationChecklist validationRules={validationRules} />

                            <div className={styles.kycButton}>
                                <Button
                                    variant="primary"
                                    onClick={() => setVerifyMethod(true)}>
                                    Start verification with YUTI
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate('/wizard/passport')}>
                                    <ArrowLeft size={16} />
                                    back
                                </Button>
                            </div>
                        </div>
                    )

                }
            </div>


        </div>
    )
}

export default Kyc