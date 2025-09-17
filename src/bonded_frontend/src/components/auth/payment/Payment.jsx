import React, { useState } from 'react'
import styles from './scss/_payment.module.scss'
import Button from '@/reusable/Button';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const navigate = useNavigate();
    const subscriptions = [
        {
            id: 1,
            plan: 'Pay Monthly',
            monthly: '$12.99/Month',
            yearly: '$155.88/Year',
        },
        {
            id: 2,
            plan: 'Pay Annually',
            monthly: '$129.99/Year',
            yearly: 'Save 16.61%',
        },

    ]

    return (
        <div className={styles.paymentContainer}>
            <div className={styles.header}>
                <p className={styles.title}>Set up your subcriptions</p>
                <p className={styles.description}>
                    Both you and your partner need an active Bonded subscription for your Relationship Passport to work. We won’t charge you until your partner confirms their subscription, so you only pay once you both agree to continue.
                </p>
            </div>

            <div className={styles.paymentCompleteSections}>
                {subscriptions.map((subscription) => (
                    <div className={styles.paymentCompleteSection} key={subscription.id}>
                        <div className={styles.paymentCompleteSectionHeader}>
                            <p className={styles.paymentCompleteSectionTitle}>{subscription.plan}</p>
                        </div>
                        <div className={styles.paymentCompleteSectionContent}>
                            <p className={styles.paymentCompleteSectionPrice}>
                                {subscription.id === 1 ? '$12.99' : '$129.99'}
                                <span className={styles.paymentCompleteSectionPeriod}>
                                    {subscription.id === 1 ? '/Month' : '/Year'}
                                </span>
                            </p>
                            <p className={styles.paymentCompleteSectionPrice}>{subscription.yearly}</p>
                        </div>

                        <div className={styles.paymentButton}>
                            <Button variant="secondary" onClick={() => setSelectedSubscription(subscription)}>
                                Select
                            </Button>
                        </div>
                    </div>
                ))
                }
            </div>

            <div className={styles.paymentMethodButtons}>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/payment-pending')}
                >
                    Stripe
                    <ArrowUpRight />
                </Button>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/payment-pending')}
                >
                    Paypal
                    <ArrowUpRight />
                </Button>
                <Button
                    variant="primary"
                    onClick={() => navigate('/wizard/payment-pending')}
                >
                    Digital currencies
                    <ArrowUpRight />
                </Button>
            </div>


        </div>
    )
}

export default Payment