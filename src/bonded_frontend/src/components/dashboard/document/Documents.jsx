import React from 'react'
import Breadcrumb from '@/reusable/Breadcrumb'
import styles from './scss/_document.module.scss'
import DateRange from '@/reusable/DateRange'
import Button from '@/reusable/Button';
import PulseLoader from '@/loader/PulseLoader'
import useDocumentGallery from './DocumentFunction'
import { useNavigate } from 'react-router-dom'

const Documents = () => {
    const {
        documents,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        visibleCount,
        setVisibleCount,
        isLoading,
        setIsLoading,
        onChangeFrom,
        onChangeTo
    } = useDocumentGallery()
    const navigate = useNavigate()

    const breadcrumbItems = [
        { label: 'Dashboard', to: '/dashboard' },
    ]


    return (
        <div className={styles.breadcrumbItems}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <p className={styles.headerTitle}>Documents</p>
            </div>


            {/* Date from and to */}
            <DateRange
                fromLabel="Date from"
                toLabel="Date to"
                from={dateFrom}
                to={dateTo}
                onChangeFrom={onChangeFrom}
                onChangeTo={onChangeTo}
                className={styles.dateContainer}
            />

            <div className={styles.documentContainer}>
                {documents.slice(0, visibleCount).map((document) => (
                    <div
                        key={document.id}
                        className={styles.documentItem}
                        role="button"
                        onClick={() => {
                            const date = new Date(document.date)
                            navigate('/dashboard/document-selection', {
                                state: {
                                    iconType: document.title.includes('Word') ? 'word' : document.title.includes('PDF') ? 'pdf' : 'image',
                                    title: document.title,
                                    dateISO: date.toISOString(),
                                    displayDate: date.toLocaleDateString('en-GB'),
                                    content: document.content,
                                    documentType: document.title.includes('Word') ? 'Word' : document.title.includes('PDF') ? 'PDF' : 'Image',
                                    documentId: document.id
                                }
                            })
                        }}
                    >
                        <div className={styles.documentIcon}>{document.icon}</div>
                        <div className={styles.documentTitle}>{document.title}</div>
                        <div className={styles.documentDate}>{document.date}</div>
                        <div className={styles.documentContent}>{document.content}</div>
                    </div>
                ))}
            </div>

            {visibleCount < documents.length && (
                <div className={styles.loadMoreButton}>
                    {isLoading ? (
                        <PulseLoader size={14} color="var(--front-color-600)" />
                    ) : (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                                setIsLoading(true)
                                setTimeout(() => {
                                    setVisibleCount((prev) => Math.min(prev + 4, documents.length))
                                    setIsLoading(false)
                                }, 1000)
                            }}
                        >
                            Load more
                        </Button>
                    )}
                </div>
            )}

        </div>
    )
}

export default Documents