import React from 'react'
import styles from './scss/_bondConfirmation.module.scss'
import { CircleCheckBig } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const BondConfirmation = () => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.bondConfirmationContainer}>
            <div className={styles.checkContainer}>
                <CircleCheckBig />
            </div>
            <div className={styles.header}>
                <p className={styles.title}>You’re bonded!</p>
                <p className={styles.description}>
                    Your Relationship Passport has been created. You and your partner are almost there, just add a few details to complete your profile and we’ll start adding stamps of evidence to capture your life together.
                </p>
            </div>

            <Button
                variant="primary"
                onClick={() => navigate('/wizard/integration')}
            >
                Next
            </Button>
        </div>
    )
}

export default BondConfirmation