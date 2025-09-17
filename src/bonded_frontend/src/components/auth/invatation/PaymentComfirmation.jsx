import React from 'react'
import styles from './scss/_bondConfirmation.module.scss'
import { CircleCheckBig } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const PaymentComfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.bondConfirmationContainer}>
            <div className={styles.checkContainer}>
                <CircleCheckBig />
            </div>
            <div className={styles.header}>
                <p className={styles.title}>Your Relationship Passport is ready! </p>
                <p className={styles.description}>
                    Your Relationship Passport is now active. Bonded will begin collecting approved stamps of evidence and syncing them securely, so you can build a trusted record together.
                </p>
            </div>

            <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
            >
                Next
            </Button>
        </div>
    )
}

export default PaymentComfirmation