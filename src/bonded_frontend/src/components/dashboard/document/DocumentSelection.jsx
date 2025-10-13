import React, { useEffect, useRef, useState } from 'react'
import Breadcrumb from '@/reusable/Breadcrumb'
import styles from './scss/_documentselection.module.scss'
import { Check, FileText, FileImage, Calendar, File } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import rimuro from '@/assets/example/rimuro.jpg'

const DocumentSelection = () => {

    const breadcrumbItems = [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Documents', to: '/dashboard/document' },
    ]

    const { state } = useLocation()

    const data = state || {}
    const [expanded, setExpanded] = useState(false)
    const [canToggle, setCanToggle] = useState(false)
    const visibleText = data.content || ''
    const descRef = useRef(null)

    useEffect(() => {
        if (!descRef.current) return
        descRef.current.classList.remove(styles.expanded)
        descRef.current.classList.add(styles.clamped)
        requestAnimationFrame(() => {
            const el = descRef.current
            if (!el) return
            setCanToggle(el.scrollHeight > el.clientHeight + 1)
            el.classList.remove(styles.clamped, styles.expanded)
            el.classList.add(expanded ? styles.expanded : styles.clamped)
        })
    }, [visibleText, expanded])

    const getDocumentIcon = () => {
        if (data.iconType === 'word') {
            return <FileText size={16} />
        } else if (data.iconType === 'pdf') {
            return <File size={16} />
        } else if (data.iconType === 'image') {
            return <FileImage size={16} />
        }
        return <File size={16} />
    }

    return (
        <div className={styles.documentSelectionContainer}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <p className={styles.headerTitle}>Document Details</p>
            </div>

            <div className={styles.documentSelectionCard}>
                <div className={styles.documentSelectionHeader}>
                    <span className={styles.documentId}>Document ID: {data.documentId || '#—'}</span>
                    <span className={styles.aiCheck}><Check size={12} /> AI Check</span>
                </div>
                <div className={styles.imageWrapper}>
                    <img src={rimuro} alt="rimuro" className={styles.image} />
                </div>
                <div className={styles.badgesRow}>
                    <span className={styles.badge}>{data.displayDate || '—/—/—'}</span>
                    <span className={styles.badge}>{data.documentType || '—'}</span>
                </div>
                <div className={styles.contentTitle}>{data.title || 'Untitled Document'}</div>
                <div className={styles.metaRow}>
                    <span className={styles.metaItem}><Calendar size={12} /> {data.displayDate || '—'}</span>
                    <span className={styles.metaItem}><File size={12} /> {data.documentType || '—'}</span>
                </div>
                <div className={styles.descriptionRow}>
                    <span ref={descRef} className={`${styles.descriptionText} ${expanded ? styles.expanded : styles.clamped}`}>{visibleText}</span>
                    {canToggle && (
                        <button className={styles.readMore} type="button" onClick={() => setExpanded(!expanded)}>
                            {expanded ? ' Show less' : ' Read More'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocumentSelection