import React from 'react'
import styles from './scss/_completeprofile.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import Button from '@/reusable/Button'
import { CompleteProfileFunction } from './CompleteProfileFunction'
import { Image, Flag, House, FileText, ArrowLeft, ArrowRight, Heart, DollarSign, Droplet, ThumbsUp } from 'lucide-react'

const CompleteProfile = () => {
  const {
    navigate,
    profilePhoto,
    nationalities,
    residencies,
    uploadedFiles,
    iconMap,
    formatDate,
    formatPrettyDateRange,
    handleNavigateToStep,
  } = CompleteProfileFunction();

  return (
    <div className={styles.completeProfileContainer}>
      <div className={styles.header}>
        <p className={styles.superTitle}>Complete your passport</p>
        <p className={styles.title}>
          Check your details
        </p>
      </div>

      <div className={styles.completeProfileContent}>
        <div>
          <p>
            You're almost there. Check the details below to complete your Relationship Passport.
          </p>
        </div>
      </div>

      <div className={styles.completeProfileSections}>

        {/* Profile Picture Section */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Image className={styles.sectionIcon} />
              <span>Profile Picture</span>
            </div>
            <button
              className={styles.editButton}
              onClick={() => navigate('/wizard/profile-photo')}
            >
              Edit
            </button>
          </div>
          <div className={styles.sectionContent}>
            {profilePhoto.isUploaded ? (
              <div className={styles.profilePhotoPreview}>
                <div className={styles.uploadedFileInfo}>
                  <span className={styles.fileName}>
                    {profilePhoto.fileName || 'profile-photo.jpg'}
                  </span>
                  <span className={styles.fileStatus}> Uploaded</span>
                </div>
              </div>
            ) : (
              <div className={styles.notCompleted}>
                <span>No profile picture uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Nationalities Section */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Flag className={styles.sectionIcon} />
              <span>Nationalities</span>
            </div>
            <button
              className={styles.editButton}
              onClick={() => navigate('/wizard/nationalities')}
            >
              Edit
            </button>
          </div>
          <div className={styles.sectionContent}>
            {nationalities.isSaved && nationalities.selectedNationality ? (
              <div className={styles.nationalityInfo}>
                <span className={styles.nationalityFlag}>
                  {nationalities.selectedNationality.flag}
                </span>
                <span className={styles.nationalityName}>
                  {nationalities.selectedNationality.name}
                </span>
                <span className={styles.fileStatus}>Saved</span>
              </div>
            ) : (
              <div className={styles.notCompleted}>
                <span>No additional nationality selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Residencies Section */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <House className={styles.sectionIcon} />
              <span>Residencies</span>
            </div>
            <button
              className={styles.editButton}
              onClick={() => navigate('/wizard/residencies')}
            >
              Edit
            </button>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.residencyInfo}>
              <div className={styles.primaryResidence}>
                <p>Primary Residence:</p>
                <p>{residencies.primaryResidence}</p>
              </div>
              {residencies.otherAddresses.filter(addr => addr.value.trim() !== '').length > 0 && (
                <div className={styles.otherResidences}>
                  <p>Other Residencies:</p>
                  {residencies.otherAddresses
                    .filter(addr => addr.value.trim() !== '')
                    .map((address, index) => (
                      <p key={address.id}>{address.value}</p>
                    ))}
                </div>
              )}
              <span className={styles.fileStatus}>
                {residencies.isSaved ? ' Saved' : ' Needs review'}
              </span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents Section */}
        <div className={styles.profileSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <FileText className={styles.sectionIcon} />
              <span>Documents</span>
            </div>
            <button
              className={styles.editButton}
              onClick={() => navigate('/wizard/upload-file')}
            >
              Edit
            </button>
          </div>
          <div className={styles.sectionContent}>
            {uploadedFiles.files.length > 0 ? (
              <div className={styles.documentsGrid}>
                {uploadedFiles.files.map((file, index) => (
                  <div key={file.id} className={styles.documentCard}>
                    <div className={styles.documentIcon}>
                      {(file.fileType in iconMap) ? (
                        file.fileType === 'marriage-certificate' ? <Heart size={12} /> :
                          file.fileType === 'bank-statement' ? <DollarSign size={12} /> :
                            file.fileType === 'utility-bill' ? <Droplet size={12} /> :
                              <ThumbsUp size={12} />
                      ) : <FileText size={12} />}
                    </div>
                    <div className={styles.documentInfo}>
                      <p>{uploadedFiles.documentTypes.find(doc => doc.code === file.fileType)?.name || 'Document'}</p>
                      <p>Issued: {file.dateRange ? formatPrettyDateRange(file.dateRange) : 'Not specified'}</p>
                      <p>Country: {uploadedFiles.countriesOfIssue.find(country => country.code === file.countryCode)?.name || 'Not specified'}</p>
                    </div>
                    <span className={styles.fileStatus}>Uploaded</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.notCompleted}>
                <span>No documents uploaded</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Action Buttons */}

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>

        <div className={styles.actionButtons}>
          <Button
            variant="primary"
            className={styles.completeButton}
            onClick={() => { navigate('/wizard/partner-pending') }}
          >
            Next
          </Button>
        </div>
        <div className={styles.navigationButtonsDual}>
          <Button
            variant="secondary"
            className={styles.navigationButtonLeft}
            onClick={() => navigate('/wizard/upload-file')}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            variant="secondary"
            className={styles.navigationButtonRight}
            onClick={() => { navigate('/wizard/kyc') }}
          >
            Skip
            <ArrowRight />
          </Button>
        </div>
      </div>

    </div>
  )
}

export default CompleteProfile