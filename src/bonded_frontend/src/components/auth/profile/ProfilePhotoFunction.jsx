import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setProfilePhoto, removeProfilePhoto, updateValidationChecks } from "@/store/slices/profileSlice";
import { validateFrame, startCamera, stopCamera, capturePhoto } from "@/reusable/cameraValidation";

export const useProfilePhoto = () => {
    const dispatch = useAppDispatch();
    const { profilePhoto } = useAppSelector((state) => state.profile);

    const navigate = useNavigate();

    // Get data from Redux store
    const uploadPhoto = profilePhoto.photo;
    const uploadedFileName = profilePhoto.fileName;
    const validationCamera = profilePhoto.validationChecks;
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);


    // Camera validation effect
    useEffect(() => {
        let validationInterval;

        const runValidation = async () => {
            if (document.visibilityState !== 'visible') return;
            if (videoRef.current && videoRef.current.readyState >= 2 && !isValidating) {
                setIsValidating(true);
                try {
                    const result = await validateFrame(videoRef.current);
                    dispatch(updateValidationChecks(result.checks));
                } catch (error) {
                    console.error('Validation error:', error);
                } finally {
                    setIsValidating(false);
                }
            }
        };

        if (isCameraActive) {
            // Run validation every 300ms for better performance
            validationInterval = setInterval(runValidation, 300);
        }

        return () => {
            if (validationInterval) clearInterval(validationInterval);
        };
    }, [isCameraActive, isValidating, dispatch]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                stopCamera(streamRef.current);
            }
        };
    }, []);

    const startCameraHandler = async () => {
        try {
            setCameraError(null);
            const stream = await startCamera({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (error) {
            setCameraError(error.message);
            console.error('Camera error:', error);
        }
    };

    const stopCameraHandler = () => {
        if (streamRef.current) {
            stopCamera(streamRef.current);
            streamRef.current = null;
        }
        setIsCameraActive(false);
        dispatch(updateValidationChecks([
            { text: "Photo has good lighting", isMet: false },
            { text: "Details are in focus", isMet: false },
            { text: "There is no glare", isMet: false }
        ]));
    };

    const capturePhotoHandler = () => {
        if (videoRef.current && isCameraActive) {
            const photoDataUrl = capturePhoto(videoRef.current);
            dispatch(setProfilePhoto({
                photo: photoDataUrl,
                fileName: 'captured-photo.jpg'
            }));
            stopCameraHandler();
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch(setProfilePhoto({
                    photo: e.target.result,
                    fileName: file.name
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRetakePhoto = () => {
        dispatch(removeProfilePhoto());
    };

    const handleContinue = () => {
        navigate('/wizard/nationalities');
    };

    const handleNavigateToStep = (path) => {
        navigate(path);
    };


    const handleFileUploadWithName = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch(setProfilePhoto({
                    photo: e.target.result,
                    fileName: file.name
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        dispatch(removeProfilePhoto());
    };

    return {
        // State
        uploadPhoto,
        validationCamera,
        isCameraActive,
        cameraError,
        isValidating,
        uploadedFileName,

        // Refs
        videoRef,
        fileInputRef,

        // Handlers
        startCameraHandler,
        stopCameraHandler,
        capturePhotoHandler,
        handleFileUpload,
        handleRetakePhoto,
        handleContinue,
        handleNavigateToStep,
        handleFileUploadWithName,
        handleRemovePhoto,
    };
};