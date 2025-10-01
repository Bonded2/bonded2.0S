import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './scss/_bondPending.module.scss'
import Spinner from '@/loader/Spinner'
import { Session } from '../../../routes/SessionProvider'
import { getIdentity } from '../../../services/ii'

const BondPending = () => {
    const navigate = useNavigate()
    const { userData } = Session()
    const [isReloading, setIsReloading] = useState(null)

    useEffect(() => {
        if (!userData) return

        let intervalId

        const fetchUser = async () => {
            try {
                const auth = await getIdentity()
                const { authenticatedActor } = auth

                const result = await authenticatedActor.get_user()
                const updatedUserData = result.Ok

                const status = Object.keys(updatedUserData.status)[0]
                updatedUserData.status = status

                if (status === 'Complicated') {
                    navigate('/wizard/bond-confirmation', { replace: true })
                    clearInterval(intervalId)
                }
            } catch (err) {
                console.error('Failed to fetch user:', err)
            }
        }

        fetchUser()

        intervalId = setInterval(fetchUser, 5000)

        return () => clearInterval(intervalId)
    }, [navigate, userData])

    return (
        <div className={styles.bondPendingContainer}>
            <div className={styles.spinnerContainer}>
                <Spinner />
            </div>
            <div className={styles.header}>
                <p className={styles.title}>Waiting for your partner</p>
                <p className={styles.description}>
                    We’ve sent your invitation. Once your partner accepts, we’ll begin syncing your details and building your Relationship Passport.
                </p>

                {/* <button onClick={handleReload} disabled={isReloading}>{isReloading ? ('Checking') : ('Check')}</button> */}

            </div>

        </div>
    )
}

export default BondPending