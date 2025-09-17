import React from 'react'
import styles from './scss/_email.module.scss'
import Input from '@/reusable/Input'
import Button from '@/reusable/Button'
import { EmailFunction } from './EmailFunction'
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Email = () => {
  const navigate = useNavigate();
  const { email, handleEmailChange } = EmailFunction();

  return (
    <div className={styles.emailContainer}>
      <div className={styles.header}>
        <p className={styles.title}>Enter your Email</p>
        <p className={styles.description}>We’ll send you a code to confirm your email address.</p>
      </div>

      <div className={styles.emailInput}>
        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <div className={styles.emailButton}>
        <Button
          variant="primary"
          className={styles.emailButton}
          onClick={() => navigate('/wizard/passport')}
          disabled={!email}
        >
          Next
        </Button>
        <Button
          variant="secondary"
          className={styles.emailButtonSecond}
          onClick={() => navigate('/wizard')}
        >
          <ArrowLeft />
          Back
        </Button>
      </div>

    </div>
  )
}

export default Email