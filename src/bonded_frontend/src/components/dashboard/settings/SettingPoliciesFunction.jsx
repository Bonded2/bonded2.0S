import { Lock, Shield, Trash, UserPlus, File, PenTool } from 'lucide-react'

export const SettingPoliciesFunction = () => {
    // ANCHOR: Policy items configuration based on the policies screen
    const policiesItems = [
        {
            id: 'privacy',
            text: 'Privacy policy',
            variant: 'default',
            icon: <Lock />
        },
        {
            id: 'data-security',
            text: 'Data security policy',
            variant: 'default',
            icon: <Shield />
        },
        {
            id: 'data-retention',
            text: 'Data retention & deletion policy',
            variant: 'default',
            icon: <Trash />
        },
        {
            id: 'third-party',
            text: 'Third-party access policy',
            variant: 'default',
            icon: <UserPlus />
        },
        {
            id: 'terms',
            text: 'Terms of service',
            variant: 'default',
            icon: <File />
        },
        {
            id: 'legal',
            text: 'Legal',
            variant: 'default',
            icon: <PenTool />
        }
    ]
    return {
        policiesItems
    }
}