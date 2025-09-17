import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './scss/_mobilecarousel.module.scss'
import Rimuro from '@/assets/example/rimuro.jpg'

const CARD_WIDTH = 171
const GAP = 16
const SIDE_PADDING = 24

function clampMod(n, m) {
    return ((n % m) + m) % m
}

const MobileCarousel = ({ images, dates, className = '', onChange }) => {

    const base = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            if (images.length === 1 && images[0] === 'placeholder') {
                return ['placeholder']
            }
            return images
        }
        return ['placeholder']
    }, [images])

    const tripled = useMemo(() => {

        if (base.length > 1) {
            return [...base, ...base, ...base]
        }

        return base
    }, [base])

    const START = base.length > 1 ? base.length : 0
    const [idx, setIdx] = useState(START)

    useEffect(() => {
        if (base.length > 1) {
            setIdx(base.length)
        }
    }, [base.length])

    const realIndex = clampMod(idx, base.length)

    const frameRef = useRef(null)
    const [frameW, setFrameW] = useState(0)
    useEffect(() => {
        const measure = () => setFrameW(frameRef.current?.clientWidth || 0)
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [])

    // Gesture state
    const startX = useRef(null)
    const deltaX = useRef(0)
    const [anim, setAnim] = useState(true) 

    // Notify on change
    useEffect(() => {
        if (onChange) onChange(realIndex)
    }, [realIndex, onChange])

    // Translate amount to center current card
    const centerOffset = Math.max(0, (frameW - CARD_WIDTH) / 2)
    const step = CARD_WIDTH + GAP
    const translatePx = base.length > 1 
        ? idx * step - centerOffset + SIDE_PADDING 
        : 0 
    // Touch handlers
    const onTouchStart = (e) => {
        startX.current = e.touches[0].clientX
        deltaX.current = 0
    }

    const onTouchMove = (e) => {
        if (startX.current == null) return
        deltaX.current = e.touches[0].clientX - startX.current
    }

    const onTouchEnd = () => {

        if (base.length <= 1) {
            startX.current = null
            deltaX.current = 0
            return
        }
        
        const threshold = 30
        if (deltaX.current > threshold) setIdx((p) => p - 1)
        else if (deltaX.current < -threshold) setIdx((p) => p + 1)
        startX.current = null
        deltaX.current = 0
    }

    const onTransitionEnd = () => {

        if (base.length <= 1) return
        
        const block = base.length
        if (idx < block || idx >= block * 2) {
            setAnim(false)
            setIdx(block + realIndex)
            // Re-enable transition on next frame
            requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)))
        }
    }

    return (
        <div
            className={`${styles.carousel} ${className}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className={styles.frame} ref={frameRef}>
                <div
                    className={styles.track}
                    style={{
                        transform: `translateX(-${translatePx}px)`,
                        transition: anim ? undefined : 'none',
                        justifyContent: base.length === 1 ? 'center' : 'flex-start',
                    }}
                    onTransitionEnd={onTransitionEnd}
                >
                    {tripled.map((src, i) => {
                        const isActive = i === idx
                        const key = `${i}-${src?.toString?.() || 'img'}`
                        const labelIndex = clampMod(i, base.length)
                        const dateLabel = Array.isArray(dates) && dates[labelIndex] ? dates[labelIndex] : null
                        const isPlaceholder = src === 'placeholder'
                        return (
                            <div
                                key={key}
                                className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                                aria-current={isActive ? 'true' : 'false'}
                            >
                                <div className={`${styles.imageWrap} ${isPlaceholder ? styles.placeholder : ''}`}>
                                    {isPlaceholder ? (
                                        <div className={styles.placeholderContent}>
                                            <div className={styles.placeholderIcon}>📷</div>
                                            <div className={styles.placeholderText}>No Image Upload</div>
                                        </div>
                                    ) : (
                                        <img src={src} alt='carousel' loading='eager' />
                                    )}
                                </div>

                                <div className={styles.dateBadge} aria-live='polite'>
                                    {dateLabel || (() => {
                                        const d = new Date()
                                        const dd = String(d.getDate()).padStart(2, '0')
                                        const mm = String(d.getMonth() + 1).padStart(2, '0')
                                        const yyyy = d.getFullYear()
                                        return `${dd}.${mm}.${yyyy}`
                                    })()}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {base.length > 1 && (
                <div className={styles.indicators} role='tablist' aria-label='carousel indicators'>
                    {base.map((_, i) => (
                        <button
                            key={i}
                            type='button'
                            className={`${styles.dot} ${i === realIndex ? styles.active : ''}`}
                            aria-current={i === realIndex}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => setIdx(START + i)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MobileCarousel