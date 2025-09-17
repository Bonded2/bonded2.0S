import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentFile, addUploadedFile, clearCurrentFile, removeUploadedFile } from "@/store/slices/profileSlice";

export const UploadFileFunction = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { uploadedFiles } = useAppSelector((state) => state.profile);

    // Local state for UI interactions
    const [chooseFile, setChooseFile] = useState(false);
    const [hasContinued, setHasContinued] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    // Get data from Redux store
    const selectedFileType = uploadedFiles.currentFile.fileType;
    const selectedCountryCode = uploadedFiles.currentFile.countryCode;
    const selectedFile = uploadedFiles.currentFile.file;
    const selectedDateRange = uploadedFiles.currentFile.dateRange;
    const documentType = uploadedFiles.documentTypes;
    const countryOfIssue = uploadedFiles.countriesOfIssue;

    // Data arrays (static UI data)
    const fileList = [
        { icon: 'Heart', title: 'Marriage Certificate', type: 'marriage-certificate' },
        { icon: 'DollarSign', title: 'Bank Statement', type: 'bank-statement' },
        { icon: 'Droplet', title: 'Utility Bill', type: 'utility-bill' },
        { icon: 'ThumbsUp', title: 'Other', type: 'other' },
    ];

    // Event handlers
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Basic validation: size and type
        const maxBytes = 10 * 1024 * 1024; // 10MB
        const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
        if (file.size > maxBytes) {
            console.warn('File exceeds 10MB limit.');
            event.target.value = '';
            return;
        }
        if (!allowed.includes(file.type)) {
            console.warn('Only PDF, JPG, or PNG are allowed.');
            event.target.value = '';
            return;
        }

        const effectiveTypeCode = selectedFileType || 'other';
        if (!selectedFileType) {
            dispatch(setCurrentFile({ fileType: effectiveTypeCode }));
        }
        // Create object URL and remember to revoke it on cleanup
        const url = URL.createObjectURL(file);
        const fileMeta = {
            name: file.name,
            size: file.size,
            type: file.type,
            url,
        };
        dispatch(setCurrentFile({ file: fileMeta }));
        setChooseFile(true);
    };

    const handleFileTypeClick = (code) => {
        dispatch(setCurrentFile({ fileType: code }));
    };

    const handleDateRangeSelect = (range) => {
        const serializableRange = {
            start: range?.start ? new Date(range.start).toISOString() : null,
            end: range?.end ? new Date(range.end).toISOString() : null,
        };
        dispatch(setCurrentFile({ dateRange: serializableRange }));
        setShowCalendar(false);
    };

    const handleNavigateToStep = (path) => {
        navigate(path);
    };

    // New function to handle multiple dropdown states
    const handleDropdownToggle = (dropdownId, isOpen) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [dropdownId]: isOpen
        }));
    };

    // Function to close all dropdowns
    const closeAllDropdowns = () => {
        setOpenDropdowns({});
    };

    // Handle continue button click
    const handleContinue = () => {
        // Save current file to uploaded files
        dispatch(addUploadedFile({ isProcessed: true }));
        setHasContinued(true);
    };

    // Handle removing the last uploaded file
    const handleRemoveLastFile = () => {
        const lastFile = uploadedFiles.files[uploadedFiles.files.length - 1];
        if (lastFile) {
            dispatch(removeUploadedFile(lastFile.id));
            setChooseFile(false);
            setHasContinued(false);
            setSelectedFileType(null);
            setSelectedCountryCode('');
            setSelectedDateRange({ start: null, end: null });
            const input = document.getElementById('global-file-input');
            if (input) input.value = '';
        }
    };

    // Ensure the in-progress file is saved before leaving the page
    const finalizeCurrentFile = () => {
        if (uploadedFiles.currentFile && uploadedFiles.currentFile.file) {
            // If not already saved (simple check by absence in array), add it
            const alreadySaved = uploadedFiles.files.some(
                f => f.file && f.file.url === uploadedFiles.currentFile.file.url
            );
            if (!alreadySaved) {
                dispatch(addUploadedFile({ isProcessed: true }));
            }
        }
    };

    // Helper functions for Redux actions
    const setSelectedFileType = (fileType) => {
        dispatch(setCurrentFile({ fileType }));
    };

    const setSelectedCountryCode = (countryCode) => {
        dispatch(setCurrentFile({ countryCode }));
    };

    const setSelectedFile = (file) => {
        dispatch(setCurrentFile({ file }));
    };

    const setSelectedDateRange = (dateRange) => {
        const serializableRange = {
            start: dateRange?.start ? new Date(dateRange.start).toISOString() : null,
            end: dateRange?.end ? new Date(dateRange.end).toISOString() : null,
        };
        dispatch(setCurrentFile({ dateRange: serializableRange }));
    };

    // Utility functions
    const formatDate = (date) => {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatDateRange = (range) => {
        if (!range || !range.start || !range.end) return '';
        const startDate = typeof range.start === 'string' ? new Date(range.start) : range.start;
        const endDate = typeof range.end === 'string' ? new Date(range.end) : range.end;
        const start = formatDate(startDate);
        const end = formatDate(endDate);
        if (startDate.getTime() === endDate.getTime()) return start;
        return `${start} - ${end}`;
    };

    // Pretty printing for date ranges like "September 1 - September 5"
    const formatPrettyDateRange = (range) => {
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
                // Same month and year
                return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
            }
            // Different months, same year
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
        }

        // Different years
        return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
    };

    // Effects
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        if (showCalendar) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCalendar]);

    // Revoke object URL on unmount or when selected file changes
    useEffect(() => {
        const currentUrl = selectedFile?.url;
        return () => {
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [selectedFile?.url]);

    return {
        // State
        chooseFile,
        setChooseFile,
        selectedFileType,
        setSelectedFileType,
        selectedCountryCode,
        setSelectedCountryCode,
        selectedFile,
        setSelectedFile,
        openDropdowns,
        setOpenDropdowns,
        selectedDateRange,
        setSelectedDateRange,
        showCalendar,
        setShowCalendar,
        calendarRef,
        hasContinued,
        setHasContinued,

        // Data
        fileList,
        documentType,
        countryOfIssue,
        uploadedFiles,

        // Handlers
        navigate,
        handleFileSelect,
        handleFileTypeClick,
        handleDateRangeSelect,
        handleNavigateToStep,
        handleDropdownToggle,
        closeAllDropdowns,
        handleContinue,
        handleRemoveLastFile,
        finalizeCurrentFile,

        // Utilities
        formatDate,
        formatDateRange,
        formatPrettyDateRange,
    };
};