import React from 'react'
import { MessageCircle, ChevronRight, Image, Phone, Facebook, Mail, Calendar, File  } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addUploadedPhoto } from '@/store/slices/uploadSline';
import { getIdentity } from '../../services/ii'
// example profile picture
import rimuro from '@/assets/example/rimuro.jpg';

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

export const useDashboard = () => {
    const dispatch = useAppDispatch();
    const uploadedPhotos = useAppSelector(state => state.upload.uploadedPhotos || []);

    const images = uploadedPhotos && uploadedPhotos.length > 0
        ? uploadedPhotos.map(photo => photo.photo)
        : ['placeholder'];

    const dates = uploadedPhotos && uploadedPhotos.length > 0
        ? uploadedPhotos.map(photo => photo.uploadDate)
        : ['No photos uploaded'];

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         const now = new Date();
        //         const uploadDate = now.toISOString().split('T')[0];
        //         const displayDate = now.toLocaleDateString('en-GB');



        //         const uploadedPhotoData = {
        //             photo: e.target.result,
        //             fileName: file.name,
        //             uploadDate: uploadDate,
        //             displayDate: displayDate,
        //         };

        //         dispatch(addUploadedPhoto(uploadedPhotoData));
        //     };
        //     reader.readAsDataURL(file);
        // }

            let fileToCompress = file
            if (typeof file === 'string') {
                fileToCompress = dataURLtoBlob(file)
            }
            
            const auth = await getIdentity()
            
            const { identity: userIdentity, authenticatedActor } = auth
            
            const compressed = await compressImage(fileToCompress)
            const arrayBuffer = await compressed.arrayBuffer()
            const photo = new Uint8Array(arrayBuffer)
                        
            const photodata = await authenticatedActor.upload_photo([...photo])
                        
            if (photodata.Ok){
                console.log(photodata.Ok)
            } else {
                console.log(photodata.Err)
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
            to: '/dashboard/media',
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
        {
            icon: <File />,
            title: 'Documents',
            rightIcon: <ChevronRight />,
            to: '/dashboard/documents',
        },
    ];

    const evidence = [
        {
            image: rimuro,
            title: 'Facebook post by Emelie',
            time: '13:23 PM',
        },
        {
            image: rimuro,
            title: 'Facebook post by Emelie',
            time: '13:23 PM',
        },
        
        {
            image: rimuro,
            title: 'Facebook post by Emelie',
            time: '13:23 PM',
        },
        
        {
            image: rimuro,
            title: 'Facebook post by Emelie',
            time: '13:23 PM',
        },
        
    ];

    return {
        images,
        dates,
        browseEvidence,
        evidence,
    };
};
