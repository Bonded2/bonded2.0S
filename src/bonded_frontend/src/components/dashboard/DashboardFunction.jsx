import React from 'react'
import { MessageCircle, ChevronRight, Image, Phone, Facebook, Mail, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addUploadedPhoto } from '@/store/slices/uploadSline';

export const useDashboard = () => {
    const dispatch = useAppDispatch();
    const uploadedPhotos = useAppSelector(state => state.upload.uploadedPhotos || []);

    const images = uploadedPhotos && uploadedPhotos.length > 0
        ? uploadedPhotos.map(photo => photo.photo)
        : ['placeholder'];

    const dates = uploadedPhotos && uploadedPhotos.length > 0
        ? uploadedPhotos.map(photo => photo.uploadDate)
        : ['No photos uploaded'];

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const now = new Date();
                const uploadDate = now.toISOString().split('T')[0];
                const displayDate = now.toLocaleDateString('en-GB');

                const uploadedPhotoData = {
                    photo: e.target.result,
                    fileName: file.name,
                    uploadDate: uploadDate,
                    displayDate: displayDate,
                };

                dispatch(addUploadedPhoto(uploadedPhotoData));
            };
            reader.readAsDataURL(file);
        }
    };

    const browseEvidence = [
        {
            icon: <MessageCircle />,
            title: 'Direct Messages',
            rightIcon: <ChevronRight />,
            to: '/dashboard/message',
        },
        {
            icon: <Phone />,
            title: 'Video Calls',
            rightIcon: <ChevronRight />,
            to: '/dashboard/video-calls',
        },
        {
            icon: <Image />,
            title: 'Photo Library',
            rightIcon: <ChevronRight />,
            to: '/dashboard/photo',
        },
        {
            icon: <Facebook />,
            title: 'Social Media',
            rightIcon: <ChevronRight />,
            to: '/dashboard/smedia',
        },
        {
            icon: <Mail />,
            title: 'Emails',
            rightIcon: <ChevronRight />,
            to: '/dashboard/email',
        },
        {
            icon: <Calendar />,
            title: 'Calendar',
            rightIcon: <ChevronRight />,
            to: '/dashboard/calendar',
        },
    ];

    return {
        images,
        dates,
        handlePhotoUpload,
        browseEvidence,
    };
};
