import React from 'react'
import { SettingPoliciesFunction } from './SettingPoliciesFunction'
import ListItem from '@/reusable/ListItem'
import styles from './scss/_policies.module.scss'
import Breadcrumb from '@/reusable/Breadcrumb'

const SettingPolicies = () => {
    const breadcrumbItems = [
        { label: 'Settings', to: '/dashboard/settings' },
    ]
        
    const { policiesItems } = SettingPoliciesFunction();
    
    
    // const onPolicyItemClick = (item) => {
    //     console.log(`Policy clicked: ${item.text}`)
    //     // TODO: Implement policy-specific functionality
    // }

    return (
        <div className={styles.policies}>

            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <h1 className={styles.headerTitle}>Policies</h1>
            </div>

            <div className={styles.policiesContainer}>
                {policiesItems.map((item) => (
                    <ListItem
                        key={item.id}
                        icon={item.icon}
                        text={item.text}
                        variant={item.variant}
                        onClick={() => onPolicyItemClick(item)}
                    />
                ))}
            </div>

        </div>
    )
}

export default SettingPolicies