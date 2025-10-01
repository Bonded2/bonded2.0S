import React, { useState, useEffect } from 'react'
import { authWithII } from '../../services/ii'
import { authWithNNS, getIdentity, signoutII } from '../../services/nns'
import { authWithNFID } from '../../services/nfid'
import { useNavigate } from 'react-router-dom'

function LoginFunctions() {
    const [loading, setLoading] = useState(true)
    const [userIdentity, setUserIdentity] = useState(null)
    const [authenticatedActor, setAuthenticatedActor] = useState(null)
    const [principalId, setPrincipalId] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isSigningInII, setIsSigningInII] = useState(false)
    const [signInIIError, setSignInIIError] = useState(null)
    const [isSigningInNNS, setIsSigningInNNS] = useState(false)
    const [signInNNSError, setSignInNNSError] = useState(null)
    const [isSigningInNFID, setIsSigningInNFID] = useState(false)
    const [signInNFIDError, setSignInNFIDError] = useState(null)
    const [signInError, setSignInError] = useState(null)

    const navigate = useNavigate()

    const handleLoginII = async () => {
        setIsSigningInII(true)
        setSignInIIError(null)
        
        try {
            const { identity: userIdentity, authenticatedActor } = await authWithII()
            const principalId = userIdentity.getPrincipal()
            const provider = "II Provider"
            
            const mailer = localStorage.getItem('bonded-invitation-mail')
            const inviter = mailer ? [mailer] : []
            
            const result = await authenticatedActor.create_user(provider, inviter)

             if (result.Err) {
                console.log(result.Err)
                setSignInError(result.Err)
                localStorage.removeItem('bonded-invitation-mail')
            } else if (result.Ok) {
                const userData = result.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                localStorage.removeItem('bonded-invitation-mail')
                window.location.reload()
                
            } else {
                const existing = await authenticatedActor.get_user()

                const userData = existing.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                localStorage.removeItem('bonded-invitation-mail')
                window.location.reload()
            }

        } catch (error) {
            setSignInNNSError('Authentication Error. Please try again later.')
        } finally {
            setTimeout(() => {
                setIsSigningInII(false)
            }, 120)
        }
    }

    const handleLoginNNS = async () => {
        setIsSigningInNNS(true)
        setSignInNNSError(null)
        
        try {
            const { identity: userIdentity, authenticatedActor } = await authWithNNS()
            const principalId = userIdentity.getPrincipal()
            const provider = "NNS Provider"
            
            const mailer = localStorage.getItem('bonded-invitation-mail')
            const inviter = mailer ? [mailer] : []
            
            const result = await authenticatedActor.create_user(provider, inviter)

            if (result.Err) {
                console.log(result.Err)
                setSignInError(result.Err)
                localStorage.removeItem('bonded-invitation-mail')
            } else if (result.Ok) {
                const userData = result.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                localStorage.removeItem('bonded-invitation-mail')
                window.location.reload()
                
            } else {
                const existing = await authenticatedActor.get_user()

                const userData = existing.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                localStorage.removeItem('bonded-invitation-mail')
                window.location.reload()
            }

        } catch (error) {
            setSignInNNSError('Authentication Error. Please try again later.')
        } finally {
            setTimeout(() => {
                setIsSigningInNNS(false)
            }, 120)
        }
    }

    const handleLoginNFID = async () => {
        setIsSigningInNFID(true)
        
        try {
            const { identity: userIdentity, authenticatedActor } = await authWithNFID()
            const principalId = userIdentity.getPrincipal()
            const provider = "NFID Provider"

            const mailer = localStorage.getItem('bonded-invitation-mail')
            const inviter = mailer ? [mailer] : []
            
            const result = await authenticatedActor.create_user(provider, inviter)

             if (result.Err) {
                console.log(result.Err)
                setSignInError(result.Err)
                localStorage.removeItem('bonded-invitation-mail')
            } else if (result.Ok) {
                const userData = result.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                localStorage.removeItem('bonded-invitation-mail')
                window.location.reload()
                
            } else {
                const existing = await authenticatedActor.get_user()

                const userData = existing.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                localStorage.removeItem('bonded-invitation-mail')
                window.location.reload()
            }

        } catch (error) {
            setSignInNFIDError('Authentication Error. Please try again later.')
        } finally {
            setTimeout(() => {
                setIsSigningInNFID(false)
            }, 120)
        }
    }

    return {
        loading,
        setLoading,
        userIdentity,
        setUserIdentity,
        authenticatedActor,
        principalId,
        userData,
        handleLoginII,
        isSigningInII,
        setSignInIIError,
        handleLoginNNS,
        handleLoginNFID,
        isSigningInNNS,
        signInNNSError,
        isSigningInNFID,
        signInError
    }
}

export default LoginFunctions