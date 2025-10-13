import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './scss/_storymaker.module.scss'
import { StoryMakerFunction } from './StoryMakerFunction'
import Breadcrumb from '@/reusable/Breadcrumb'
import Button from '@/reusable/Button'
import ToggleSwitchList from '@/reusable/ToggleSwitchList'
import DateRange from '@/reusable/DateRange'
import Spinner from '@/loader/Spinner'

const StoryMaker = () => {

    // Import from Function
    const {
        data,
        dateItems,
        values,
        handleToggleChange,
    } = StoryMakerFunction()

    const navigate = useNavigate();
    const [isPaid, setIsPaid] = useState(true);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const handlePayAndStart = () => {
        setIsPaid(false);
        setIsGenerated(false);
        setIsLoading(false);
    };

    const handleGenerate = () => {
        setIsLoading(true);
        setIsGenerated(true);

        // Simulate loading effect for 2 seconds
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard/export-confirmation');
        }, 2000);
    };

    const breadcrumbItems = [
        { label: 'Export', to: '/dashboard/export' },
    ];

    return (
        <div className={styles.storyMakerContainer}>
            {/* Show loading overlay when generating */}
            {isGenerated && isLoading ? (
                <div className={styles.loadingOverlay}>
                    <Breadcrumb items={breadcrumbItems} />
                    <div className={styles.loadingContent}>
                        <Spinner />
                        <div className={styles.loadingHeader}>
                            <p className={styles.loadingTitle}>Creating your story</p>
                            <p className={styles.loadingText}>Please wait while we gather the necessary evidence needed to create your story.</p>
                        </div>
                        <div className={styles.backButton}>
                            <Button
                                variant="secondary"
                                className={styles.fullWidthBtn}
                                size="large"
                                onClick={() => {
                                    setIsGenerated(false);
                                    setIsLoading(false);
                                }}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    <div className={styles.header}>
                        <p className={styles.headerTitle}>StoryMaker</p>
                        <p className={styles.semititle}>Your story backed by proof</p>

                        {/* Payment screen */}
                        {isPaid ? (
                            <>
                                <div className={styles.headerSubtitle}>
                                    <p>Create quick snapshots of your immigration data for when you don't need a full application. Use it for border checks, case officer updates, or interim submissions. The app puts everything into a clear, ordered story so you don't have to do it manually.</p>
                                </div>

                                <div className={styles.storyMakerComponent}>
                                    <div className={styles.storyMakerContent}>
                                        {data.map((item) => (
                                            <div className={styles.storyMakerItem} key={item.id}>
                                                <p className={styles.itemTitle}>{item.title}</p>
                                                <p className={styles.itemMoney}>{item.money}</p>
                                                <p className={styles.itemContent}>{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.storyMakerButton}>
                                    <Button
                                        variant="primary"
                                        className={styles.fullWidthBtn}
                                        size="large"
                                        onClick={handlePayAndStart}
                                    >
                                        Pay & Start
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.headerSubtitle}>
                                    <p>Select whose data to export and the date range to create your story.</p>
                                </div>

                                <div className={styles.toggleSection}>
                                    <div className={styles.toggleItem}>
                                        <p className={styles.sectionLabel}>Export your data</p>
                                        <p className={styles.sectionDescription}>This will only export data related to you. No partner approval is needed.</p>
                                    </div>
                                    <ToggleSwitchList
                                        items={[{ id: 'export_personal', label: 'Export your data' }]}
                                        values={values}
                                        onChange={handleToggleChange}
                                        className={styles.toggleGroup}
                                    />

                                    <div className={styles.toggleItem}>
                                        <p className={styles.sectionLabel}>Export relationship data</p>
                                        <p className={styles.sectionDescription}>This will export all data to do with your relationship. This will require partner approval.</p>
                                    </div>
                                    <ToggleSwitchList
                                        items={[{ id: 'export_relationship', label: 'Export relationship data' }]}
                                        values={values}
                                        onChange={handleToggleChange}
                                        className={styles.toggleGroup}
                                    />
                                </div>

                                <div className={styles.dateRangeWrapper}>
                                    <DateRange
                                        startDate={null}
                                        endDate={null}
                                        onStartDateChange={() => { }}
                                        onEndDateChange={() => { }}
                                        className={styles.dateRange}
                                    />
                                </div>

                                <div className={styles.storyMakerButton}>
                                    <Button
                                        variant="primary"
                                        className={styles.fullWidthBtn}
                                        size="large"
                                        onClick={handleGenerate}
                                    >
                                        Generate
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default StoryMaker