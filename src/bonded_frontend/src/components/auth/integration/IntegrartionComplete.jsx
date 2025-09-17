import React, { useMemo } from 'react'
import styles from './scss/_integrationcomplete.module.scss'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import { useAppSelector } from '@/store/hooks'
import { MessageCircle, Mail, Users, Video, Image, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'

const IntegrartionComplete = () => {
    const navigate = useNavigate();
    const { directMessage, email, socialMedia, videoCalls, photo, location } = useAppSelector((state) => state.integration);

    const mapSelectedNames = (platforms, services) => {
        return useMemo(() => {
            const selectedCodes = Object.entries(services || {})
                .filter(([, value]) => Boolean(value))
                .map(([code]) => String(code));
            const names = (platforms || [])
                .filter(p => selectedCodes.includes(p.code))
                .map(p => p.name);
            return names;
        }, [platforms, services]);
    };

    const selectedDM = mapSelectedNames(directMessage.chatPlatform, directMessage.messageServices);
    const selectedEmail = mapSelectedNames(email.emailChatPlatform, email.emailServices);
    const selectedSM = mapSelectedNames(socialMedia.socialMediaChatPlatform, socialMedia.socialMediaServices);
    const selectedVC = mapSelectedNames(videoCalls.videoCallsChatPlatform, videoCalls.videoCallsServices);

    return (
        <div className={styles.integrationCompleteContainer}>
            <div className={styles.header}>
                <p className={styles.title}>
                    Integration overview
                </p>
                <p className={styles.description}>Review the apps and services you’ve connected with Bonded. These integrations will automatically create stamps of evidence for your Relationship Passport.</p>
            </div>

            <div className={styles.integrationCompleteSections}>
                <div className={styles.profileSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <MessageCircle className={styles.sectionIcon} />
                            <span>Direct Messages</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate('/wizard/integration-message')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.sectionContent}>
                        {selectedDM.length > 0 ? (
                            <div className={styles.residencyInfo}>
                                <p>{selectedDM.join(', ')}</p>
                            </div>
                        ) : (
                            <div className={styles.notCompleted}>
                                <span>No messaging apps selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <Mail className={styles.sectionIcon} />
                            <span>Email</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate('/wizard/integration-email')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.sectionContent}>
                        {selectedEmail.length > 0 ? (
                            <div className={styles.residencyInfo}>
                                <p>{selectedEmail.join(', ')}</p>
                            </div>
                        ) : (
                            <div className={styles.notCompleted}>
                                <span>No email providers selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <Users className={styles.sectionIcon} />
                            <span>Social Media</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate('/wizard/integration-media')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.sectionContent}>
                        {selectedSM.length > 0 ? (
                            <div className={styles.residencyInfo}>
                                <p>{selectedSM.join(', ')}</p>
                            </div>
                        ) : (
                            <div className={styles.notCompleted}>
                                <span>No social apps selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <Video className={styles.sectionIcon} />
                            <span>Video Calls</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate('/wizard/integration-video-calls')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.sectionContent}>
                        {selectedVC.length > 0 ? (
                            <div className={styles.residencyInfo}>
                                <p>{selectedVC.join(', ')}</p>
                            </div>
                        ) : (
                            <div className={styles.notCompleted}>
                                <span>No video call apps selected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <Image className={styles.sectionIcon} />
                            <span>Photo Gallery</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate('/wizard/integration-photo')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.sectionContent}>
                        {photo?.access ? (
                            <div className={styles.residencyInfo}>
                                <p>{photo.access}</p>
                            </div>
                        ) : (
                            <div className={styles.notCompleted}>
                                <span>No access granted</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitle}>
                            <MapPin className={styles.sectionIcon} />
                            <span>Geolocation</span>
                        </div>
                        <button
                            className={styles.editButton}
                            onClick={() => navigate('/wizard/integration-location')}
                        >
                            Edit
                        </button>
                    </div>
                    <div className={styles.sectionContent}>
                        {location?.access ? (
                            <div className={styles.residencyInfo}>
                                <p>{location.access}</p>
                            </div>
                        ) : (
                            <div className={styles.notCompleted}>
                                <span>No access granted</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.navigationButtons}>
                <div className={styles.actionButtons}>
                    <Button
                        variant="primary"
                        className={styles.completeButton}
                        onClick={() => navigate('/wizard/integration-pending')}
                    >
                        Next
                    </Button>
                </div>
                <div className={styles.navigationButtonsDual}>
                    <Button
                        variant="secondary"
                        className={styles.navigationButtonLeft}
                        onClick={() => navigate('/wizard/integration')}
                    >
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.navigationButtonRight}
                        onClick={() => navigate('/wizard/integration-pending')}
                    >
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default IntegrartionComplete