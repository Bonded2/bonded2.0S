import React, { useState, useEffect } from 'react'
import { authWithII, getIdentity, signoutII } from '../../services/nns'
import { authWithNFID } from '../../services/nfid'
import { useNavigate } from 'react-router-dom'

function LoginFunctions() {
    const [loading, setLoading] = useState(true)
    const [userIdentity, setUserIdentity] = useState(null)
    const [authenticatedActor, setAuthenticatedActor] = useState(null)
    const [principalId, setPrincipalId] = useState(null)
    const [userData, setUserData] = useState(null)
    const [isSigningInNNS, setIsSigningInNNS] = useState(false)
    const [signInNNSError, setSignInNNSError] = useState(null)
    const [isSigningInNFID, setIsSigningInNFID] = useState(false)
    const [signInNFIDError, setSignInNFIDError] = useState(null)
    const [signInError, setSignInError] = useState(null)

    const navigate = useNavigate()

    const handleLoginNNS = async () => {
        setIsSigningInNNS(true)
        setSignInNNSError(null)
        
        try {
            const { identity: userIdentity, authenticatedActor } = await authWithII()
            const principalId = userIdentity.getPrincipal()
            const provider = "NNS Provider"
            
            const mailer = localStorage.getItem('bonded-invitation-mail')
            const inviter = mailer ? [mailer] : []
            
            const result = await authenticatedActor.create_user(provider, inviter)

            if (result.Err) {
                console.log(result.Err)
                setSignInError(result.Err)
            } else if (result.Ok) {
                const userData = result.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                window.location.reload()
                
            } else {
                const existing = await authenticatedActor.get_user()

                const userData = existing.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
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
            } else if (result.Ok) {
                const userData = result.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
                window.location.reload()
                
            } else {
                const existing = await authenticatedActor.get_user()

                const userData = existing.Ok
                setUserIdentity(userIdentity)
                setAuthenticatedActor(authenticatedActor)
                setPrincipalId(principalId)
                setUserData(userData)
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
        handleLoginNNS,
        handleLoginNFID,
        isSigningInNNS,
        signInNNSError,
        isSigningInNFID,
        signInError
    }
}

export default LoginFunctions