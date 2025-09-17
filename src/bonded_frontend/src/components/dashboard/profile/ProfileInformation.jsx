import React, { useState } from 'react'
import styles from './scss/_profileInformation.module.scss'
import { Pencil, Trash2, Heart, ChevronUp } from 'lucide-react';
import Button from '@/reusable/Button';
import rimuro from '@/assets/example/rimuro.jpg';
import nishimiya from '@/assets/example/nishimiya.jpg';

const ProfileInformation = () => {
    const [isPartner, setIsPartner] = useState(false);

    const userData = {
        id: 3,
        src: rimuro,
        firstname: 'Rimuro',
        middlename: 'Kazuto',
        lastname: 'Tempest',
        sex: 'Male',
        dateOfBirth: '25.10.1985',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: 'American',
        primaryresidence: '42 Wallaby Way, Sydney',
        taxableresidence: '42 Wallaby Way, Sydney',
        significantresidence: '42 Wallaby Way, Sydney',
        canisterid: 'rryah-gqaaa-aaaaa-cag',
        typefile: 'Passport',
        issuefile: '10 Mar 2023',
        issuefilecountry: 'USA',
    }

    const partnerData = {
        id: 4,
        src: nishimiya,
        firstname: 'Nishimiya',
        middlename: 'Mai',
        lastname: 'Kazuto',
        sex: 'Female',
        dateOfBirth: '18.06.1988',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: 'American',
        primaryresidence: '456 Pine Avenue, New York',
        taxableresidence: '456 Pine Avenue, New York',
        significantresidence: '456 Pine Avenue, New York',
        canisterid: 'rryah-gqaaa-aaaaa-cag',
        typefile: 'Passport',
        issuefile: '10 Mar 2023',
        issuefilecountry: 'USA',
    }

    const currentData = isPartner ? partnerData : userData;

    return (
        <div className={styles.profileInformationContainer}>

            <div className={styles.header}>
                <p className={styles.title}>Shared Profile</p>

                <div className={styles.headerActions}>
                    <span className={styles.iconContainer}>
                        <Pencil />
                    </span>
                    <span className={styles.iconContainer}>
                        <Trash2 />
                    </span>
                </div>
            </div>

            <div className={styles.profileInformationButtons}>
                <button
                    className={`${styles.tabButton} ${!isPartner ? styles.active : ''}`}
                    onClick={() => setIsPartner(false)}
                >
                    Personal profile
                </button>
                <button
                    className={`${styles.tabButton} ${isPartner ? styles.active : ''}`}
                    onClick={() => setIsPartner(true)}
                >
                    Partner's profile
                </button>
            </div>

            <div className={styles.profileInformationContent}>
                {/* Full Name Section with Avatar */}
                <div className={styles.fullNameSection}>
                    <div className={styles.avatarContainer}>
                        <img
                            src={currentData.src}
                            alt="Profile"
                            className={styles.avatar}
                        />
                    </div>
                    <div className={styles.fullNameContainer}>
                        <div className={styles.fullNameLabel}>Full Name</div>
                        <div className={styles.fullNameValue}>
                            {currentData.firstname} {currentData.middlename} {currentData.lastname}
                        </div>
                    </div>
                </div>

                {/* Personal Information Fields */}
                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Sex</div>
                    <div className={styles.infoValue}>{currentData.sex}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Date of Birth</div>
                    <div className={styles.infoValue}>{currentData.dateOfBirth}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Issue date</div>
                    <div className={styles.infoValue}>{currentData.issuedDate}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Expiry date</div>
                    <div className={styles.infoValue}>{currentData.expiryDate}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Nationality</div>
                    <div className={styles.infoValue}>{currentData.nationality}</div>
                </div>

                {/* Address Information Fields */}
                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Primary residency</div>
                    <div className={styles.infoValue}>{currentData.primaryresidence}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Taxable residency</div>
                    <div className={styles.infoValue}>{currentData.taxableresidence}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Significant other residency</div>
                    <div className={styles.infoValue}>{currentData.significantresidence}</div>
                </div>

                <div className={styles.infoField}>
                    <div className={styles.infoLabel}>Canister ID</div>
                    <div className={styles.infoValue}>{currentData.canisterid}</div>
                </div>

                {/* Additional Files Section */}
                <div className={styles.additionalFilesSection}>
                    <div className={styles.additionalFilesTitle}>Additional Files</div>

                    <div className={styles.fileItem}>
                        <div className={styles.fileItemHeader}>
                            <div className={styles.fileItemInfo}>
                                <div className={styles.fileItemIcon}>
                                    <Heart size={16} />
                                </div>
                                <div className={styles.fileItemTitle}>{currentData.typefile}</div>
                            </div>
                            <button className={styles.fileItemRemove}>Remove</button>
                        </div>
                        <div className={styles.fileItemDetails}>
                            <div className={styles.fileItemDate}>Issued: {currentData.issuefile}</div>
                            <div className={styles.fileItemCountry}>Issuing Country: {currentData.issuefilecountry}</div>
                        </div>
                    </div>
                </div>

                {/* Back to top link */}
                <div className={styles.backToTop}>
                    <button className={styles.backToTopButton}>
                        Back to top
                        <ChevronUp size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileInformation