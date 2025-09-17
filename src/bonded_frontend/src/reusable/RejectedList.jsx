import React from 'react'
import { X } from 'lucide-react'
import styles from './scss/_rejectedList.module.scss'

const RejectedList = ({ rejectedItems = [] }) => {
    return (
        <div className={styles.rejectedListContainer}>
            {rejectedItems.map((item, index) => (
                <div key={index} className={styles.rejectedItem}>
                    <div className={styles.iconContainer}>
                        <X className={styles.rejectIcon} />
                    </div>
                    <div className={styles.serviceName}>
                        {item.name}
                    </div>
                    <div className={styles.editLink}>
                        Edit
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RejectedList