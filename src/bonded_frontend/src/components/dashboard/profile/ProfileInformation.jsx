import React, { useState } from 'react'
import styles from './scss/_profileInformation.module.scss'
import { Pencil, Trash2, Heart, ChevronUp } from 'lucide-react';
import Button from '@/reusable/Button';
import rimuro from '@/assets/example/rimuro.jpg';
import nishimiya from '@/assets/example/nishimiya.jpg';
import logo from '/icons/icon-384x384.png'
import { Session } from '../../../routes/SessionProvider';

const ProfileInformation = () => {
    const [isPartner, setIsPartner] = useState(false);
    const { userData, partnerData } = Session()

    const defaultUserData = {
        id: 3,
        src: userData?.profile || logo,
        firstname: userData?.firstname,
        middlename: userData?.middlename,
        lastname: userData?.lastname,
        sex: 'Male',
        dateOfBirth: '25.10.1985',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: userData?.nationality,
        primaryresidence: userData?.primary_residence,
        taxableresidence: userData?.primary_residence,
        significantresidence: userData?.primary_residence,
        canisterid: 'rryah-gqaaa-aaaaa-cag',
        typefile: userData?.document_type,
        issuefile: '10 Mar 2023',
        issuefilecountry: 'USA',
    }

    const defaultPartnerData = {
        id: 4,
        src: partnerData?.profile || logo,
        firstname: partnerData?.firstname || partnerData?.email,
        middlename: partnerData?.middlename,
        lastname: partnerData?.lastname,
        sex: 'Female',
        dateOfBirth: '18.06.1988',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: partnerData?.nationality,
        primaryresidence: partnerData?.primary_residence,
        taxableresidence: partnerData?.primary_residence,
        significantresidence: partnerData?.primary_residence,
        canisterid: 'rryah-gqaaa-aaaaa-cag',
        typefile: partnerData?.document_type,
        issuefile: '10 Mar 2023',
        issuefilecountry: 'USA',
    }

    const currentData = isPartner ? defaultPartnerData : defaultUserData;

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
                            src={currentData.src || 'No Profile'}
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