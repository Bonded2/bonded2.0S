import React, { useState, useRef, useEffect } from 'react'
import styles from './scss/_chatmessage.module.scss'
import MessageBubble from './MessageBubble'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import logo from '/icons/icon-384x384.png'
import { getIdentity } from '../../../services/ii'
import { mockChatParticipants } from './MockData'
import { Principal } from '@dfinity/principal'
import { Session } from '../../../routes/SessionProvider'

const ChatMessage = ({ chatId = 'bonded', onBack }) => {
    const { userData, partnerData } = Session()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [myPrincipal, setMyPrincipal] = useState(null)
    const messagesEndRef = useRef(null)
    
    const participant = partnerData
        ? {
              id: chatId,
              name: partnerData.firstname || partnerData.email || 'Partner',
              image: partnerData?.profile || logo,
              status: 'online',
              typing: false,
          }
        : null

    // Convert principal object -> text
    const toPrincipalText = (principal) => {
        try {
            if (!principal?._arr) return 'unknown'
            return Principal.fromUint8Array(principal._arr).toText()
        } catch {
            return 'unknown'
        }
    }

    // Normalize message to frontend schema
    const normalizeMessage = (msg, currentPrincipal) => {
        const sender = toPrincipalText(msg.sender)
        const recipient = toPrincipalText(msg.recipient)

        return {
            id: typeof msg.id === 'bigint' ? msg.id.toString() : msg.id,
            chatId,
            text: msg.text,
            sender,
            recipient,
            timestamp: new Date(Number(msg.timestamp) / 1000000), // ns → ms
            type: sender === currentPrincipal ? 'sent' : 'received',
            status: msg.status
                ? Object.keys(msg.status)[0].toLowerCase()
                : 'unknown',
        }
    }

    // Load messages directly from backend
    useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const loadMessages = async () => {
        try {
            setError(null);

            const auth = await getIdentity();
            const { identity, authenticatedActor } = auth;
            const principalText = identity.getPrincipal().toText();
            setMyPrincipal(principalText);

            const response = await authenticatedActor.get_messages();
            if (response.Ok && Array.isArray(response.Ok)) {
                const normalized = response.Ok.map((m) =>
                    normalizeMessage(m, principalText)
                );
                if (isMounted) setMessages(normalized);
            }
        } catch (err) {
            console.error('Failed to load messages:', err);
            if (isMounted) setError('Failed to load messages');
        } finally {
            if (isMounted) {
                timeoutId = setTimeout(loadMessages, 5000); // schedule next
                setLoading(false);
            }
        }
    };

    setLoading(true);
    loadMessages();

    return () => {
        isMounted = false;
        clearTimeout(timeoutId);
    };
}, [chatId]);


    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Send new message
    const handleSendMessage = async (text) => {
        try {
            const auth = await getIdentity()
            const { identity, authenticatedActor } = auth
            const principalText = identity.getPrincipal().toText()

            const response = await authenticatedActor.send_message(text)
            console.log('Send response:', response)

            if (response.Ok) {
                const newMsg = normalizeMessage(response.Ok, principalText)
                setMessages((prev) => [...prev, newMsg])
            } else {
                throw new Error('Backend rejected message')
            }
        } catch (err) {
            console.error('Send failed:', err)
            setError('Failed to send message')
        }
    }

    if (!participant) {
        return (
            <div className={styles.chatContainer}>
                <div className={styles.errorMessage}>
                    <p>Chat not found</p>
                    <button onClick={onBack} className={styles.backToChats}>
                        Back to Chats
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.chatContainer}>
            <ChatHeader participant={participant} onBack={onBack} />

            <div className={styles.messagesContainer}>
                {loading && (
                    <div className={styles.loadingContainer}>
                        <p>Loading messages...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorContainer}>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className={styles.retryButton}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className={styles.messagesList}>
                        {messages.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    )
}

export default ChatMessage
