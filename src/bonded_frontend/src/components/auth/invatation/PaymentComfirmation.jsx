import React, { useState } from 'react'
import styles from './scss/_bondConfirmation.module.scss'
import { CircleCheckBig } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const PaymentComfirmation = () => {
    const navigate = useNavigate();
    const [isReloading, setIsReloading] = useState(null)

    const handleReload = async () => {
   
        setIsReloading(true)
   
       try {
            
            window.location.reload()

       } catch (error) {
           console.error(error)
       } finally {
           window.location.reload()
           setTimeout(() => 
               setIsReloading(false), 800
            )
        }
   
   }

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
                onClick={handleReload}
                disabled={isReloading}
            >
                {isReloading ? ('Reloading') : ('Next')}
            </Button>
        </div>
    )
}

export default PaymentComfirmation