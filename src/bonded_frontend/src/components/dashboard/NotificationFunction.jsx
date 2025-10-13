import { MessageCircle, CircleAlert, User, File } from 'lucide-react';

export const useNotificationFunction = () => {

    const notifications = [
        {
            id: 1,
            icon: <MessageCircle />,
            title: 'You have a new message',
            description: 'Emilie has sent you a message in OpenChat',
            time: '10:00',
        },
        {
            id: 2,
            icon: <MessageCircle />,
            title: 'You have a new message',
            description: 'Emilie has sent you a message in OpenChat',
            time: '10:00',
        },
        {
            id: 3,
            icon: <MessageCircle />,
            title: 'You have a new message',
            description: 'Emilie has sent you a message in OpenChat',
            time: '10:00',
        },
        {
            id: 4,
            icon: <CircleAlert />,
            title: 'Subscription running out',
            description: 'You have ten days until your subscription runs out',
            time: '10:00',
        },
        // {
        //     id: 5,
        //     icon: <CircleAlert />,
        //     title: 'Subscription running out',
        //     description: 'You have ten days until your subscription runs out',
        //     time: '10:00',
        // },
        // {
        //     id: 6,
        //     icon: <MessageCircle />,
        //     title: 'You have a new message',
        //     description: 'Emilie has sent you a message in OpenChat',
        //     time: '10:00',
        // },
        // {
        //     id: 7,
        //     icon: <CircleAlert />,
        //     title: 'Subscription running out',
        //     description: 'You have ten days until your subscription runs out',
        //     time: '10:00',
        // },
        // {
        //     id: 8,
        //     icon: <CircleAlert />,
        //     title: 'Subscription running out',
        //     description: 'You have ten days until your subscription runs out',
        //     time: '10:00',
        // },
    ]

    const approvals = [
        {
            id: 1,
            icon: <User />,
            title: 'Profile updates need approval',
            description: 'Emilie has updated your shared profile, she is awaiting your approval on the changes',
            time: '10:00',
        },
        {
            id: 2,
            icon: <File />,
            title: 'New file upload needs approval',
            description: 'Emilie wants to upload a new file, she is awaiting your approval',
            time: '10:00',
        },
        {
            id: 3,
            icon: <File />,
            title: 'New file upload needs approval',
            description: 'Emilie wants to upload a new file, she is awaiting your approval',
            time: '10:00',
        },
    ]

    return {
        notifications,
        approvals,
    }
}