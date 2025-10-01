import { Plus, Facebook } from 'lucide-react'

export const SearchFunction = () => {

    const handleCloseSearch = () => {
        window.history.back();
    };

    const suggestedSearches = [
        {
            id: 1,
            name: 'Direct Messages',
            icon: <Plus />
        },
        {
            id: 2,
            name: 'Video calls',
            icon: <Plus />
        },
        {
            id: 3,
            name: 'Social media',
            icon: <Plus />
        },
        {
            id: 4,
            name: 'Photo gallery',
            icon: <Plus />
        },
        {
            id: 5,
            name: 'Emails',
            icon: <Plus />
        },
        {
            id: 6,
            name: 'Calendar',
            icon: <Plus />
        },
        {
            id: 7,
            name: 'Documents',
            icon: <Plus />
        },
    ]

    const searchResults = [
        {
            id: 1,
            icon: <Facebook />,
            title: 'Facebook post by Emelie',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.',
            time: '13:23 PM',
        },
        {
            id: 2,
            icon: <Facebook />,
            title: 'Facebook post by Emelie',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.',
            time: '13:23 PM',
        },
        {
            id: 3,
            icon: <Facebook />,
            title: 'Facebook post by Emelie',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.',
            time: '13:23 PM',
        },
        {
            id: 4,
            icon: <Facebook />,
            title: 'Facebook post by Emelie',
            message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a justo augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer et velit ac tortor pretium bibendum. Curabitur eu pulvinar nunc.',
            time: '13:23 PM',
        },
    ]


    return {
        suggestedSearches,
        handleCloseSearch,
        searchResults,
    }
}