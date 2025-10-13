import React from 'react'
import { Cloud, File, CircleAlert, Power   } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingFunction = () => {
    const navigate = useNavigate();
   
    const menuItems = [
        {
            id: 'integrations',
            text: 'Integrations',
            variant: 'default',
            icon: <Cloud />
        },
        {
            id: 'policies',
            text: 'Policies',
            variant: 'default',
            icon: <File />
        },
        {
            id: 'faqs',
            text: 'FAQs',
            variant: 'default',
            icon: <CircleAlert />
        },
        {
            id: 'logout',
            text: 'Logout',
            variant: 'danger',
            icon: <Power />
        }
    ]

    
    const handleMenuItemClick = (itemId) => {
        switch (itemId) {
            case 'integrations':
                navigate('/dashboard/setting-integration');
                break
            case 'policies':
                navigate('/dashboard/setting-policies');
                break
            case 'faqs':
                console.log('Navigate to FAQs')
                // TODO: Implement FAQs navigation
                break
            case 'logout':
                console.log('Handle logout')
                // NOTE: This will be handled by the parent Setting component
                break
            default:
                console.log(`Unknown menu item: ${itemId}`)
        }
    }

    return {
        menuItems,
        handleMenuItemClick
    }
}