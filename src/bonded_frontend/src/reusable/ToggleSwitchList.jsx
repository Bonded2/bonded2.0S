import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styles from './scss/_toggleSwitchList.module.scss'

const ToggleSwitchList = ({
    items = [],
    values = {},
    onChange,
    className = '',
    maxVisible = 5,
    disabledIds = []
}) => {
    const normalizedItems = useMemo(() => {
        return items.map(item =>
            typeof item === 'string'
                ? { id: item, label: item }
                : item
        )
    }, [items])

    const handleToggle = (id) => {
        if (!onChange) return
        const next = { ...values, [id]: !values[id] }
        onChange(next, { id, value: next[id] })
    }

    const styleVar = { ['--max-rows']: maxVisible }

    return (
        <div className={[styles.toggleList, className].filter(Boolean).join(' ')} style={styleVar}>
            {normalizedItems.map(({ id, label, description }) => {
                const active = Boolean(values[id])
                const isDisabled = disabledIds.includes(id)
                return (
                    <button
                        key={id}
                        type="button"
                        className={[
                            styles.row,
                            active ? styles.active : styles.inactive,
                            isDisabled ? styles.disabled : ''
                        ].join(' ')}
                        onClick={() => { if (!isDisabled) handleToggle(id) }}
                        aria-pressed={active}
                        disabled={isDisabled}
                    >
                        <span className={styles.content}>
                            <span className={styles.label}>{label}</span>
                            {description && <span className={styles.description}>{description}</span>}
                        </span>
                        <span className={styles.switch}>
                            <span className={styles.knob} />
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

ToggleSwitchList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
                description: PropTypes.string
            })
        ])
    ),
    values: PropTypes.object,
    onChange: PropTypes.func,
    className: PropTypes.string
}

export default ToggleSwitchList