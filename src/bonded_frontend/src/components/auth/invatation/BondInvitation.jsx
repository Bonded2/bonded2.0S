import React, { useState } from 'react'
import styles from './scss/_bondInvitation.module.scss'
import Input from '@/reusable/Input'
import Button from '@/reusable/Button'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Session } from '../../../routes/SessionProvider'

const BondInvitation = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { userData } = Session()

    const sendInvitation = async () => {
        setLoading(true)
        setError(null)

        const inviterName = userData?.username || userData?.email

        try {
            const res = await fetch(
                'https://mfrrezpifikqmuraxevz.supabase.co/functions/v1/hyper-function',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        inviterName,
                        recipients: email,
                        inviteLink: `${window.location.origin}/onboard?from=${encodeURIComponent(inviterName)}`
                    })
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send invitation')

            navigate('/wizard/bond-pending')
        } catch (err) {
            console.log(userData.username)
            setError(err.message || 'Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.bondInvitationContainer}>
            <div className={styles.header}>
                <p className={styles.title}>Invite your partner</p>
                <p className={styles.description}>
                    We’ve sent your invitation. Once your partner accepts, we’ll begin building your Relationship Passport.
                </p>
            </div>

            <div className={styles.bondInvitationContent}>
                <Input
                    label='Email'
                    type='email'
                    id='email'
                    placeholder='Enter partner email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className={styles.bondInvitationButton}>
                <Button
                    variant='primary'
                    onClick={sendInvitation}
                    disabled={loading || !email}
                >
                    {loading ? 'Sending...' : 'Send invitation'}
                </Button>
                <Button
                    variant='secondary'
                    onClick={() => navigate('/wizard/kyc')}
                >
                    <ArrowLeft />
                    Back
                </Button>
            </div>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}

export default BondInvitation
