import React, { useState } from 'react'
import styles from './scss/_navigation.module.scss'
import { Link } from 'react-router-dom'
import { LayoutGrid, List, MessageCircle, Bell, Download } from 'lucide-react';

const Navigation = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { Icon: LayoutGrid, to: '/dashboard' },
        { Icon: List, to: '/dashboard/timeline' },
        { Icon: MessageCircle, to: '/dashboard/open-chat' },
        { Icon: Bell, to: '/dashboard/notification' },
        { Icon: Download, to: '/dashboard/export' },
    ];

    return (
        <div className={styles.navigation}>

            <div className={styles.navigationContent}>
                <ul className={styles.navList}>
                    {items.map(({ Icon, to }, index) => (
                        <li key={index} className={styles.navListItem}>
                            <Link
                                to={to}
                                className={`${styles.navItem} ${activeIndex === index ? styles.active : ''}`}
                                onClick={() => setActiveIndex(index)}
                                aria-current={activeIndex === index ? 'page' : undefined}
                            >
                                <Icon className={styles.navIcon} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default Navigation