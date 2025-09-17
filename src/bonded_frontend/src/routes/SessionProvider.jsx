import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getIdentity, signoutII } from '../services/nns'

const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [userIdentity, setUserIdentity] = useState(null)
    const [authenticatedActor, setAuthenticatedActor] = useState(null)
    const [principalId, setPrincipalId] = useState(null)
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const nullRoutes = [ '/onboard', '/login' ]
    const userRoutes = [ '/wizard', '/wizard/email', '/wizard/password', '/wizard/passport', '/wizard/profile-photo', 
                        '/wizard/nationalities', '/wizard/residencies', '/wizard/upload-file', '/wizard/complete-profile', '/wizard/kyc',
                        '/wizard/bond-invitation', '/wizard/bond-confirmation', '/wizard/bond-pending', '/wizard/partner-confirmation', '/wizard/partner-pending',
                        '/wizard/integration', '/wizard/integration-message', '/wizard/integration-email', '/wizard/integration-media', '/wizard/integration-video-calls',
                        '/wizard/integration-calendar', '/wizard/integration-photo', '/wizard/integration-location', '/wizard/integration-complete', '/wizard/integration-pending',
                        '/wizard/integration-confirmation', '/wizard/payment', '/wizard/payment-pending', '/wizard/payment-comfirmation', '/wizard/complete' ]
    const verifiedRoutes = [ '/dashboard', '/dashboard/timeline', '/dashboard/open-chat', '/dashboard/notification', '/dashboard/export',
                            '/dashboard/photo', '/dashboard/message', '/dashboard/email', '/dashboard/media', '/dashboard/calendar', '/dashboard/video-calls', '/dashboard/photo-selection' ]

    useEffect(() => {
        
        const checkSession = async () => {

            const params = new URLSearchParams(location.search)
            const emailParam = params.get('from')
            if (emailParam) {
                try {
                    const decodedEmail = decodeURIComponent(emailParam)
                    localStorage.setItem('bonded-invitation-mail', decodedEmail)
                } catch (err) {
                    console.error('Failed to decode email param', err)
                }
            }

            try {
                setLoading(true)

                const auth = await getIdentity()

                if (!auth) {
                    if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                        await signoutII()
                        navigate(nullRoutes)
                    }
                    return
                }

                if (auth) {
                    const { identity: userIdentity, authenticatedActor } = auth
                    const principalId = userIdentity.getPrincipal()

                    if (!authenticatedActor) {
                        if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                            await signoutII()
                            navigate(nullRoutes)
                        }
                        return
                    }
                    
                    setAuthenticatedActor(authenticatedActor)

                    const result = await authenticatedActor.get_user()

                    if (!result) {
                        if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                            await signoutII()
                            navigate(nullRoutes)
                        }
                        return
                    }

                    if (result.Ok) {

                        setUserIdentity(userIdentity)
                        setPrincipalId(principalId)

                        if (!principalId) {
                            if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                                await signoutII()
                                navigate(nullRoutes)
                            }
                            return
                        }

                        const userData = result.Ok
                        setUserData(userData)

                        if (!userData) {
                            if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                                await signoutII()
                                navigate(nullRoutes)
                            }
                            return
                        }

                        console.log(userData)

                        const role = Object.keys(userData.role)[0]
                        const status = Object.keys(userData.status)[0]

                        userData.role = role
                        userData.status = status
                        
                        if (role === 'User' && status === 'Single') {
                            if (userRoutes.includes(location.pathname)) {
                                navigate(userRoutes)
                            } else {
                                navigate('/wizard')
                            }
                        } else if (role === 'User' && status === 'Bonded') {
                            if (verifiedRoutes.includes(location.pathname)) {
                                navigate(verifiedRoutes)
                            } else {
                                navigate('/dashboard')
                            }
                        } else {
                            if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                                await signoutII()
                                navigate(nullRoutes)
                            }
                        }
                        
                    }
                }
                
            } catch (error) {
                console.log(error)
                if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/onboard') {
                    await signoutII()
                    navigate(nullRoutes)
                }
            } finally {
                setTimeout(() => 
                    setLoading(false), 120
                )
            }
            
        }
        checkSession()

    }, [])

return (
    <SessionContext.Provider value={{ loading, userIdentity, principalId, authenticatedActor, userData, setUserData, navigate, location }} >
        {children}
    </SessionContext.Provider>
  
    )
}

export const Session = () => {
    return useContext(SessionContext)
}