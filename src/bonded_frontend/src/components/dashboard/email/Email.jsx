import React from 'react'
import Breadcrumb from '@/reusable/Breadcrumb'
import styles from './scss/_email.module.scss'
import DateRange from '@/reusable/DateRange'
import Button from '@/reusable/Button';
import PulseLoader from '@/loader/PulseLoader'
import useEmailGallery from './EmailFunction'

const Email = () => {
  const {
    emails,
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
  } = useEmailGallery()

  const breadcrumbItems = [
    { label: 'Dashboard', to: '/dashboard' },
  ]


  return (
    <div className={styles.breadcrumbItems}>
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.header}>
        <p className={styles.headerTitle}>Emails</p>
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

      <div className={styles.emailContainer}>
        {emails.slice(0, visibleCount).map((email) => (
          <div key={email.id} className={styles.emailItem}>
            <div className={styles.emailIcon}>{email.icon}</div>
            <div className={styles.emailTitle}>{email.title}</div>
            <div className={styles.emailDate}>{email.date}</div>
            <div className={styles.emailMessage}>{email.message}</div>
          </div>
        ))}
      </div>

      {visibleCount < emails.length && (
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
                  setVisibleCount((prev) => Math.min(prev + 4, emails.length))
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

export default Email