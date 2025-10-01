import React from 'react'
import styles from './scss/_chatmessage.module.scss'
import { CheckCheck } from 'lucide-react'

const MessageBubble = ({ message }) => {
    const formatTime = (date) => {
        const dateObj = date instanceof Date ? date : new Date(date)
        return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className={`${styles.messageBubble} ${styles[message.type]}`}>
            <div className={styles.messageContent}>
                <p className={styles.messageText}>{message.text}</p>
                <div className={styles.messageFooter}>
                    <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                    {message.type === 'sent' && (
                        <div className={styles.messageStatus}>
                            <CheckCheck size={12} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble