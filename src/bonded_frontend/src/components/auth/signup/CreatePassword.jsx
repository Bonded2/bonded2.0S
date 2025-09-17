import styles from './scss/_createPassword.module.scss'
import Input from '@/reusable/Input'
import ValidationChecklist from '@/reusable/ValidationChecklist'
import Button from '@/reusable/Button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CreatePasswordFunction } from './CreatePasswordFunction'

const CreatePassword = () => {

  const navigate = useNavigate();
  const { password, setPassword, validationRules, isPasswordValid } = CreatePasswordFunction();

  return (
    <div className={styles.createPasswordContainer}>
      <div className={styles.header}>
        <p className={styles.title}>Create your password</p>
        <p className={styles.description}>Your password must be at least 8 characters and include one symbol, one number, and one uppercase letter.</p>
      </div>

      <Input
        label="Password"
        type="password"
        id="password"
        placeholder="Enter your password"
        showPasswordIcon={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className={styles.validationChecklist}>
        <ValidationChecklist validationRules={validationRules} />
      </div>

      <div className={styles.emailButton}>
        <Button
          variant="primary"
          className={styles.emailButton}
          onClick={() => navigate('/wizard/passport')}
          disabled={!isPasswordValid}
        >
          Next
        </Button>
        <Button
          variant="secondary"
          className={styles.emailButtonSecond}
          onClick={() => navigate('/wizard/email')}
        >
          <ArrowLeft />
          Back
        </Button>
      </div>
    </div>
  )
}

export default CreatePassword