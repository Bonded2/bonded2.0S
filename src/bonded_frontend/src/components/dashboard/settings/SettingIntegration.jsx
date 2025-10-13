import React from 'react'
import { SettingIntegrationFunction } from './SettingIntegrationFunction'
import Button from '@/reusable/Button'
import Checkbox from '@/reusable/Checkbox'
import ToggleSwitchList from '@/reusable/ToggleSwitchList'
import styles from './scss/_integration.module.scss'
import Breadcrumb from '@/reusable/Breadcrumb'
import { ChevronDown, ChevronUp } from 'lucide-react'

const SettingIntegration = () => {
    const breadcrumbItems = [
        { label: 'Settings', to: '/dashboard/settings' },
    ]

    const {
        integrationItems,
        expandedItem,
        fileInputRef,
        handleToggleExpand,
        renderAccordionContent,
        handleSaveChanges
    } = SettingIntegrationFunction()

    // ANCHOR: Render accordion content based on integration type
    const renderContent = (item) => {
        const contentData = renderAccordionContent(item)

        if (contentData?.type === 'toggleList') {
            const { description, items, values, disabledIds, onChange } = contentData.props

            return (
                <div className={styles.accordionContent}>
                    <p className={styles.accordionDescription}>{description}</p>
                    <ToggleSwitchList
                        items={items}
                        values={values}
                        onChange={onChange}
                        disabledIds={disabledIds}
                    />
                </div>
            )
        } else if (contentData?.type === 'photoCheckbox') {
            const { description, checked, onChange, fileInputRef, onFileSelect } = contentData.props

            return (
                <div className={styles.accordionContent}>
                    <p className={styles.accordionDescription}>{description}</p>
                    <div className={styles.checkboxContainer}>
                        <Checkbox
                            label="Allow full access"
                            checked={checked}
                            onChange={onChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={onFileSelect}
                        />
                    </div>
                </div>
            )
        } else if (contentData?.type === 'locationCheckbox') {
            const { description, checked, onChange, status } = contentData.props

            return (
                <div className={styles.accordionContent}>
                    <p className={styles.accordionDescription}>{description}</p>
                    <div className={styles.checkboxContainer}>
                        <Checkbox
                            label="Enable Location"
                            checked={checked}
                            onChange={onChange}
                        />
                        {status && (
                            <small className={styles.statusText}>{status}</small>
                        )}
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={styles.integration}>

            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <h1 className={styles.headerTitle}>Integrations</h1>
            </div>

            <div className={styles.integrationContainer}>
                {integrationItems.map((item) => (
                    <div key={item.id} className={styles.accordionItem}>
                        <div
                            className={`${styles.accordionHeader} ${expandedItem === item.id ? styles.expanded : ''}`}
                            onClick={() => handleToggleExpand(item.id)}
                        >
                            <div className={styles.accordionHeaderLeft}>
                                <div className={styles.iconContainer}>
                                    {item.icon}
                                </div>
                                <span className={styles.accordionText}>{item.text}</span>
                            </div>
                            <div className={styles.accordionHeaderRight}>
                                {expandedItem === item.id ? (
                                    <ChevronUp className={styles.chevron} />
                                ) : (
                                    <ChevronDown className={styles.chevron} />
                                )}
                            </div>
                        </div>

                        {expandedItem === item.id && renderContent(item)}
                    </div>
                ))}
            </div>

            <div className={styles.buttonContainer}>
                <Button variant="primary" onClick={handleSaveChanges}>
                    Save changes
                </Button>
            </div>

        </div>
    )
}

export default SettingIntegration