import React from 'react'
import styles from './scss/_dashboard.module.scss'
import MobileCarousel from '@/reusable/MobileCarousel'
import { ArrowUpFromLine } from 'lucide-react';
import Button from '@/reusable/Button';
import { Link } from 'react-router-dom';
import { useDashboard } from './DashboardFunction';

const Dashboard = () => {
    const {
        images,
        dates,
        handlePhotoUpload,
        browseEvidence
    } = useDashboard();

    return (
        <div className={styles.dashboard}>

            <div className={styles.header}>
                <p className={styles.headerTitle}>Explore your Passport</p>
                <p className={styles.headerSubtitle}>Recent Activity</p>
            </div>

            <div className={styles.carouselContainer}>
                <MobileCarousel images={images} dates={dates} />
            </div>

            <div className={styles.dashboardContent}>

                <div className={styles.timelineContainer}>
                    <p className={styles.timelineTitle}>Browse your evidence</p>

                    <div className={styles.browseEvidenceContainer}>
                        {browseEvidence.map((item, index) => (
                            <Link
                                to={item.to}
                                className={styles.browseEvidenceItem}
                                key={index}
                            >
                                <div className={styles.browseEvidenceItemIcon}>{item.icon}</div>
                                <div className={styles.browseEvidenceItemTitle}>{item.title}</div>
                                <div className={styles.browseEvidenceItemRightIcon}>{item.rightIcon}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={styles.dashButton}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                        id="photo-upload"
                    />
                    <Button
                        variant="primary"
                        size="medium"
                        icon={<ArrowUpFromLine size={10} />}
                        iconPosition="left"
                        className={styles.dashButtonPrimary}
                        onClick={() => document.getElementById('photo-upload').click()}
                    >
                        Upload
                    </Button>
                    <Button
                        variant="secondary"
                        size="medium"
                        className={styles.dashButtonSecondary}
                    >
                        View on Bonded
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default Dashboard