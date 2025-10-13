import React from 'react'
import styles from './scss/_listitem.module.scss'

// ANCHOR: Reusable ListItem component for settings menu items
const ListItem = ({ 
  icon, 
  text, 
  onClick, 
  variant = 'default',
  disabled = false,
  className = '' 
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <div 
      className={`${styles.listItem} ${styles[variant]} ${className} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
    >
      <div className={styles.iconContainer}>
        {icon}
      </div>
      
      <div className={styles.textContainer}>
        <span className={styles.text}>{text}</span>
      </div>
      
      <div className={styles.chevronContainer}>
        <svg 
          className={styles.chevron} 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
        >
          <path 
            d="M6 4L10 8L6 12" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className={styles.separator}></div>
    </div>
  )
}

export default ListItem