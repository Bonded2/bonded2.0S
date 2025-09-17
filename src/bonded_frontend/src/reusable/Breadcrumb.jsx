import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './scss/_breadcrumb.module.scss';

const Breadcrumb = ({ items = [] }) => {
    return (
        <div className={styles.breadcrumbContainer}>
            <Link to="/dashboard" className={styles.backButton}>
                <ChevronLeft size={20} />
            </Link>

            <div className={styles.breadcrumbPath}>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className={styles.separator}>/</span>}
                        {item.to ? (
                            <Link
                                to={item.to}
                                className={`${styles.breadcrumbItem} ${index === items.length - 1 ? styles.active : styles.inactive}`}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={`${styles.breadcrumbItem} ${index === items.length - 1 ? styles.active : styles.inactive}`}
                            >
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Breadcrumb;
