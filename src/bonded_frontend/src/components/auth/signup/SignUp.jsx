import styles from './scss/_signup.module.scss'
import Input from '@/reusable/Input'
import { Plus } from 'lucide-react'
import Checkbox from '@/reusable/Checkbox'
import Button from '@/reusable/Button'
import { SignUpFunction } from './SignUpFunction'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const navigate = useNavigate();
    // ANCHOR: Custom hook for form state management
    const {
        formData,
        accepted,
        handleInputChange,
        handleAccept,
        isFormValid
    } = SignUpFunction()

    return (
        <div className={styles.signUpContainer}>
            {/* ANCHOR: Main content wrapper */}
            {/* ANCHOR: Header section */}
            <div className={styles.header}>
                <p className={styles.title}>Let's get started</p>
            </div>

            {/* ANCHOR: Name input fields */}
            <div className={styles.nameFields}>
                <Input
                    label="First name"
                    type="text"
                    id="firstname"
                    placeholder="Type"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                />
                <Input
                    label="Middle name(s)"
                    type="text"
                    id="middlename"
                    placeholder="Type"
                    value={formData.middlename}
                    onChange={(e) => handleInputChange('middlename', e.target.value)}
                />
                <Input
                    label="Surname"
                    type="text"
                    id="lastname"
                    placeholder="Type"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                />
            </div>

            {/* ANCHOR: Additional name option */}
            {/* <div className={styles.addName}>
                <Plus size={16} />
                <span>Add additional</span>
            </div> */}

            {/* ANCHOR: Username input */}
            <div className={styles.usernameField}>
                <Input
                    label="Username"
                    type="text"
                    id="username"
                    placeholder="Type"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                />
            </div>

            {/* ANCHOR: Terms acceptance checkbox */}
            <div className={styles.checkboxField}>
                <Checkbox
                    label="Accept the terms & conditions"
                    required={true}
                    checked={accepted}
                    onChange={handleAccept}
                />
            </div>

            {/* ANCHOR: Submit button */}
            <div className={styles.buttonField}>
                <button
                    className={styles.nextButton}
                    disabled={!isFormValid()}
                    onClick={() => navigate('/wizard/email')}
                    type="button"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default SignUp