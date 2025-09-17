import React, { useEffect, useRef, useState } from 'react'
import Breadcrumb from '@/reusable/Breadcrumb'
import styles from './scss/_directMessageSelection.module.scss'
import { Check, MessageCircle, Facebook, Calendar, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import rimuro from '@/assets/example/rimuro.jpg'

const DirectMessageSelection = () => {

  const breadcrumbItems = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Direct Messages', to: '/dashboard/message' },
  ]

  const { state } = useLocation()

  const data = state || {}
  const [expanded, setExpanded] = useState(false)
  const [canToggle, setCanToggle] = useState(false)
  const visibleText = data.message || ''
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

  const getPlatformIcon = () => {
    if (data.iconType === 'whatsapp') {
      return <MessageCircle size={16} />
    } else if (data.iconType === 'facebook') {
      return <Facebook size={16} />
    }
    return <MessageCircle size={16} />
  }

  return (
    <div className={styles.directMessageSelectionContainer}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.header}>
        <p className={styles.headerTitle}>Message Details</p>
      </div>

      <div className={styles.directMessageSelectionCard}>
        <div className={styles.directMessageSelectionHeader}>
          <span className={styles.messageId}>Message ID: {data.messageId || '#—'}</span>
          <span className={styles.aiCheck}><Check size={12} /> AI Check</span>
        </div>
         <div className={styles.imageWrapper}>
           <img src={rimuro} alt="rimuro" className={styles.image} />
         </div>
        <div className={styles.badgesRow}>
          <span className={styles.badge}>{data.displayDate || '—/—/—'}</span>
          <span className={styles.badge}>{data.platform || '—'}</span>
        </div>
        <div className={styles.contentTitle}>{data.title || 'Untitled Message'}</div>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}><Calendar size={12} /> {data.displayDate || '—'}</span>
          <span className={styles.metaItem}><User size={12} /> {data.platform || '—'}</span>
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

export default DirectMessageSelection