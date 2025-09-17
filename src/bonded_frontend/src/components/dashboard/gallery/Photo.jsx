import React from 'react'
import Breadcrumb from '@/reusable/Breadcrumb'
import styles from './scss/_photo.module.scss'
import DateRange from '@/reusable/DateRange'
import Button from '@/reusable/Button'
import PulseLoader from '@/loader/PulseLoader'
import { useNavigate } from 'react-router-dom'
import usePhotoGallery from './PhotoFunction'

const Photo = () => {

    const {
        photos,
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
    } = usePhotoGallery()
    const navigate = useNavigate()

    const breadcrumbItems = [
        { label: 'Dashboard', to: '/dashboard' },
    ]

    return (
        <div className={styles.photoContainer}>
            <Breadcrumb items={breadcrumbItems} />

            <div className={styles.header}>
                <p className={styles.headerTitle}>Photo Gallery</p>
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


            <div className={styles.galleryContainer}>
                {photos.slice(0, visibleCount).map((item, idx) => (
                    <div
                        key={idx}
                        className={styles.galleryItem}
                        role="button"
                        onClick={() => {
                            const date = new Date(item.date)
                            navigate('/dashboard/photo-selection', {
                                state: {
                                    src: item.src,
                                    dateISO: date.toISOString(),
                                    displayDate: date.toLocaleDateString('en-GB'),
                                    displayTime: item.time,
                                    tokenId: item.tokenId,
                                    title: item.title,
                                    coords: item.coords,
                                    platform: item.platform,
                                    people: item.people,
                                    description: item.description
                                }
                            })
                        }}
                    >
                        <img src={item.src} loading="lazy" alt={`photo-${idx}`} className={styles.galleryImage} />
                        <div className={styles.galleryDate}>{new Date(item.date).toLocaleDateString('en-GB')}</div>
                    </div>
                ))}
            </div>

            {visibleCount < photos.length && (
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
                                    setVisibleCount((prev) => Math.min(prev + 4, photos.length))
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

export default Photo