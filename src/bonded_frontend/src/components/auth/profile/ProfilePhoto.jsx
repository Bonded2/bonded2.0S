import React from "react";
import styles from "./scss/_profilephoto.module.scss";
import ValidationChecklist from "@/reusable/ValidationChecklist";
import Button from "@/reusable/Button";
import { useProfilePhoto } from "./ProfilePhotoFunction";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DotsWizard from "@/components/wizard/DotsWizard";

const ProfilePhoto = () => {
  const navigate = useNavigate();

  const {
    uploadPhoto,
    validationCamera,
    isCameraActive,
    cameraError,
    isValidating,
    uploadedFileName,
    videoRef,
    fileInputRef,
    startCameraHandler,
    stopCameraHandler,
    capturePhotoHandler,
    handleFileUpload,
    handleRetakePhoto,
    handleContinue,
    handleNavigateToStep,
    handleFileUploadWithName,
    handleRemovePhoto,
  } = useProfilePhoto();

  return (
    <div className={styles.profilePhotoContainer}>

      <div className={styles.header}>

        <p className={styles.superTitle}>Complete your passport</p>
        <p className={styles.title}>
          Add a profile photo
        </p>

        <DotsWizard
          classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
          onNavigate={handleNavigateToStep}
        />

        <div className={styles.profilePhotoContent}>
          <p>
            Upload a photo of yourself or take a new one. Just make sure it meets these simple guidelines below.
          </p>
        </div>

        <div className={styles.validationCamera}>
          <ValidationChecklist validationRules={validationCamera} />
        </div>

        {/* Main Action Button */}
        {!uploadPhoto && !isCameraActive && (
          <>
            <div className={styles.mainActionButton}>
              <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                Upload a photo
              </Button>
            </div>
            {/* Navigation Buttons */}
            <div className={styles.profilePhotoButton}>
              <div className={styles.profilePhotoButtonDual}>
                <Button
                  variant="secondary"
                  className={styles.profilePhotoButtonDualLeft}
                  onClick={() => navigate('/wizard/intro')}>
                  <ArrowLeft />
                  Back
                </Button>
                <Button
                  variant="secondary"
                  className={styles.profilePhotoButtonDualRight}
                  onClick={() => navigate('/wizard/nationalities')}>
                  Skip
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Camera Interface */}
        <div className={styles.cameraInterface}>
          {!uploadPhoto && isCameraActive && (
            <>
              {/* Camera Error */}
              {cameraError && (
                <div className={styles.cameraError}>
                  <p>{cameraError}</p>
                  <p>Please ensure camera permissions are granted and try again.</p>
                </div>
              )}

              {/* Video Preview */}
              <div className={styles.videoContainer}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.videoPreview}
                />
                {isValidating && (
                  <div className={styles.validatingOverlay}>
                    <div className={styles.validatingSpinner}></div>
                    <p>Analyzing photo quality...</p>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className={styles.cameraActiveControls}>
                <Button variant="secondary" onClick={stopCameraHandler}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={capturePhotoHandler}>
                  Capture Photo
                </Button>
              </div>
            </>
          )}

          {/* Display the captured/uploaded photo */}
          {uploadPhoto && (
            <div className={styles.photoPreview}>
              <div className={styles.uploadedFileInfo}>
                <User className={styles.fileIcon} size={20} />
                <span className={styles.fileName}>
                  {uploadedFileName ?
                    (uploadedFileName.length > 15 ?
                      `${uploadedFileName.substring(0, 15)}...` :
                      uploadedFileName
                    ) :
                    'profile-photo.jpg'
                  }
                </span>
                <button
                  onClick={handleRemovePhoto}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
        {
          uploadPhoto && (
            <>
              <div className={styles.photoActions}>
                <Button
                  variant="primary"
                  onClick={() => navigate('/wizard/nationalities')}>
                  Next
                </Button>
                <Button
                  variant="outline"
                  className={styles.retakeButton}
                  onClick={handleRetakePhoto}>
                  Retake
                </Button>
              </div>
              {/* Navigation Buttons */}
              <div className={styles.profilePhotoButton}>
                <div className={styles.profilePhotoButtonDual}>
                  <Button
                    variant="secondary"
                    className={styles.profilePhotoButtonDualLeft}
                    onClick={() => navigate('/wizard/intro')}>
                    <ArrowLeft />
                    Back
                  </Button>
                  <Button
                    variant="secondary"
                    className={styles.profilePhotoButtonDualRight}
                    onClick={() => navigate('/wizard/nationalities')}>
                    Skip
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </>
          )
        }
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileUploadWithName}
        className={styles.fileInput}
        id="file-upload"
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProfilePhoto;
