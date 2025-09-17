import React, { useEffect, useState, useRef } from 'react'
import styles from './scss/_integrationphoto.module.scss'
import DotsWizard from '@/components/wizard/DotsWizard'
import { useNavigate } from 'react-router-dom'
import Button from '@/reusable/Button'
import Checkbox from '@/reusable/Checkbox'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setPhotoAccess } from '@/store/slices/integrationSlice'
import { ArrowLeft, ArrowRight, Camera, AlertCircle } from 'lucide-react'

const IntegrartionPhoto = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { photo } = useAppSelector((state) => state.integration);
    const [allowFullAccess, setAllowFullAccess] = useState(false)
    const [permissionStatus, setPermissionStatus] = useState('idle')
    const [selectedFiles, setSelectedFiles] = useState([])
    const fileInputRef = useRef(null)
    
    const handleNavigateToStep = (step) => {
        navigate(step);
    }

    // Handle file selection when user picks photos
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setSelectedFiles(files);
            setPermissionStatus('granted');
            setAllowFullAccess(true);
            dispatch(setPhotoAccess('Full access'));
            
            console.log('Selected files:', files.map(f => f.name));
            
        } else {
            setAllowFullAccess(false);
            setPermissionStatus('idle');
            dispatch(setPhotoAccess(''));
        }
    }

    // Handle checkbox change and trigger file picker
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        
        if (isChecked) {
            setPermissionStatus('requesting');
            // Trigger the file picker
            fileInputRef.current?.click();
        } else {
            setAllowFullAccess(false);
            setPermissionStatus('idle');
            setSelectedFiles([]);
            dispatch(setPhotoAccess(''));
        }
    }

    // Load saved state on component mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('integration.photoAccess')
            if (saved && saved === 'Full access') {
                dispatch(setPhotoAccess(saved))
                setAllowFullAccess(true)
                setPermissionStatus('granted')
            }
        } catch (e) { 
            console.error('Error loading saved photo access:', e)
        }
    }, [dispatch])

    // Save state when allowFullAccess changes
    useEffect(() => {
        const value = allowFullAccess ? 'Full access' : ''
        dispatch(setPhotoAccess(value))
        try {
            localStorage.setItem('integration.photoAccess', value)
        } catch (e) { 
            console.error('Error saving photo access:', e)
        }
    }, [allowFullAccess, dispatch])

    return (
        <div className={styles.integrationPhotoContainer}>
            <div className={styles.header}>
                <p className={styles.superTitle}>Integrations</p>
                <p className={styles.title}>
                    Photo library
                </p>

                <DotsWizard
                    classes={{ dots: styles.dots, dot: styles.dot, active: styles.active }}
                    onNavigate={handleNavigateToStep}
                />
            </div>

            <div className={styles.integrationPhotoContent}>
                <p>Connect your photo library to Bonded. Stamps are created only when photos clearly include both you and your partner. All other photos are ignored. 
                    <button className={styles.inlineLink}>read more</button>
                </p>
                
                {/* Permission Status Feedback */}
                {permissionStatus === 'requesting' && (
                    <div className={styles.warning}>
                        <Camera className={styles.statusIcon} />
                        Please select photos from your gallery to grant access.
                    </div>
                )}
                
                {permissionStatus === 'granted' && selectedFiles.length > 0 && (
                    <div className={styles.successMessage}>
                        <Camera className={styles.statusIcon} />
                        Access granted! {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} selected.
                    </div>
                )}
                
                {permissionStatus === 'denied' && (
                    <div className={styles.errorMessage}>
                        <AlertCircle className={styles.statusIcon} />
                        Photo access was denied. You can try again or skip this step.
                    </div>
                )}
            </div>

            <div className={styles.integrationPhotoCheckbox}>
                <Checkbox
                    label="Allow full access"
                    checked={allowFullAccess}
                    onChange={handleCheckboxChange}
                    disabled={permissionStatus === 'requesting'}
                />
                
                {/* Status line for user feedback */}
                <div className={styles.statusLine}>
                    <small>
                        {permissionStatus === 'idle' && 'Check the box to select photos from your gallery'}
                        {permissionStatus === 'requesting' && 'Opening photo gallery...'}
                        {permissionStatus === 'granted' && `Access granted - ${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} selected`}
                        {permissionStatus === 'denied' && 'Access denied - try again or skip'}
                    </small>
                </div>
            </div>

            <div className={styles.integrationPhotoButton}>
                <Button variant="primary" onClick={() => navigate('/wizard/integration-location')}>
                    Next
                </Button>
            </div>

            {/* Navigation Buttons */}
            <div className={styles.nationalitiesButton}>
                <div className={styles.nationalitiesButtonDual}>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualLeft}
                        onClick={() => navigate('/wizard/integration-calendar')}>
                        <ArrowLeft />
                        Back
                    </Button>
                    <Button
                        variant="secondary"
                        className={styles.nationalitiesButtonDualRight}
                        onClick={() => navigate('/wizard/integration-location')}>
                        Skip
                        <ArrowRight />
                    </Button>
                </div>
            </div>

            {/* Hidden file input for photo selection */}
            <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileSelect}
            />
        </div>
    )
}

export default IntegrartionPhoto