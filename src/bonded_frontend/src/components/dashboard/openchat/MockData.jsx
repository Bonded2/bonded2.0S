import rimuro from '@/assets/example/rimuro.jpg'
import nishimiya from '@/assets/example/nishimiya.jpg'

export const mockChatData = [
    {
        image: rimuro,
        alt: 'Hikaru Testing',
        title: 'Hikaru Testing',
        subtitle: 'Welcome to the chat! Start testing...',
        date: new Date(),
        unread: 0,
        id: 'hikaru-testing',
        status: 'online'
    }
]

// ANCHOR: Mock message data for chat conversations
export const mockMessages = {
    'hikaru-testing': [
        {
            id: 'msg-1',
            text: 'Hello! This is a test chat for IndexedDB functionality.',
            sender: 'hikaru-testing',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            type: 'received'
        },
        {
            id: 'msg-2',
            text: 'You can send messages and they will be stored in IndexedDB!',
            sender: 'hikaru-testing',
            timestamp: new Date(Date.now() - 1000 * 60 * 4),
            type: 'received'
        },
        {
            id: 'msg-3',
            text: 'Try sending a message to test the functionality.',
            sender: 'hikaru-testing',
            timestamp: new Date(Date.now() - 1000 * 60 * 3),
            type: 'received'
        }
    ]
}

// ANCHOR: Mock chat participants data
export const mockChatParticipants = {
    'hikaru-testing': {
        id: 'hikaru-testing',
        name: 'Bonded User',
        image: rimuro,
        status: 'online',
        typing: false
    }
}

export default {
    mockChatData,
    mockMessages,
    mockChatParticipants
}