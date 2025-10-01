import React from 'react'
import styles from './scss/_openchat.module.scss'
import { Session } from '../../../routes/SessionProvider'
import logo from '/icons/icon-384x384.png'

const ChatItem = ({ chat, onClick }) => {
    const { userData, partnerData } = Session()
    const formatTime = (date) => {
        const dateObj = date instanceof Date ? date : new Date(date)
        const now = new Date()
        const diffInHours = (now - dateObj) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (diffInHours < 48) {
            return 'Yesterday'
        } else {
            return dateObj.toLocaleDateString()
        }
    }

    return (
        <div className={styles.chatItem} onClick={onClick}>
            <div className={styles.avatarContainer}>
                <img
                    src={partnerData?.profile || logo}
                    alt='Partner'
                    className={styles.avatar}
                />
                {chat.status && (
                    <div className={`${styles.statusIndicator} ${styles[chat.status]}`} />
                )}
            </div>

            <div className={styles.chatContent}>
                <div className={styles.chatHeader}>
                    <h3 className={styles.chatTitle}>{partnerData?.firstname || partnerData?.username || partnerData?.email}</h3>
                    <span className={styles.chatTime}>{formatTime(chat.date)}</span>
                </div>

                <div className={styles.chatFooter}>
                    <p className={styles.chatSubtitle}>{chat.subtitle}</p>
                    {chat.unread > 0 && (
                        <div className={styles.unreadBadge}>
                            {chat.unread}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatItem
