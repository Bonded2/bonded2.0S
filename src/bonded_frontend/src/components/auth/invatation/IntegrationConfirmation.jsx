import React from 'react'
import styles from './scss/_bondConfirmation.module.scss'
import { CircleCheckBig } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const IntegrationConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bondConfirmationContainer}>
            <div className={styles.checkContainer}>
                <CircleCheckBig />
            </div>
            <div className={styles.header}>
                <p className={styles.title}>Integrations confirmed</p>
                <p className={styles.description}>
                    Your partner has reviewed and confirmed the apps and services you selected. Your Relationship Passport is now ready to begin collecting stamps of evidence.
                </p>
            </div>

            <Button
                variant="primary"
                onClick={() => navigate('/wizard/payment')}
            >
                Next
            </Button>
        </div>
    )
}

export default IntegrationConfirmation