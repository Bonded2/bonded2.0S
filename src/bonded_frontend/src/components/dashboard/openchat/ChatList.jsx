import React, { useState, useEffect } from 'react'
import { ChatList as ReactChatList } from 'react-chat-elements'
import styles from './scss/_chatlist.module.scss'
import { Plus, Search } from 'lucide-react'
import { mockChatData } from './MockData'
import ChatItem from './ChatItem'
import { getChats, checkAndMigrateData, setCurrentUserId } from './indexDB/db'


export const ChatList = ({ onChatSelect, userData }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [chats, setChats] = useState([])
    const [filteredChats, setFilteredChats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadChats = async () => {
            try {
                setLoading(true)
                setError(null)

                if (userData) {
                    setCurrentUserId(userData)
                }

                await checkAndMigrateData()

                const allChats = await getChats()
                setChats(allChats)
                setFilteredChats(allChats)
            } catch (err) {
                console.error('Failed to load chats:', err)
                setError('Failed to load chats')
                setChats(mockChatData)
                setFilteredChats(mockChatData)
            } finally {
                setLoading(false)
            }
        }

        loadChats()
    }, [userData])

    // ANCHOR: Handle search functionality
    const handleSearch = (e) => {
        const searchValue = e.target.value
        setSearchTerm(searchValue)

        if (searchValue.trim() === '') {
            setFilteredChats(chats)
        } else {
            const filtered = chats.filter(chat =>
                chat.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                chat.subtitle.toLowerCase().includes(searchValue.toLowerCase())
            )
            setFilteredChats(filtered)
        }
    }

    // ANCHOR: Handle chat item click
    const handleChatClick = (chatItem) => {
        console.log('Chat clicked:', chatItem)
        if (onChatSelect) {
            onChatSelect(chatItem.id)
        }
    }

    // ANCHOR: Handle new chat button click
    const handleNewChat = async () => {
        console.log('New chat clicked')
        // TODO: Implement new chat creation
        // This could open a modal or navigate to a new chat creation page
    }

    // ANCHOR: Refresh chats function
    const refreshChats = async () => {
        try {
            const allChats = await getChats()
            setChats(allChats)
            setFilteredChats(allChats)
        } catch (err) {
            console.error('Failed to refresh chats:', err)
            setError('Failed to refresh chats')
        }
    }

    return (
        <div className={styles.chatListContainer}>
            {/* ANCHOR: Header with title and new chat button */}
            <div className={styles.chatListHeader}>
                <h2 className={styles.chatListTitle}>Recent chats</h2>
                <button
                    className={styles.newChatButton}
                    onClick={handleNewChat}
                    aria-label="Start new chat"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* ANCHOR: Search bar */}
            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={16} />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>

            {/* ANCHOR: Loading and error states */}
            {loading && (
                <div className={styles.loadingContainer}>
                    <p>Loading chats...</p>
                </div>
            )}

            {error && (
                <div className={styles.errorContainer}>
                    <p>{error}</p>
                    <button onClick={refreshChats} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            )}

            {/* ANCHOR: Chat list */}
            {!loading && !error && (
                <div className={styles.chatListWrapper}>
                    {filteredChats.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No chats found</p>
                            <button onClick={handleNewChat} className={styles.startChatButton}>
                                Start a new chat
                            </button>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                onClick={() => handleChatClick(chat)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
