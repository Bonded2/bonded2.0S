import React from 'react'
import styles from './scss/_bondConfirmation.module.scss'
import { CircleCheckBig } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const PartnerConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bondConfirmationContainer}>
            <div className={styles.checkContainer}>
                <CircleCheckBig />
            </div>
            <div className={styles.header}>
                <p className={styles.title}>Information confirmed</p>
                <p className={styles.description}>
                    Your partner has reviewed and confirmed the additional information you uploaded. We’re now ready to continue building your shared profile.
                </p>
            </div>

            <Button
                variant="primary"
                onClick={() => navigate('/wizard/kyc')}
            >
                Next
            </Button>
        </div>
    )
}

export default PartnerConfirmation