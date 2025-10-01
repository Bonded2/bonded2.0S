import React, { useState, useEffect } from 'react'
import styles from './scss/_profilephoto.module.scss'
import ValidationChecklist from '@/reusable/ValidationChecklist'
import Button from '@/reusable/Button'
import { useProfilePhoto } from './ProfilePhotoFunction'
import { ArrowLeft, ArrowRight, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DotsWizard from '@/components/wizard/DotsWizard'
import { getIdentity } from '../../../services/ii'

// Convert base64 to Blob
const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) u8arr[n] = bstr.charCodeAt(n)
    return new Blob([u8arr], { type: mime })
}

// Compress image Blob or File to JPEG base64
const compressImage = async (fileOrBlob, quality = 0.7, maxWidth = 800) => {
    const bitmap = await createImageBitmap(fileOrBlob)
    const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1

    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width * scale
    canvas.height = bitmap.height * scale

    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob)
                else reject(new Error('Image compression failed'))
            },
            'image/jpeg',
            quality
        )
    })
}


const ProfilePhoto = () => {
    const navigate = useNavigate()

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
        handleFileUploadWithName,
        handleRetakePhoto,
        handleRemovePhoto,
        handleNavigateToStep
    } = useProfilePhoto()

    const [isUpdating, setIsUpdating] = useState(null)
    const [storedPhoto, setStoredPhoto] = useState(null)
    const [storedFileName, setStoredFileName] = useState(null)

    useEffect(() => {
        const data = localStorage.getItem('profilePhotoData')
        if (data) {
            try {
                const parsed = JSON.parse(data)
                if (parsed?.photo) {
                    setStoredPhoto(parsed.photo)
                    setStoredFileName(parsed.fileName)
                }
            } catch {
                setStoredPhoto(null)
                setStoredFileName(null)
            }
        }
    }, [])

    const handleNext = async () => {
        setIsUpdating(true)
        if (!uploadPhoto) return
        try {
            let fileToCompress = uploadPhoto
            if (typeof uploadPhoto === 'string') {
                fileToCompress = dataURLtoBlob(uploadPhoto)
            }

            const auth = await getIdentity()

            const { identity: userIdentity, authenticatedActor } = auth

            const compressed = await compressImage(fileToCompress)
            const arrayBuffer = await compressed.arrayBuffer()
            const profile = new Uint8Array(arrayBuffer)
            
            const profiledata = await authenticatedActor.update_user_picture([...profile])
            
            if (profiledata.Ok){
                console.log(profiledata.Ok)
                localStorage.setItem(
                    'profilePhotoData',
                    JSON.stringify({ photo: compressed, fileName: uploadedFileName })
                )
                setStoredPhoto(compressed)
                navigate('/wizard/nationalities')
            } else {
                console.log(profiledata.Err)
            }
        } catch (err) {
            console.error('Compression error:', err)
            alert('Failed to process photo. Please try again.')
        } finally {
            setTimeout(() => 
                setIsUpdating(false), 800
            )
        }
    }

    return (
        <div className={styles.profilePhotoContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Complete your passport</p>
                <p className={styles.title}>Add a profile photo</p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />

                <div className={styles.profilePhotoContent}>
                    <p>Upload a photo of yourself or take a new one. Just make sure it meets these simple guidelines below.</p>
                </div>

                <div className={styles.validationCamera}>
                    <ValidationChecklist validationRules={validationCamera} />
                </div>

                {!uploadPhoto && !isCameraActive && (
                    <>
                        <div className={styles.mainActionButton}>
                            <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                                Upload a photo
                            </Button>
                        </div>
                        <div className={styles.profilePhotoButton}>
                            <div className={styles.profilePhotoButtonDual}>
                                <Button variant="secondary" className={styles.profilePhotoButtonDualLeft} onClick={() => navigate('/wizard/passport')}>
                                    <ArrowLeft /> Back
                                </Button>
                                <Button variant="secondary" className={styles.profilePhotoButtonDualRight} onClick={() => navigate('/wizard/nationalities')}>
                                    Skip <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.cameraInterface}>
                    {!uploadPhoto && isCameraActive && (
                        <>
                            {cameraError && (
                                <div className={styles.cameraError}>
                                    <p>{cameraError}</p>
                                    <p>Please ensure camera permissions are granted and try again.</p>
                                </div>
                            )}

                            <div className={styles.videoContainer}>
                                <video ref={videoRef} autoPlay playsInline muted className={styles.videoPreview} />
                                {isValidating && (
                                    <div className={styles.validatingOverlay}>
                                        <div className={styles.validatingSpinner}></div>
                                        <p>Analyzing photo quality...</p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cameraActiveControls}>
                                <Button variant="secondary" onClick={stopCameraHandler}>Cancel</Button>
                                <Button variant="primary" onClick={capturePhotoHandler}>Capture Photo</Button>
                            </div>
                        </>
                    )}

                    {uploadPhoto && (
                        <div className={styles.photoPreview}>
                            <div className={styles.uploadedFileInfo}>
                                <User className={styles.fileIcon} size={20} />
                                <span className={styles.fileName}>
                                    {uploadedFileName
                                        ? uploadedFileName.length > 15
                                            ? `${uploadedFileName.substring(0, 15)}...`
                                            : uploadedFileName
                                        : 'profile-photo.jpg'}
                                </span>
                                <button onClick={handleRemovePhoto} className={styles.removeButton}>Remove</button>
                            </div>
                        </div>
                    )}
                </div>

                {uploadPhoto && (
                    <>
                        <div className={styles.photoActions}>
                            <Button variant="primary" onClick={handleNext} disabled={isUpdating}>{isUpdating ? ('Uploading') : ('Next')}</Button>
                            <Button variant="outline" className={styles.retakeButton} onClick={handleRetakePhoto}>Retake</Button>
                        </div>
                        <div className={styles.profilePhotoButton}>
                            <div className={styles.profilePhotoButtonDual}>
                                <Button variant="secondary" className={styles.profilePhotoButtonDualLeft} onClick={() => navigate('/wizard/intro')}>
                                    <ArrowLeft /> Back
                                </Button>
                                <Button variant="secondary" className={styles.profilePhotoButtonDualRight} onClick={() => navigate('/wizard/nationalities')}>
                                    Skip <ArrowRight />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            

            <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileUploadWithName}
                className={styles.fileInput}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </div>
    )
}

export default ProfilePhoto
