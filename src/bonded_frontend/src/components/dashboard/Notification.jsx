import React, { useState } from 'react'
import styles from './scss/_notification.module.scss'
import { useNotificationFunction } from './NotificationFunction'
import { ArrowRight } from 'lucide-react';

const Notification = () => {
  const { notifications, approvals } = useNotificationFunction()
  const [activeTab, setActiveTab] = useState('notifications')

  const listItems = activeTab === 'notifications' ? notifications : approvals
  return (
    <div className={styles.notification}>
      <div className={styles.header}>
        <p className={styles.headerTitle}>Notifications & Approvals</p>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('notifications')}
          aria-pressed={activeTab === 'notifications'}
          type="button"
        >
          Notifications
        </button>

        <button
          className={`${styles.tabButton} ${activeTab === 'approvals' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('approvals')}
          aria-pressed={activeTab === 'approvals'}
          type="button"
        >
          Approvals
        </button>
        
      </div>

      <div className={styles.notificationContainer}>
        {listItems.map((item) => (
          <div key={item.id} className={styles.notificationItem}>
            <div className={styles.notificationIcon}>{item.icon}</div>
            <span className={styles.notificationContent}>
              <p className={styles.notificationTitle}>{item.title}</p>
              <p className={styles.notificationDescription}>{item.description}</p>
            </span>
            <div className={styles.notificationTime}>{item.time}</div>
          </div>
        ))}
      </div>

      <div className={styles.editSettings}>
        <p>Edit notification settings</p>
        <ArrowRight />
      </div>
    </div>
  )
}

export default Notification