import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/_button.module.scss';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        className
    ].filter(Boolean).join(' ');

    const renderIcon = () => {
        if (!icon) return null;

        const iconElement = typeof icon === 'string' ? (
            <img src={icon} alt="" className={styles.buttonIcon} />
        ) : (
            <span className={styles.buttonIcon}>{icon}</span>
        );

        return iconElement;
    };

    const renderContent = () => {
        if (!icon) return children;

        if (iconPosition === 'left') {
            return (
                <>
                    {renderIcon()}
                    <span className={styles.buttonText}>{children}</span>
                </>
            );
        } else {
            return (
                <>
                    <span className={styles.buttonText}>{children}</span>
                    {renderIcon()}
                </>
            );
        }
    };

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {renderContent()}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    iconPosition: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    'aria-label': PropTypes.string,
    'aria-describedby': PropTypes.string
};


export default Button;
