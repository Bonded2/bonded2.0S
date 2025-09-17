import React from 'react'
import Breadcrumb from '@/reusable/Breadcrumb'
import styles from './scss/_directMessage.module.scss'
import DateRange from '@/reusable/DateRange'
import Button from '@/reusable/Button';
import PulseLoader from '@/loader/PulseLoader'
import useDirectMessage from './DirectMessageFunction'
import { useNavigate } from 'react-router-dom'

const DirectMessage = () => {
    const {
        directMessages,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        visibleCount,
        setVisibleCount,
        isLoading,
        setIsLoading,
        onChangeFrom,
        onChangeTo
    } = useDirectMessage()
    const navigate = useNavigate()

    const breadcrumbItems = [
        { label: 'Dashboard', to: '/dashboard' },
    ]


    return (
        <div className={styles.breadcrumbItems}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <p className={styles.headerTitle}>Direct Messages</p>
            </div>


            {/* Date from and to */}
            <DateRange
                fromLabel="Date from"
                toLabel="Date to"
                from={dateFrom}
                to={dateTo}
                onChangeFrom={onChangeFrom}
                onChangeTo={onChangeTo}
                className={styles.dateContainer}
            />

            <div className={styles.directMessageContainer}>
                {directMessages.slice(0, visibleCount).map((directMessage) => (
                    <div
                        key={directMessage.id}
                        className={styles.directMessageItem}
                        role="button"
                        onClick={() => {
                            const date = new Date(directMessage.date)
                            navigate('/dashboard/direct-message-selection', {
                                state: {
                                    iconType: directMessage.title.includes('Whatsapp') ? 'whatsapp' : 'facebook',
                                    title: directMessage.title,
                                    dateISO: date.toISOString(),
                                    displayDate: date.toLocaleDateString('en-GB'),
                                    message: directMessage.message,
                                    platform: directMessage.title.includes('Whatsapp') ? 'WhatsApp' : 'Facebook',
                                    messageId: directMessage.id
                                }
                            })
                        }}
                    >
                        <div className={styles.directMessageIcon}>{directMessage.icon}</div>
                        <div className={styles.directMessageTitle}>{directMessage.title}</div>
                        <div className={styles.directMessageDate}>{directMessage.date}</div>
                        <div className={styles.directMessageMessage}>{directMessage.message}</div>
                    </div>
                ))}
            </div>

            {visibleCount < directMessages.length && (
                <div className={styles.loadMoreButton}>
                    {isLoading ? (
                        <PulseLoader size={14} color="var(--front-color-600)" />
                    ) : (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                                setIsLoading(true)
                                setTimeout(() => {
                                    setVisibleCount((prev) => Math.min(prev + 4, directMessages.length))
                                    setIsLoading(false)
                                }, 1000)
                            }}
                        >
                            Load more
                        </Button>
                    )}
                </div>
            )}

        </div>
    )
}

export default DirectMessage
