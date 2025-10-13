import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addUploadedDocument, ALL_COUNTRY_CODES } from '@/store/slices/uploadSline';

import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import * as nsfwjs from 'nsfwjs';

// Configure WASM path (critical for mobile devices)
setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.22.0/dist/');

// Module-scope singletons for performance 
let nsfwModelPromise = null;
const getNSFWModel = () => {
    if (!nsfwModelPromise) {
        nsfwModelPromise = (async () => {
            try {
                console.log('Initializing NSFW detection...');
                
                // Detect if we're on mobile
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');

                // Try backends in order: WebGL -> WASM -> CPU
                let backendSet = false;
                
                // Try WebGL first (works on most desktops and some mobile)
                if (!backendSet) {
                    try {
                        console.log('🎮 Attempting WebGL backend...');
                        await tf.setBackend('webgl');
                        await tf.ready();
                        if (tf.getBackend() === 'webgl') {
                            console.log('✅ WebGL backend initialized successfully');
                            backendSet = true;
                        }
                    } catch (e) {
                        console.warn('⚠️ WebGL backend failed:', e.message);
                    }
                }

                // Fallback to WASM (better for mobile)
                if (!backendSet) {
                    try {
                        console.log('Attempting WASM backend...');
                        await tf.setBackend('wasm');
                        await tf.ready();
                        if (tf.getBackend() === 'wasm') {
                            console.log('WASM backend initialized successfully');
                            backendSet = true;
                        }
                    } catch (e) {
                        console.warn('WASM backend failed:', e.message);
                    }
                }

                // Last resort: CPU backend (slowest but most compatible)
                if (!backendSet) {
                    try {
                        console.log('💻 Attempting CPU backend...');
                        await tf.setBackend('cpu');
                        await tf.ready();
                        if (tf.getBackend() === 'cpu') {
                            console.log('✅ CPU backend initialized successfully');
                            backendSet = true;
                        }
                    } catch (e) {
                        console.error('❌ CPU backend failed:', e.message);
                    }
                }

                if (!backendSet) {
                    throw new Error('Failed to initialize any TensorFlow backend');
                }

                const finalBackend = tf.getBackend();
                console.log('Final TensorFlow backend:', finalBackend);

                // Load NSFW model with timeout (mobile devices may be slower)
                console.log('Loading NSFW model...');
                const modelLoadTimeout = isMobile ? 30000 : 15000; // 30s for mobile, 15s for desktop
                
                const modelPromise = nsfwjs.load();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Model load timeout')), modelLoadTimeout)
                );
                
                const model = await Promise.race([modelPromise, timeoutPromise]);
                console.log('NSFW Model loaded successfully');

                // Warmup inference (optional, skip on mobile to save memory)
                if (!isMobile) {
                    try {
                        console.log('Warming up model...');
                        const dummyImg = document.createElement('canvas');
                        dummyImg.width = 224;
                        dummyImg.height = 224;
                        await model.classify(dummyImg);
                        console.log('Model warmed up successfully');
                    } catch (e) {
                        console.warn('Model warmup skipped:', e.message);
                    }
                } else {
                    console.log('Skipping warmup on mobile to save memory');
                }

                console.log('NSFW detection ready!');
                return model;
            } catch (error) {
                console.error('Failed to initialize NSFW detection:', error);
                nsfwModelPromise = null;
                throw error;
            }
        })();
    }
    return nsfwModelPromise;
};

// Static data built once at module scope
const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

const DOCUMENT_TYPES = Object.freeze([
    { code: 'marriage-certificate', name: 'Marriage Certificate' },
    { code: 'bank-statement', name: 'Bank Statement' },
    { code: 'utility-bill', name: 'Utility Bill' },
    { code: 'passport', name: 'Passport' },
    { code: 'visa', name: 'Visa' },
    { code: 'birth-certificate', name: 'Birth Certificate' },
    { code: 'other', name: 'Other' },
]);

// ANCHOR: Country codes helper
const codeToFlagEmoji = (code) =>
    code
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

export const useUploadFunction = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const uploadedDocuments = useAppSelector(state => state.upload.uploadedDocuments || []);

    // ANCHOR: Group related state to reduce renders
    const [state, setState] = useState({
        chooseFile: false,
        hasContinued: false,
        showCalendar: false,
        isLegalDocument: false,
        selectedFile: null,
        selectedFileType: '',
        selectedCountryCode: '',
        selectedDateRange: { start: null, end: null },
        openDropdowns: {},
    });

    const calendarRef = useRef(null);

    // ANCHOR: NSFW Model State
    const [modelLoading, setModelLoading] = useState(true);
    const [modelError, setModelError] = useState(null);
    const modelRef = useRef(null);
    const mounted = useRef(true);

    // ANCHOR: Generate country list from ALL_COUNTRY_CODES (built once with module-scope REGION_NAMES)
    const countryOfIssue = useMemo(() => {
        return ALL_COUNTRY_CODES.map((code) => ({
            name: REGION_NAMES.of(code) || code,
            code,
            flag: codeToFlagEmoji(code),
        }))
            .filter((c) => Boolean(c.name))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    // ANCHOR: Load NSFW Model on Mount (using cached singleton)
    useEffect(() => {
        mounted.current = true;
        (async () => {
            try {
                const model = await getNSFWModel();
                if (!mounted.current) return;
                modelRef.current = model;
                setModelLoading(false);
                setModelError(null);
            } catch (error) {
                console.error('Failed to load NSFW Model:', error);
                if (!mounted.current) return;
                setModelLoading(false);
                setModelError(error?.message || 'Failed to load NSFW model');
            }
        })();
        return () => {
            mounted.current = false;
        };
    }, []);

    // ANCHOR: Image Classification Function (with proper timeout cleanup and mobile optimization)
    const classifyImage = useCallback(async (imageFile) => {
        const model = modelRef.current;
        if (!model) {
            console.warn('Model not ready yet');
            return { success: false, error: 'Model not loaded', isNSFW: false };
        }

        console.log('Starting image classification...');
        console.log('File:', imageFile.name, 'Size:', (imageFile.size / 1024).toFixed(2), 'KB');

        try {
            // Convert File to data URL (fixes CSP blob: URL restriction)
            console.log('Reading file as data URL...');
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log('File read successfully');
                    resolve(e.target.result);
                };
                reader.onerror = () => {
                    console.error('Failed to read file');
                    reject(new Error('Failed to read file'));
                };
                reader.readAsDataURL(imageFile);
            });

            // Create image element and load data URL with proper timeout cleanup
            console.log('Loading image...');
            const img = new Image();
            
            // Set crossOrigin to anonymous to avoid CORS issues
            img.crossOrigin = 'anonymous';
            
            let timeoutId;
            const loadPromise = new Promise((resolve, reject) => {
                img.onload = () => {
                    clearTimeout(timeoutId);
                    console.log('Image loaded:', img.width, 'x', img.height);
                    resolve();
                };
                img.onerror = (e) => {
                    clearTimeout(timeoutId);
                    console.error('Failed to load image:', e);
                    reject(new Error('Failed to load image'));
                };
                // Increased timeout for mobile devices (they may be slower)
                timeoutId = setTimeout(() => {
                    console.error('Image load timeout');
                    reject(new Error('Image load timeout'));
                }, 15000); // 15 seconds
            });

            img.src = dataUrl;
            await loadPromise;

            console.log('🤖 Analyzing image content with', tf.getBackend(), 'backend...');
            const startTime = Date.now();
            
            // Run classification with timeout
            const classifyPromise = model.classify(img);
            const classifyTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Classification timeout')), 20000)
            );
            
            const predictions = await Promise.race([classifyPromise, classifyTimeout]);
            const duration = Date.now() - startTime;
            
            console.log(`Classification completed in ${duration}ms`);
            console.log('NSFW Predictions:');
            predictions.forEach(p => {
                console.log(`  - ${p.className}: ${(p.probability * 100).toFixed(2)}%`);
            });

            // ANCHOR: NSFW thresholds
            const PORN_THRESHOLD = 0.4;
            const HENTAI_THRESHOLD = 0.4;
            const SEXY_THRESHOLD = 0.4;

            const isNSFW = predictions.some(p => {
                const probability = p.probability;
                const className = p.className.toLowerCase();

                if (className === 'porn' && probability > PORN_THRESHOLD) {
                    console.warn(`NSFW Detected: ${className} (${(probability * 100).toFixed(1)}%)`);
                    return true;
                }
                if (className === 'hentai' && probability > HENTAI_THRESHOLD) {
                    console.warn(`NSFW Detected: ${className} (${(probability * 100).toFixed(1)}%)`);
                    return true;
                }
                if (className === 'sexy' && probability > SEXY_THRESHOLD) {
                    console.warn(`NSFW Detected: ${className} (${(probability * 100).toFixed(1)}%)`);
                    return true;
                }
                return false;
            });

            if (isNSFW) {
                console.warn('Image flagged as NSFW');
            } else {
                console.log('Image passed content check');
            }

            return { success: true, isNSFW, predictions };

        } catch (error) {
            console.error('NSFW Classification failed:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            // Return detailed error information
            return {
                success: false,
                error: error.message || 'Unknown error',
                isNSFW: false
            };
        }
    }, []);

    // ANCHOR: Event handlers (wrapped in useCallback for stable identity)
    const handleFileSelect = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // ANCHOR: Basic validation: size and type
        const maxBytes = 10 * 1024 * 1024; // 10MB
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (file.size > maxBytes) {
            console.warn('File exceeds 10MB limit.');
            alert('File size must be less than 10MB');
            event.target.value = '';
            return;
        }
        if (!allowed.includes(file.type)) {
            console.warn('Only JPG, PNG, or PDF are allowed.');
            alert('Only JPG, PNG, and PDF formats are accepted');
            event.target.value = '';
            return;
        }

        // ANCHOR: NSFW Check (only for image files)
        if (file.type.startsWith('image/')) {
            // Check if model failed to load
            if (modelError) {
                const proceed = window.confirm(
                    'Content scanner could not be loaded. Do you want to proceed anyway?'
                );
                if (!proceed) {
                    event.target.value = '';
                    return;
                }
            }
            // Check if model is still loading
            else if (modelLoading) {
                alert('Content scanner is still loading. Please wait a moment and try again.');
                event.target.value = '';
                return;
            }
            // Run the classification
            else {
                const result = await classifyImage(file);

                // Handle classification errors
                if (!result.success) {
                    console.error('Classification error:', result.error);
                    const proceed = window.confirm(
                        `Unable to scan image content (${result.error}). Do you want to proceed with upload anyway?`
                    );
                    if (!proceed) {
                        event.target.value = '';
                        return;
                    }
                    // User chose to proceed despite error
                    console.log('User chose to proceed despite classification error.');
                }
                // Handle unsafe content detection
                else if (result.isNSFW) {
                    console.warn('Image content flagged as inappropriate. Upload canceled.');
                    // Clear the input
                    event.target.value = '';
                    // Navigate to the detected image page
                    navigate('/dashboard/detected-image');
                    return; // STOP THE UPLOAD
                }
                // Image passed all checks
                else {
                    console.log('Image passed content check.');
                }
            }
        }

        // ANCHOR: Create file metadata (Blob URL for local preview only, not persisted in Redux)
        const fileMeta = {
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
        };
        setState(s => ({ ...s, selectedFile: fileMeta, chooseFile: true }));
    }, [classifyImage, modelError, modelLoading, navigate]);

    const handleDateRangeSelect = useCallback((range) => {
        setState(s => ({ ...s, selectedDateRange: range, showCalendar: false }));
    }, []);

    // ANCHOR: Handle multiple dropdown states
    const handleDropdownToggle = useCallback((dropdownId, isOpen) => {
        setState(s => ({
            ...s,
            openDropdowns: { ...s.openDropdowns, [dropdownId]: isOpen }
        }));
    }, []);

    // ANCHOR: Function to close all dropdowns
    const closeAllDropdowns = useCallback(() => {
        setState(s => ({ ...s, openDropdowns: {} }));
    }, []);

    // ANCHOR: Handle continue button click
    const handleContinue = useCallback(() => {
        if (!state.selectedFile || !state.selectedFileType || !state.selectedCountryCode || !state.selectedDateRange.start) {
            alert('Please fill in all required fields');
            return;
        }
        setState(s => ({ ...s, hasContinued: true }));
    }, [state.selectedFile, state.selectedFileType, state.selectedCountryCode, state.selectedDateRange.start]);

    // ANCHOR: Handle removing the selected file
    const handleRemoveFile = useCallback(() => {
        setState(s => ({
            ...s,
            selectedFile: null,
            chooseFile: false,
            hasContinued: false,
            selectedFileType: '',
            selectedCountryCode: '',
            selectedDateRange: { start: null, end: null },
            isLegalDocument: false
        }));
        const input = document.getElementById('upload-file-input');
        if (input) input.value = '';
    }, []);

    // ANCHOR: Handle upload files button - save to Redux and navigate
    const handleUploadFiles = useCallback(() => {
        const { selectedFile, selectedFileType, selectedCountryCode, selectedDateRange, isLegalDocument } = state;

        if (!selectedFile || !selectedFileType || !selectedCountryCode || !selectedDateRange.start) {
            alert('Please fill in all required fields');
            return;
        }

        // Get country name from countryOfIssue list
        const country = countryOfIssue.find(c => c.code === selectedCountryCode);
        const countryName = country?.name || selectedCountryCode;

        // ⚠️ CRITICAL: Do NOT persist Blob URLs in Redux - they will be revoked!
        // Store only metadata + a temporary ID. Upload file separately to server.
        const documentData = {
            tempId: crypto.randomUUID ? crypto.randomUUID() : `temp-${Date.now()}-${Math.random()}`,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size,
            documentType: selectedFileType,
            countryCode: selectedCountryCode,
            countryName: countryName,
            dateRange: selectedDateRange,
            isLegalDocument: isLegalDocument,
            uploadDate: new Date().toISOString(),
            // NOTE: Blob URL is NOT stored here - handle actual file upload separately
        };

        // Dispatch to Redux store
        dispatch(addUploadedDocument(documentData));

        // Navigate to confirmation page
        navigate('/dashboard/upload-confirmation');
    }, [state, countryOfIssue, dispatch, navigate]);

    // ANCHOR: Utility functions (stable with useCallback)
    const formatDate = useCallback((date) => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }, []);

    const formatDateRange = useCallback((range) => {
        if (!range || !range.start || !range.end) return '';
        const startDate = typeof range.start === 'string' ? new Date(range.start) : range.start;
        const endDate = typeof range.end === 'string' ? new Date(range.end) : range.end;
        const start = startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const end = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        if (startDate.getTime() === endDate.getTime()) return start;
        return `${start} - ${end}`;
    }, []);

    const formatPrettyDateRange = useCallback((range) => {
        if (!range || !range.start) return '';
        const startDate = typeof range.start === 'string' ? new Date(range.start) : range.start;
        const endDate = range.end ? (typeof range.end === 'string' ? new Date(range.end) : range.end) : null;

        const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
        const startDay = startDate.getDate();
        const startYear = startDate.getFullYear();

        if (!endDate || startDate.getTime() === endDate.getTime()) {
            return `${startMonth} ${startDay}, ${startYear}`;
        }

        const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
        const endDay = endDate.getDate();
        const endYear = endDate.getFullYear();

        if (startYear === endYear) {
            if (startMonth === endMonth) {
                return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
            }
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
        }

        return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
    }, []);

    // ANCHOR: Effects - Click outside calendar with stable handler
    useEffect(() => {
        if (!state.showCalendar) return;

        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setState(s => ({ ...s, showCalendar: false }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [state.showCalendar]);

    // ANCHOR: Revoke object URL on unmount or when selected file changes
    useEffect(() => {
        const currentUrl = state.selectedFile?.url;
        return () => {
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [state.selectedFile?.url]);

    // ANCHOR: Stable setters using useCallback
    const setChooseFile = useCallback((value) => setState(s => ({ ...s, chooseFile: value })), []);
    const setSelectedFileType = useCallback((value) => setState(s => ({ ...s, selectedFileType: value })), []);
    const setSelectedCountryCode = useCallback((value) => setState(s => ({ ...s, selectedCountryCode: value })), []);
    const setSelectedFile = useCallback((value) => setState(s => ({ ...s, selectedFile: value })), []);
    const setOpenDropdowns = useCallback((value) => setState(s => ({ ...s, openDropdowns: value })), []);
    const setSelectedDateRange = useCallback((value) => setState(s => ({ ...s, selectedDateRange: value })), []);
    const setShowCalendar = useCallback((value) => setState(s => ({ ...s, showCalendar: value })), []);
    const setHasContinued = useCallback((value) => setState(s => ({ ...s, hasContinued: value })), []);
    const setIsLegalDocument = useCallback((value) => setState(s => ({ ...s, isLegalDocument: value })), []);

    return {
        // State (destructured from grouped state)
        chooseFile: state.chooseFile,
        setChooseFile,
        selectedFileType: state.selectedFileType,
        setSelectedFileType,
        selectedCountryCode: state.selectedCountryCode,
        setSelectedCountryCode,
        selectedFile: state.selectedFile,
        setSelectedFile,
        openDropdowns: state.openDropdowns,
        setOpenDropdowns,
        selectedDateRange: state.selectedDateRange,
        setSelectedDateRange,
        showCalendar: state.showCalendar,
        setShowCalendar,
        calendarRef,
        hasContinued: state.hasContinued,
        setHasContinued,
        isLegalDocument: state.isLegalDocument,
        setIsLegalDocument,

        // NSFW Model State
        modelLoading,
        modelError: !!modelError,

        // Data
        documentType: DOCUMENT_TYPES,
        countryOfIssue,
        uploadedDocuments,

        // Handlers
        navigate,
        handleFileSelect,
        handleDateRangeSelect,
        handleDropdownToggle,
        closeAllDropdowns,
        handleContinue,
        handleRemoveFile,
        handleUploadFiles,

        // Utilities
        formatDate,
        formatDateRange,
        formatPrettyDateRange,
    };
};

export default useUploadFunction;
