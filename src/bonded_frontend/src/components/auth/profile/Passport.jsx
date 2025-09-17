import styles from './scss/_passport.module.scss'
import { User, Flag, House, Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const Passport = () => {
    const navigate = useNavigate();

    const ReqList = [
        {
            title: 'Profile Picture',
            icon: <User />
        },
        {
            title: 'Additional Nationalities',
            icon: <Flag />
        },
        {
            title: 'Additional Residencies',
            icon: <House />
        },
        {
            title: 'Additional documents',
            icon: <Upload />
        },
    ]

    return (
        <div className={styles.passportContainer}>
            <div className={styles.header}>
                <p className={styles.title}>Complete your passport</p>
                <p className={styles.description}>We’ve pre-filled some details. Add the remaining information like a photo, nationalities, residencies and documents to complete your Relationship Passport. </p>
                <p className={styles.description}>Don’t worry if you don’t have all the information at hand. You can skip sections, come back later and update or change any information whenever you need.</p>
            </div>

            <div className={styles.passportContent}>
                {ReqList.map((item, index) => (
                    <div className={styles.passportItem} key={index}>
                        <div className={styles.passportItemIcon}>{item.icon}</div>
                        <div className={styles.passportItemTitle}>{item.title}</div>
                    </div>
                ))}
            </div>
            <div className={styles.passportButton}>
                <Button
                    variant="primary"
                    className={styles.passportButton}
                    onClick={() => navigate('/wizard/profile-photo')}>
                    Start
                </Button>
                <div className={styles.passportButtonDual}>
                    <Button
                        variant="secondary"
                        className={styles.passportButtonDualLeft}
                        onClick={() => navigate('/wizard/email')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.passportButtonDualRight}
                        onClick={() => navigate('/wizard/complete-profile')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Passport