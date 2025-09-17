import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/_input.module.scss';
import { Lock, Search, Calendar } from 'lucide-react';

const Input = ({
    label,
    type = 'text',
    placeholder,
    id,
    value,
    onChange,
    className = '',
    showPasswordIcon = false,
    showSearchIcon = false,
    lightBackground = false,
    hideBorder = false,
    disabled = false,
    required = false,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    if (type === 'password' && showPasswordIcon) {
        return (
            <div className={`${styles.inputGroup} ${className}`}>
                {label && (
                    <label htmlFor={inputId} className={styles.inputLabel}>
                        {label}
                    </label>
                )}
                <div className={styles.passwordInputWrapper}>
                    <input
                        type={type}
                        id={inputId}
                        className={styles.inputField}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        {...props}
                    />
                    <Lock className={styles.passwordIcon} />
                </div>
            </div>
        );
    }

    if (type === 'date') {
        return (
            <div className={`${styles.inputGroup} ${className}`}>
                {label && (
                    <label htmlFor={inputId} className={`${styles.inputLabel} ${styles.dateLabel}`}>
                        {label}
                    </label>
                )}
                <div className={styles.dateInputWrapper}>
                    <input
                        type={type}
                        id={inputId}
                        className={`${styles.inputField} ${styles.dateInput}`}
                        value={value}
                        onChange={onChange}
                        {...props}
                    />
                    <Calendar className={styles.calendarIcon} />
                </div>
            </div>
        );
    }

    if (showSearchIcon) {
        return (
            <div className={`${styles.inputGroup} ${className}`}>
                {label && (
                    <label htmlFor={inputId} className={styles.inputLabel}>
                        {label}
                    </label>
                )}
                <div className={`${styles.searchInputWrapper} ${lightBackground ? styles.lightBackground : ''} ${hideBorder ? styles.hideBorder : ''}`}>
                    <Search className={styles.searchIcon} />
                    <input
                        type={type}
                        id={inputId}
                        className={`${styles.inputField} ${className}`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        {...props}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={styles.inputLabel}>
                    {label}
                </label>
            )}
            <input
                type={type}
                id={inputId}
                className={`${styles.inputField} ${hideBorder ? styles.hideBorder : ''} ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'file', 'date']),
    placeholder: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    showPasswordIcon: PropTypes.bool,
    showSearchIcon: PropTypes.bool,
    lightBackground: PropTypes.bool,
    hideBorder: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    autoComplete: PropTypes.string,
    name: PropTypes.string
};


export default Input;
