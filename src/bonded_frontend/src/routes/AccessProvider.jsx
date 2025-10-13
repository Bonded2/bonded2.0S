import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Session } from './SessionProvider'
import PulseLoader from "@/loader/PulseLoader";

function AccessProvider({ children }) {

    const {
        loading,
        userIdentity,
        principalId,
        userData
    } = Session()

    const location = useLocation()

    const nullRoutes = [ '/onboard', '/login' ]
    const userRoutes = [ '/wizard', '/wizard/email', '/wizard/password', '/wizard/passport', '/wizard/profile-photo', 
                        '/wizard/nationalities', '/wizard/residencies', '/wizard/upload-file', '/wizard/complete-profile', '/wizard/kyc',
                        '/wizard/bond-invitation', '/wizard/bond-confirmation', '/wizard/bond-pending', '/wizard/partner-confirmation', '/wizard/partner-pending',
                        '/wizard/integration', '/wizard/integration-message', '/wizard/integration-email', '/wizard/integration-media', '/wizard/integration-video-calls',
                        '/wizard/integration-calendar', '/wizard/integration-photo', '/wizard/integration-location', '/wizard/integration-complete', '/wizard/integration-pending',
                        '/wizard/integration-confirmation', '/wizard/payment', '/wizard/payment-pending', '/wizard/payment-comfirmation', '/wizard/complete' ]
    const verifiedRoutes = [ '/dashboard', '/dashboard/timeline', '/dashboard/open-chat', '/dashboard/notification', '/dashboard/export',
                            '/dashboard/photo', '/dashboard/message', '/dashboard/direct-message-selection', '/dashboard/email', '/dashboard/media', '/dashboard/calendar', '/dashboard/video-calls', '/dashboard/photo-selection', '/dashboard/profile-information', '/dashboard/settings',
                            '/dashboard/document', '/dashboard/document-selection', '/dashboard/upload', '/dashboard/upload-confirmation', '/dashboard/chat-message', '/dashboard/chat-list', '/dashboard/search' ]

    if (loading) {
        return (
            <PulseLoader size={24} color="var(--secondary-color)" />
        )
    }

    if (!loading) {

        if (location.pathname === '/') {
            return <Navigate to='/onboard' replace />
        }

        if (!userIdentity && !principalId && !userData) {
            return nullRoutes.includes(location.pathname)
                ? children
                : <Navigate to='/login' />
        }

        if (userData && (userData.role === 'User' && (userData.status === 'Single' || userData.status === 'Complicated'))) {
            if (userRoutes.includes(location.pathname)) {
                return children
            } else {
                return children
            }
        }

        if (userData && (userData.role === 'User' && userData.status === 'Bonded ')) {
            if (verifiedRoutes.includes(location.pathname)) {
                return children
            } else {
                return children
            }
        }

    }

    if (nullRoutes.includes(location.pathname)) {
        return children
    }
    return children
}

export default AccessProvider