const DB_NAME = 'bonded-chat-db'
const DB_VERSION = 1

const ensureDate = (date) => {
    return date instanceof Date ? date : new Date(date)
}

// ANCHOR: Database connection and setup
export const openChatDB = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = event.target.result

            // ANCHOR: Create chats object store
            if (!db.objectStoreNames.contains('chats')) {
                const chatsStore = db.createObjectStore('chats', { keyPath: 'id' })
                chatsStore.createIndex('userId', 'userId', { unique: false })
                chatsStore.createIndex('createdAt', 'createdAt', { unique: false })
            }

            // ANCHOR: Create messages object store
            if (!db.objectStoreNames.contains('messages')) {
                const messagesStore = db.createObjectStore('messages', { keyPath: 'id' })
                messagesStore.createIndex('chatId', 'chatId', { unique: false })
                messagesStore.createIndex('userId', 'userId', { unique: false })
                messagesStore.createIndex('timestamp', 'timestamp', { unique: false })
            }

            // ANCHOR: Create user sessions object store
            if (!db.objectStoreNames.contains('userSessions')) {
                const sessionsStore = db.createObjectStore('userSessions', { keyPath: 'principalId' })
                sessionsStore.createIndex('username', 'username', { unique: false })
                sessionsStore.createIndex('lastActive', 'lastActive', { unique: false })
            }
        }
    })
}

// ANCHOR: Get current user ID from session storage or context
export const getCurrentUserId = () => {
    // NOTE: This integrates with the existing SessionProvider system
    // The userData is passed down from SessionProvider through component props
    const sessionData = localStorage.getItem('bonded-user-session')
    if (sessionData) {
        try {
            const user = JSON.parse(sessionData)
            return user.principal_id || user.principalId || 'anonymous'
        } catch (error) {
            console.warn('Failed to parse user session:', error)
        }
    }
    return 'anonymous'
}

// ANCHOR: Set current user ID in session storage
export const setCurrentUserId = (userData) => {
    try {
        localStorage.setItem('bonded-user-session', JSON.stringify(userData))
    } catch (error) {
        console.error('Failed to save user session:', error)
    }
}

// ANCHOR: Chat operations
export const getChats = async (userId = null) => {
    const db = await openChatDB()
    const transaction = db.transaction(['chats'], 'readonly')
    const store = transaction.objectStore('chats')

    if (userId) {
        const index = store.index('userId')
        return new Promise((resolve, reject) => {
            const request = index.getAll(userId)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    } else {
        return new Promise((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }
}

export const addChat = async (chatData) => {
    const db = await openChatDB()
    const transaction = db.transaction(['chats'], 'readwrite')
    const store = transaction.objectStore('chats')

    const chatWithUserId = {
        ...chatData,
        userId: getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    return new Promise((resolve, reject) => {
        const request = store.add(chatWithUserId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export const updateChat = async (chatId, updates) => {
    const db = await openChatDB()
    const transaction = db.transaction(['chats'], 'readwrite')
    const store = transaction.objectStore('chats')

    return new Promise((resolve, reject) => {
        const getRequest = store.get(chatId)
        getRequest.onsuccess = () => {
            const chat = getRequest.result
            if (chat) {
                const updatedChat = {
                    ...chat,
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
                const putRequest = store.put(updatedChat)
                putRequest.onsuccess = () => resolve(putRequest.result)
                putRequest.onerror = () => reject(putRequest.error)
            } else {
                reject(new Error('Chat not found'))
            }
        }
        getRequest.onerror = () => reject(getRequest.error)
    })
}

export const deleteChat = async (chatId) => {
    const db = await openChatDB()
    const transaction = db.transaction(['chats'], 'readwrite')
    const store = transaction.objectStore('chats')

    return new Promise((resolve, reject) => {
        const request = store.delete(chatId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

// ANCHOR: Message operations
export const getMessagesByChatId = async (chatId, userId = null) => {
    const db = await openChatDB()
    const transaction = db.transaction(['messages'], 'readonly')
    const store = transaction.objectStore('messages')
    const index = store.index('chatId')

    return new Promise((resolve, reject) => {
        const request = index.getAll(chatId)
        request.onsuccess = () => {
            let messages = request.result
            // Filter by userId if provided
            if (userId) {
                messages = messages.filter(msg => msg.userId === userId)
            }
            // ANCHOR: Sort by timestamp (handle both Date objects and ISO strings)
            messages.sort((a, b) => {
                const dateA = ensureDate(a.timestamp)
                const dateB = ensureDate(b.timestamp)
                return dateA - dateB
            })
            resolve(messages)
        }
        request.onerror = () => reject(request.error)
    })
}

export const addMessage = async (messageData) => {
    const db = await openChatDB()
    const transaction = db.transaction(['messages'], 'readwrite')
    const store = transaction.objectStore('messages')
    
    const messageWithUserId = {
        ...messageData,
        userId: getCurrentUserId(),
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
    }
    
    // ANCHOR: Debug logging for sent messages
    console.log('Saving message to IndexedDB:', messageWithUserId)
    
    return new Promise((resolve, reject) => {
        const request = store.add(messageWithUserId)
        request.onsuccess = () => {
            console.log('Message saved successfully:', messageWithUserId.id)
            resolve(request.result)
        }
        request.onerror = () => {
            console.error('Failed to save message:', request.error)
            reject(request.error)
        }
    })
}

export const updateMessage = async (messageId, updates) => {
    const db = await openChatDB()
    const transaction = db.transaction(['messages'], 'readwrite')
    const store = transaction.objectStore('messages')

    return new Promise((resolve, reject) => {
        const getRequest = store.get(messageId)
        getRequest.onsuccess = () => {
            const message = getRequest.result
            if (message) {
                const updatedMessage = {
                    ...message,
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
                const putRequest = store.put(updatedMessage)
                putRequest.onsuccess = () => resolve(putRequest.result)
                putRequest.onerror = () => reject(putRequest.error)
            } else {
                reject(new Error('Message not found'))
            }
        }
        getRequest.onerror = () => reject(getRequest.error)
    })
}

export const deleteMessage = async (messageId) => {
    const db = await openChatDB()
    const transaction = db.transaction(['messages'], 'readwrite')
    const store = transaction.objectStore('messages')

    return new Promise((resolve, reject) => {
        const request = store.delete(messageId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

// ANCHOR: User session operations
export const saveUserSession = async (userData) => {
    const db = await openChatDB()
    const transaction = db.transaction(['userSessions'], 'readwrite')
    const store = transaction.objectStore('userSessions')

    const sessionData = {
        principalId: userData.principal_id || userData.principalId,
        username: userData.username,
        email: userData.email,
        status: userData.status,
        role: userData.role,
        lastActive: new Date().toISOString(),
        userData: userData
    }

    return new Promise((resolve, reject) => {
        const request = store.put(sessionData)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export const getUserSession = async (principalId) => {
    const db = await openChatDB()
    const transaction = db.transaction(['userSessions'], 'readonly')
    const store = transaction.objectStore('userSessions')

    return new Promise((resolve, reject) => {
        const request = store.get(principalId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

// ANCHOR: Data migration functions
export const migrateMockData = async () => {
    try {
        // Import mock data
        const { mockChatData, mockMessages, mockChatParticipants } = await import('../MockData')

        const db = await openChatDB()
        const transaction = db.transaction(['chats', 'messages', 'userSessions'], 'readwrite')

        // ANCHOR: Migrate chats (use put instead of add to handle existing keys)
        const chatsStore = transaction.objectStore('chats')
        for (const chat of mockChatData) {
            const chatWithUserId = {
                ...chat,
                userId: getCurrentUserId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            await new Promise((resolve, reject) => {
                const request = chatsStore.put(chatWithUserId) // Use put instead of add
                request.onsuccess = () => resolve()
                request.onerror = () => reject(request.error)
            })
        }

        // ANCHOR: Migrate messages (use put instead of add to handle existing keys)
        const messagesStore = transaction.objectStore('messages')
        for (const [chatId, messages] of Object.entries(mockMessages)) {
            for (const message of messages) {
                const messageWithUserId = {
                    ...message,
                    chatId: chatId,
                    userId: getCurrentUserId(),
                    timestamp: message.timestamp.toISOString(),
                    createdAt: new Date().toISOString()
                }
                await new Promise((resolve, reject) => {
                    const request = messagesStore.put(messageWithUserId) // Use put instead of add
                    request.onsuccess = () => resolve()
                    request.onerror = () => reject(request.error)
                })
            }
        }

        // ANCHOR: Migrate chat participants as user sessions
        const sessionsStore = transaction.objectStore('userSessions')
        for (const [participantId, participant] of Object.entries(mockChatParticipants)) {
            const sessionData = {
                principalId: participantId,
                username: participant.name,
                email: participant.name.toLowerCase().replace(' ', '.') + '@example.com',
                status: participant.status || 'offline',
                role: 'User',
                lastActive: new Date().toISOString(),
                userData: participant
            }
            await new Promise((resolve, reject) => {
                const request = sessionsStore.put(sessionData)
                request.onsuccess = () => resolve()
                request.onerror = () => reject(request.error)
            })
        }

        await new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
        })

        console.log('Mock data migrated to IndexedDB successfully')
        return true
    } catch (error) {
        console.error('Failed to migrate mock data:', error)
        return false
    }
}

// ANCHOR: Check if database is empty and needs migration
export const checkAndMigrateData = async () => {
    try {
        const chats = await getChats()
        if (chats.length === 0) {
            console.log('No chats found, migrating mock data...')
            return await migrateMockData()
        } else {
            // Check if we have old data (multiple chats instead of just hikaru-testing)
            const hasOldData = chats.some(chat => chat.id !== 'hikaru-testing')
            if (hasOldData) {
                console.log('Old data detected, resetting to clean state...')
                return await resetToCleanState()
            } else {
                console.log('Database already has correct data, skipping migration')
            }
        }
        return true
    } catch (error) {
        console.error('Error checking database:', error)
        // If there's an error checking, try migration anyway
        console.log('Error checking database, attempting migration...')
        return await migrateMockData()
    }
}

// ANCHOR: Clear all data (useful for testing)
export const clearAllData = async () => {
    const db = await openChatDB()
    const transaction = db.transaction(['chats', 'messages', 'userSessions'], 'readwrite')

    await Promise.all([
        new Promise((resolve, reject) => {
            const request = transaction.objectStore('chats').clear()
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        }),
        new Promise((resolve, reject) => {
            const request = transaction.objectStore('messages').clear()
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        }),
        new Promise((resolve, reject) => {
            const request = transaction.objectStore('userSessions').clear()
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    ])

    console.log('All data cleared from IndexedDB')
}

// ANCHOR: Force migration (useful for testing)
export const forceMigration = async () => {
    try {
        console.log('Force migrating mock data...')
        await clearAllData()
        return await migrateMockData()
    } catch (error) {
        console.error('Failed to force migrate:', error)
        return false
    }
}

// ANCHOR: Reset to clean state with new mock data
export const resetToCleanState = async () => {
    try {
        console.log('Resetting to clean state with new mock data...')
        await clearAllData()
        await migrateMockData()
        console.log('Reset complete! You should now see only "Hikaru Testing" chat.')
        return true
    } catch (error) {
        console.error('Failed to reset:', error)
        return false
    }
}

// ANCHOR: Test functions for development
export const testIndexedDB = async () => {
    try {
        console.log('Testing IndexedDB functionality...')

        // Test adding a message
        const testMessage = {
            id: `test-msg-${Date.now()}`,
            chatId: 'hikaru-testing',
            text: 'This is a test message from IndexedDB!',
            sender: 'me',
            type: 'sent',
            status: 'read'
        }

        await addMessage(testMessage)
        console.log('Test message added successfully')

        // Test retrieving messages
        const messages = await getMessagesByChatId('hikaru-testing')
        console.log('Retrieved messages:', messages.length)

        // Test retrieving chats
        const chats = await getChats()
        console.log('Retrieved chats:', chats.length)

        console.log('All IndexedDB tests passed!')
        return true
    } catch (error) {
        console.error('IndexedDB test failed:', error)
        return false
    }
}

// ANCHOR: Manual reset function (call from browser console)
window.resetChatData = async () => {
    try {
        console.log('Manually resetting chat data...')
        await resetToCleanState()
        console.log('Reset complete! Refresh the page to see changes.')
        return true
    } catch (error) {
        console.error('Manual reset failed:', error)
        return false
    }
}

// ANCHOR: Debug function to check all messages in database
window.checkAllMessages = async () => {
    try {
        console.log('Checking all messages in IndexedDB...')
        const messages = await getMessagesByChatId('hikaru-testing')
        console.log('All messages for hikaru-testing:', messages)
        console.log('Total messages:', messages.length)
        messages.forEach((msg, index) => {
            console.log(`Message ${index + 1}:`, {
                id: msg.id,
                text: msg.text,
                sender: msg.sender,
                type: msg.type,
                timestamp: msg.timestamp
            })
        })
        return messages
    } catch (error) {
        console.error('Failed to check messages:', error)
        return []
    }
}
