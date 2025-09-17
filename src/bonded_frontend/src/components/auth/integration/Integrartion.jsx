import React, { useState } from 'react'
import styles from './scss/_integration.module.scss'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Checkbox from '@/reusable/Checkbox'
import Button from '@/reusable/Button'
import { useNavigate } from 'react-router-dom'

const Integrartion = () => {
    const navigate = useNavigate();
    const [acceptedPolicies, setAcceptedPolicies] = useState(false);

    return (
        <div className={styles.integrationContainer}>
            <div className={styles.header}>

                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Tell us what to collect
                </p>
            </div>

            <div className={styles.integrationContent}>
                <p>Your Relationship Passport is now created. The next step is choosing what stamps of evidence you’d like us to collect automatically, from messages, emails, social media and video calls to calendars, photos and locations.</p>
                <p>You and your partner are always in full control. Together, you decide what to include, and you can update, amend or delete any information at any time.</p>

                <div className={styles.integrationPrivacyContainer}>
                    <button className={styles.integrationPrivacy}>
                        Privacy Policy
                        <ArrowRight />
                    </button>
                    <button className={styles.integrationPrivacy}>
                        Data Policy
                        <ArrowRight />
                    </button>
                </div>

                <div className={styles.integrationCheckbox}>
                    <Checkbox
                        label="I have read and accept the Data and Privacy Policies"
                        checked={acceptedPolicies}
                        onChange={(e) => setAcceptedPolicies(e.target.checked)}
                    />
                </div>

                <div className={styles.integrationButton}>
                    <Button
                        variant="primary"
                        disabled={!acceptedPolicies}
                        onClick={() => navigate('/wizard/integration-message')}
                    >
                        Start
                    </Button>
                </div>

                {/* Navigation Buttons */}
                <div className={styles.nationalitiesButton}>
                    <div className={styles.nationalitiesButtonDual}>
                        <Button
                            variant="secondary"
                            className={styles.nationalitiesButtonDualLeft}
                            onClick={() => navigate('/wizard/kyc')}>
                            <ArrowLeft />
                            Back
                        </Button>
                        <Button
                            variant="secondary"
                            className={styles.nationalitiesButtonDualRight}
                            onClick={() => navigate('/wizard/integration-message')}>
                            Skip
                            <ArrowRight />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Integrartion