import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Mail, Users, Video, Calendar, Image, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
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
    setLocationCoordinates
} from '@/store/slices/integrationSlice'

// ANCHOR: Promise-based geolocation wrapper
function getPosition(opts) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, opts)
    })
}

export const SettingIntegrationFunction = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const integration = useAppSelector((state) => state.integration)

    // ANCHOR: State management
    const [expandedItem, setExpandedItem] = useState(null)
    const [photoAccess, setPhotoAccessState] = useState(false)
    const [locationAccess, setLocationAccessState] = useState(false)
    const [locationStatus, setLocationStatus] = useState('')
    const fileInputRef = useRef(null)

    // ANCHOR: Integration items configuration with content types
    const integrationItems = [
        {
            id: 'direct-messaging',
            text: 'Direct messaging',
            variant: 'default',
            icon: <MessageCircle />,
            contentType: 'toggleList',
            reduxKey: 'directMessage',
            description: 'Choose which direct messaging services to connect with Bonded. Stamps are created only when it\'s clear the message relates to your relationship.'
        },
        {
            id: 'emails',
            text: 'Emails',
            variant: 'default',
            icon: <Mail />,
            contentType: 'toggleList',
            reduxKey: 'email',
            description: 'Pick the email platforms to connect with Bonded. Stamps are created only from emails clearly related to your relationship.'
        },
        {
            id: 'social-media',
            text: 'Social media',
            variant: 'default',
            icon: <Users />,
            contentType: 'toggleList',
            reduxKey: 'socialMedia',
            description: 'Pick the social media platforms to connect with Bonded. Stamps are created only when posts, photos or interactions clearly include both you and your partner.'
        },
        {
            id: 'video-calls',
            text: 'Video calls',
            variant: 'default',
            icon: <Video />,
            contentType: 'toggleList',
            reduxKey: 'videoCalls',
            description: 'Choose the video call platforms to connect with Bonded. Stamps are created only from calls between you and your partner.'
        },
        {
            id: 'calendar',
            text: 'Calendar',
            variant: 'default',
            icon: <Calendar />,
            contentType: 'toggleList',
            reduxKey: 'calendar',
            description: 'Select the calendars to connect with Bonded. Stamps are created only from events that involve both you and your partner.'
        },
        {
            id: 'photo-library',
            text: 'Photo library',
            variant: 'default',
            icon: <Image />,
            contentType: 'checkbox',
            reduxKey: 'photo',
            description: 'Connect your photo library to Bonded. Stamps are created only when photos clearly include both you and your partner. All other photos are ignored.'
        },
        {
            id: 'geolocation',
            text: 'Geolocation',
            variant: 'default',
            icon: <MapPin />,
            contentType: 'checkbox',
            reduxKey: 'location',
            description: 'Enable location sharing with Bonded. We use your location to verify time spent together with your partner. Your location is used only while the app is open.'
        }
    ]

    // ANCHOR: Load saved states on mount
    useEffect(() => {
        // Load photo access
        if (integration.photo.access === 'Full access') {
            setPhotoAccessState(true)
        }

        // Load location access
        if (integration.location.access === 'Full access') {
            setLocationAccessState(true)
        }
    }, [integration.photo.access, integration.location.access])

    // ANCHOR: Load saved integration states from localStorage on mount
    useEffect(() => {
        // Load message services
        try {
            const savedMessages = localStorage.getItem('integration.messageServices')
            if (savedMessages) {
                const parsed = JSON.parse(savedMessages)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setMessageServices(parsed))
                }
            }
        } catch (e) {
            console.error('Error loading saved message services:', e)
        }

        // Load email services
        try {
            const savedEmails = localStorage.getItem('integration.emailServices')
            if (savedEmails) {
                const parsed = JSON.parse(savedEmails)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setEmailServices(parsed))
                }
            }
        } catch (e) {
            console.error('Error loading saved email services:', e)
        }

        // Load social media services
        try {
            const savedSocialMedia = localStorage.getItem('integration.socialMediaServices')
            if (savedSocialMedia) {
                const parsed = JSON.parse(savedSocialMedia)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setSocialMediaServices(parsed))
                }
            }
        } catch (e) {
            console.error('Error loading saved social media services:', e)
        }

        // Load video calls services
        try {
            const savedVideoCalls = localStorage.getItem('integration.videoCallsServices')
            if (savedVideoCalls) {
                const parsed = JSON.parse(savedVideoCalls)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setVideoCallsServices(parsed))
                }
            }
        } catch (e) {
            console.error('Error loading saved video calls services:', e)
        }

        // Load calendar services
        try {
            const savedCalendar = localStorage.getItem('integration.calendarServices')
            if (savedCalendar) {
                const parsed = JSON.parse(savedCalendar)
                if (parsed && typeof parsed === 'object') {
                    dispatch(setCalendarServices(parsed))
                }
            }
        } catch (e) {
            console.error('Error loading saved calendar services:', e)
        }

        // Load photo access
        try {
            const savedPhoto = localStorage.getItem('integration.photoAccess')
            if (savedPhoto && savedPhoto === 'Full access') {
                dispatch(setPhotoAccess(savedPhoto))
                setPhotoAccessState(true)
            }
        } catch (e) {
            console.error('Error loading saved photo access:', e)
        }

        // Load location access
        try {
            const savedLocation = localStorage.getItem('integration.locationAccess')
            if (savedLocation && savedLocation === 'Full access') {
                dispatch(setLocationAccess(savedLocation))
                setLocationAccessState(true)
            }
        } catch (e) {
            console.error('Error loading saved location access:', e)
        }
    }, [dispatch])

    // ANCHOR: Toggle accordion item
    const handleToggleExpand = (itemId) => {
        setExpandedItem(prev => prev === itemId ? null : itemId)
    }

    // ANCHOR: Handle ToggleSwitchList changes for different integration types
    const handleToggleChange = (reduxKey, values, meta) => {
        switch (reduxKey) {
            case 'directMessage':
                if (meta && typeof meta.id !== 'undefined') {
                    dispatch(setSingleMessageService({ id: meta.id, value: values[meta.id] }))
                } else {
                    dispatch(setMessageServices(values))
                }
                break
            case 'email':
                if (meta && typeof meta.id !== 'undefined') {
                    dispatch(setSingleEmailService({ id: meta.id, value: values[meta.id] }))
                } else {
                    dispatch(setEmailServices(values))
                }
                break
            case 'socialMedia':
                if (meta && typeof meta.id !== 'undefined') {
                    dispatch(setSingleSocialMediaService({ id: meta.id, value: values[meta.id] }))
                } else {
                    dispatch(setSocialMediaServices(values))
                }
                break
            case 'videoCalls':
                if (meta && typeof meta.id !== 'undefined') {
                    dispatch(setSingleVideoCallsService({ id: meta.id, value: values[meta.id] }))
                } else {
                    dispatch(setVideoCallsServices(values))
                }
                break
            case 'calendar':
                if (meta && typeof meta.id !== 'undefined') {
                    dispatch(setSingleCalendarService({ id: meta.id, value: values[meta.id] }))
                } else {
                    dispatch(setCalendarServices(values))
                }
                break
        }
    }

    // ANCHOR: Handle photo access checkbox
    const handlePhotoAccessChange = (e) => {
        const isChecked = e.target.checked

        if (isChecked) {
            fileInputRef.current?.click()
        } else {
            setPhotoAccessState(false)
            dispatch(setPhotoAccess(''))
        }
    }

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files)
        if (files.length > 0) {
            setPhotoAccessState(true)
            dispatch(setPhotoAccess('Full access'))
        } else {
            setPhotoAccessState(false)
            dispatch(setPhotoAccess(''))
        }
    }

    // ANCHOR: Handle location access checkbox
    const handleLocationAccessChange = async (e) => {
        const isChecked = e.target.checked

        if (isChecked) {
            await requestLocationPermission()
        } else {
            setLocationAccessState(false)
            dispatch(setLocationAccess(''))
            setLocationStatus('')
        }
    }

    const requestLocationPermission = async () => {
        if (!('geolocation' in navigator)) {
            setLocationStatus('Geolocation not supported')
            return
        }

        try {
            setLocationStatus('Requesting location…')
            const pos = await getPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            })

            const { latitude, longitude, accuracy } = pos.coords
            const coordinates = { lat: latitude, lng: longitude, accuracy, ts: pos.timestamp }

            dispatch(setLocationCoordinates(coordinates))
            dispatch(setLocationAccess('Full access'))
            setLocationAccessState(true)
            setLocationStatus('Location enabled')
        } catch (err) {
            setLocationAccessState(false)
            if (err?.code === 1) {
                setLocationStatus('Permission denied')
            } else {
                setLocationStatus('Location request failed')
            }
        }
    }

    // ANCHOR: Render accordion content based on integration type
    const renderAccordionContent = (item) => {
        if (item.contentType === 'toggleList') {
            const reduxData = integration[item.reduxKey]
            let items = []
            let values = {}
            let disabledIds = []

            // Map Redux data to ToggleSwitchList format
            switch (item.reduxKey) {
                case 'directMessage':
                    items = reduxData.chatPlatform.map(p => ({ id: p.code, label: p.name }))
                    const enabledIds = ['openchat', 'telegram']
                    const enabledSet = new Set(enabledIds)
                    values = Object.fromEntries(
                        items.map(it => [it.id, enabledSet.has(String(it.id).toLowerCase()) ? Boolean(reduxData.messageServices[it.id]) : false])
                    )
                    disabledIds = items.map(i => i.id).filter(id => !enabledSet.has(String(id).toLowerCase()))
                    break
                case 'email':
                    items = reduxData.emailChatPlatform.map(p => ({ id: p.code, label: p.name }))
                    values = Object.fromEntries(items.map(it => [it.id, false]))
                    disabledIds = items.map(i => i.id)
                    break
                case 'socialMedia':
                    items = reduxData.socialMediaChatPlatform.map(p => ({ id: p.code, label: p.name }))
                    values = Object.fromEntries(items.map(it => [it.id, false]))
                    disabledIds = items.map(i => i.id)
                    break
                case 'videoCalls':
                    items = reduxData.videoCallsChatPlatform.map(p => ({ id: p.code, label: p.name }))
                    values = Object.fromEntries(items.map(it => [it.id, false]))
                    disabledIds = items.map(i => i.id)
                    break
                case 'calendar':
                    items = reduxData.calendarChatPlatform.map(p => ({ id: p.code, label: p.name }))
                    values = Object.fromEntries(items.map(it => [it.id, false]))
                    disabledIds = items.map(i => i.id)
                    break
            }

            return {
                type: 'toggleList',
                props: {
                    description: item.description,
                    items,
                    values,
                    disabledIds,
                    onChange: (nextValues, meta) => handleToggleChange(item.reduxKey, nextValues, meta)
                }
            }
        } else if (item.contentType === 'checkbox') {
            if (item.id === 'photo-library') {
                return {
                    type: 'photoCheckbox',
                    props: {
                        description: item.description,
                        checked: photoAccess,
                        onChange: handlePhotoAccessChange,
                        fileInputRef,
                        onFileSelect: handleFileSelect
                    }
                }
            } else if (item.id === 'geolocation') {
                return {
                    type: 'locationCheckbox',
                    props: {
                        description: item.description,
                        checked: locationAccess,
                        onChange: handleLocationAccessChange,
                        status: locationStatus
                    }
                }
            }
        }
    }

    // ANCHOR: Save integration states to localStorage when Redux state changes
    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.messageServices',
                JSON.stringify(integration.directMessage.messageServices || {})
            )
        } catch (e) {
            console.error('Error saving message services:', e)
        }
    }, [integration.directMessage.messageServices])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.emailServices',
                JSON.stringify(integration.email.emailServices || {})
            )
        } catch (e) {
            console.error('Error saving email services:', e)
        }
    }, [integration.email.emailServices])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.socialMediaServices',
                JSON.stringify(integration.socialMedia.socialMediaServices || {})
            )
        } catch (e) {
            console.error('Error saving social media services:', e)
        }
    }, [integration.socialMedia.socialMediaServices])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.videoCallsServices',
                JSON.stringify(integration.videoCalls.videoCallsServices || {})
            )
        } catch (e) {
            console.error('Error saving video calls services:', e)
        }
    }, [integration.videoCalls.videoCallsServices])

    useEffect(() => {
        try {
            localStorage.setItem(
                'integration.calendarServices',
                JSON.stringify(integration.calendar.calendarServices || {})
            )
        } catch (e) {
            console.error('Error saving calendar services:', e)
        }
    }, [integration.calendar.calendarServices])

    useEffect(() => {
        try {
            localStorage.setItem('integration.photoAccess', integration.photo.access || '')
        } catch (e) {
            console.error('Error saving photo access:', e)
        }
    }, [integration.photo.access])

    useEffect(() => {
        try {
            localStorage.setItem('integration.locationAccess', integration.location.access || '')
        } catch (e) {
            console.error('Error saving location access:', e)
        }
    }, [integration.location.access])

    const handleSaveChanges = () => {
        console.log('Saving integration changes...')
        navigate('/dashboard/setting-confirmation')
    }

    return {
        integrationItems,
        expandedItem,
        photoAccess,
        locationAccess,
        locationStatus,
        fileInputRef,
        handleToggleExpand,
        handleToggleChange,
        handlePhotoAccessChange,
        handleFileSelect,
        handleLocationAccessChange,
        requestLocationPermission,
        renderAccordionContent,
        handleSaveChanges
    }
}