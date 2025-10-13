import React, { useState } from 'react'
import styles from './scss/_profileInformation.module.scss'
import { Pencil, Trash2, Heart, ChevronUp } from 'lucide-react';
// import Button from '@/reusable/Button';
// import rimuro from '@/assets/example/rimuro.jpg';
// import nishimiya from '@/assets/example/nishimiya.jpg';
import logo from '/icons/icon-384x384.png'
import { Session } from '../../../routes/SessionProvider';
import { useNavigate } from 'react-router-dom';

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const parseDocumentType = (docString) => {
    if (!docString) return { type: "N/A", country: "N/A", date: "N/A" };

    const [type, countryCode, dateRange] = docString.split(" | ");

    const prettify = (text) =>
        text
            ? text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            : "N/A";

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const firstDate = dateStr.split("-")[0].trim();
        const parsedDate = new Date(firstDate);

        if (isNaN(parsedDate)) return firstDate;

        return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    const formatCountry = (code) => {
        if (!code) return "N/A";
        try {
            return regionNames.of(code.trim().toUpperCase()) || code;
        } catch {
            return code;
        }
    };

    return {
        type: prettify(type),
        country: formatCountry(countryCode),
        date: formatDate(dateRange),
    };
};

const ProfileInformation = () => {
    const [isPartner, setIsPartner] = useState(false);
    const { userData, partnerData } = Session()

    const parsedUserDoc = parseDocumentType(userData?.document_type);
    const parsedPartnerDoc = parseDocumentType(partnerData?.document_type);

    const defaultUserData = {
        id: 3,
        src: userData?.profile || logo,
        firstname: userData?.firstname,
        middlename: userData?.middlename,
        lastname: userData?.lastname,
        sex: userData?.gender,
        dateOfBirth: '25.10.1985',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: userData?.nationality,
        primaryresidence: userData?.primary_residence,
        taxableresidence: userData?.primary_residence,
        significantresidence: userData?.primary_residence,
        canisterid: userData?.email,
        typefile: parsedUserDoc.type,
        issuefile: parsedUserDoc.date,
        issuefilecountry: parsedUserDoc.country,
    }

    const defaultPartnerData = {
        id: 4,
        src: partnerData?.profile || logo,
        firstname: partnerData?.firstname || partnerData?.email,
        middlename: partnerData?.middlename,
        lastname: partnerData?.lastname,
        sex: partnerData?.gender,
        dateOfBirth: '18.06.1988',
        issuedDate: '10.03.2023',
        expiryDate: '10.03.2033',
        nationality: partnerData?.nationality,
        primaryresidence: partnerData?.primary_residence,
        taxableresidence: partnerData?.primary_residence,
        significantresidence: partnerData?.primary_residence,
        canisterid: partnerData?.email,
        typefile: parsedPartnerDoc.type,
        issuefile: parsedPartnerDoc.date,
        issuefilecountry: parsedPartnerDoc.country,
    }

    const navigate = useNavigate();
    const currentData = isPartner ? defaultPartnerData : defaultUserData;

    const handleNavigateToStep = (path) => {
        navigate(path);
    };

    return (
        <div className={styles.profileInformationContainer}>

            <div className={styles.header}>
                <p className={styles.title}>Shared Profile</p>

                <div className={styles.headerActions}>
                    <span className={styles.iconContainer}>
                        <Pencil onClick={() => handleNavigateToStep('/dashboard/edit')} />
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