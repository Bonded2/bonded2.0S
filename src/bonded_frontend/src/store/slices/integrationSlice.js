import { createSlice } from '@reduxjs/toolkit';

const initialState = {

    // Direct Message State
    directMessage: {
        messageServices: {},
        chatPlatform: [
            { id: 1, name: 'OpenChat', code: 'openchat' },
            { id: 2, name: 'Telegram', code: 'telegram' },
            { id: 3, name: 'Snapchat', code: 'snapchat' },
            { id: 4, name: 'Viber', code: 'viber' },
            { id: 5, name: 'Signal', code: 'signal' },
            { id: 6, name: 'WhatsApp', code: 'whatsapp' },
            { id: 7, name: 'Messenger', code: 'messenger' },
        ]
    },

    // Email State
    email: {
        emailServices: {},
        emailChatPlatform: [
            { id: 1, name: 'Gmail', code: 'gmail' },
            { id: 2, name: 'Outlook', code: 'outlook' },
            { id: 3, name: 'Yahoo', code: 'yahoo' },
            { id: 4, name: 'iCloud', code: 'icloud' },
            { id: 5, name: 'Proton', code: 'proton' },
        ]
    },

    // Social Media 
    socialMedia: {
        socialMediaServices: {},
        socialMediaChatPlatform: [
            { id: 1, name: 'Facebook', code: 'facebook' },
            { id: 2, name: 'Instagram', code: 'instagram' },
            { id: 3, name: 'Tiktok', code: 'twitter' },
        ]
    },

    // Video Calls
    videoCalls: {
        videoCallsServices: {},
        videoCallsChatPlatform: [
            { id: 1, name: 'Openchat', code: 'openchat' },
            { id: 2, name: 'Whatsapp', code: 'whatsapp' },
            { id: 3, name: 'Messenger', code: 'messenger' },
            { id: 4, name: 'Google Meet', code: 'google-meet' },
            { id: 5, name: 'Zoom', code: 'zoom' },
        ]
    },

    // Calendar
    calendar: {
        calendarServices: {},
        calendarChatPlatform: [
            { id: 1, name: 'Google Calendar', code: 'google-calendar' },
            { id: 2, name: 'Outlook Calendar', code: 'outlook-calendar' },
        ]
    },

    // Photo
    photo: {
        access: ''
    },

    // Location
    location: {
        access: '',
        coordinates: null // { lat, lng, accuracy, timestamp }
    },

    // Integration Status
    status: {
        isConfirmed: false,
        lastUpdated: null,
        updatedBy: null
    }
}

const integrationSlice = createSlice({
    name: 'integration',
    initialState,
    reducers: {
        // Direct Message Actions
        setMessageServices: (state, action) => {
            state.directMessage.messageServices = action.payload;
        },
        setSingleMessageService: (state, action) => {
            const { id, value } = action.payload || {}
            if (typeof id === 'undefined') return
            state.directMessage.messageServices = {
                ...state.directMessage.messageServices,
                [id]: Boolean(value)
            }
        },

        // Email Actions
        setEmailServices: (state, action) => {
            state.email.emailServices = action.payload;
        },
        setSingleEmailService: (state, action) => {
            const { id, value } = action.payload || {}
            if (typeof id === 'undefined') return
            state.email.emailServices = {
                ...state.email.emailServices,
                [id]: Boolean(value)
            }
        },

        // Social Media Actions
        setSocialMediaServices: (state, action) => {
            state.socialMedia.socialMediaServices = action.payload;
        },
        setSingleSocialMediaService: (state, action) => {
            const { id, value } = action.payload || {}
            if (typeof id === 'undefined') return
            state.socialMedia.socialMediaServices = {
                ...state.socialMedia.socialMediaServices,
                [id]: Boolean(value)
            }
        },

        // Video Calls Actions
        setVideoCallsServices: (state, action) => {
            state.videoCalls.videoCallsServices = action.payload;
        },
        setSingleVideoCallsService: (state, action) => {
            const { id, value } = action.payload || {}
            if (typeof id === 'undefined') return
            state.videoCalls.videoCallsServices = {
                ...state.videoCalls.videoCallsServices,
                [id]: Boolean(value)
            }
        },

        // Calendar Actions
        setCalendarServices: (state, action) => {
            state.calendar.calendarServices = action.payload;
        },
        setSingleCalendarService: (state, action) => {
            const { id, value } = action.payload || {}
            if (typeof id === 'undefined') return
            state.calendar.calendarServices = {
                ...state.calendar.calendarServices,
                [id]: Boolean(value)
            }
        },

        // Photo Actions
        setPhotoAccess: (state, action) => {
            state.photo.access = action.payload
        },

        // Location Actions
        setLocationAccess: (state, action) => {
            state.location.access = action.payload
        },
        setLocationCoordinates: (state, action) => {
            state.location.coordinates = action.payload
        },

        // Integration Status Actions
        updateIntegrationStatus: (state, action) => {
            state.status.isConfirmed = action.payload.status === 'confirmed'
            state.status.lastUpdated = action.payload.timestamp
            state.status.updatedBy = action.payload.updatedBy
        },
    }
})



export const {
    setMessageServices,
    setSingleMessageService,
    setEmailServices,
    setSingleEmailService,
    setSocialMediaServices,
    setSingleSocialMediaService,
    setVideoCallsServices,
    setSingleVideoCallsService,
    setCalendarServices,
    setSingleCalendarService,
    setPhotoAccess,
    setLocationAccess,
    setLocationCoordinates,
    updateIntegrationStatus
} = integrationSlice.actions;

export default integrationSlice.reducer;