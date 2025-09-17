import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/_checkbox.module.scss';

const Checkbox = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    required = false,
    id,
    name,
    value,
    className = '',
    size = 'medium',
    variant = 'default',
    indeterminate = false,
    ...props
}) => {
    // ANCHOR: Generate unique ID if not provided
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // ANCHOR: Build CSS classes based on variant and size
    const checkboxClasses = [
        styles.checkbox,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ');

    // ANCHOR: Handle checkbox change
    const handleChange = (event) => {
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className={checkboxClasses}>
            <input
                type="checkbox"
                id={checkboxId}
                name={name}
                value={value}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                ref={(input) => {
                    if (input) {
                        input.indeterminate = indeterminate;
                    }
                }}
                className={styles.input}
                {...props}
            />
            <label htmlFor={checkboxId} className={styles.label}>
                <span className={styles.checkmark}></span>
                {label && <span className={styles.labelText}>{label}</span>}
            </label>
        </div>
    );
};

// ANCHOR: PropTypes for Checkbox component
Checkbox.propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
    indeterminate: PropTypes.bool
};

export default Checkbox;