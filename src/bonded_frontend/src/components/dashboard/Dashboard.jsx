import React from 'react'
import styles from './scss/_dashboard.module.scss'
import MobileCarousel from '@/reusable/MobileCarousel'
import { ArrowUpFromLine } from 'lucide-react';
import Button from '@/reusable/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboard } from './DashboardFunction';

const Dashboard = () => {
    const navigate = useNavigate();
    const {
        images,
        dates,
        browseEvidence,
        evidence,
    } = useDashboard();

    return (
        <div className={styles.dashboard}>

            <div className={styles.header}>
                <p className={styles.headerTitle}>Your evidence</p>
                {/* <p className={styles.headerSubtitle}>Recent Activity</p> */}
            </div>

            {/* <div className={styles.carouselContainer}>
                <MobileCarousel images={images} dates={dates} />
            </div> */}

            <div className={styles.dashboardContent}>

                <div className={styles.timelineContainer}>
                    {/* <p className={styles.timelineTitle}>Browse your evidence</p> */}

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

                <div className={styles.evidenceContainer}>
                    <p className={styles.evidenceTitle}>Recent evidence</p>
                    <div className={styles.evidenceScrollContainer}>
                        {evidence.map((item, index) => (
                            <div className={styles.evidenceItem} key={index}>
                                <div className={styles.evidenceItemImage}>
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className={styles.evidenceItemTitle}>{item.title}</div>
                                <div className={styles.evidenceItemTimeContainer}>
                                    <span className={styles.evidenceItemTime}>{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.dashButton}>
                    <Button
                        variant="primary"
                        size="medium"
                        icon={<ArrowUpFromLine size={10} />}
                        iconPosition="left"
                        className={styles.dashButtonPrimary}
                        onClick={() => navigate('/dashboard/upload')}
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