import React, { useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './scss/_inlineSelect.module.scss';

function InlineSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    showChevron = true,
    upIcon = <ChevronUp size={18} />,
    downIcon = <ChevronDown size={18} />,
    isOpen = false,
    onOpenChange = () => { },
    inlineList = true,
    asButton = true,
    showRightCode = false,
    allowMultipleOpen = false, 
}) {
    const ref = useRef(null);

    const selected = options?.find(o => (o.code ?? o.value) === value);
    const label = selected?.name ?? selected?.label ?? '';

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                // Only close if allowMultipleOpen is false, otherwise let parent manage state
                if (!allowMultipleOpen) {
                    onOpenChange(false);
                }
            }
        }
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onOpenChange, allowMultipleOpen]);

    return (
        <div className={styles.container} ref={ref}>
            <div
                className={styles.input}
                role="button"
                tabIndex={0}
                onClick={() => onOpenChange(!isOpen)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenChange(!isOpen);
                    }
                }}
            >
                <span className={styles.display}>
                    {label || placeholder}
                </span>
                {showChevron ? (isOpen ? upIcon : downIcon) : null}
            </div>

            {isOpen && (
                <div className={styles.wrapper}>
                    <div
                        role="listbox"
                        aria-activedescendant={value || undefined}
                        className={styles.listbox}
                    >
                        {options?.map((opt) => {
                            const code = opt.code ?? opt.value;
                            const name = opt.name ?? opt.label ?? String(code);
                            const active = code === value;

                            return (
                                <button
                                    key={code}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    className={styles.option}
                                    onClick={() => {
                                        onChange(code);
                                        onOpenChange(false);
                                    }}
                                >
                                    <span className={styles.optionText}>
                                        {name}
                                    </span>
                                    {showRightCode ? (
                                        <span className={styles.optionCode}>
                                            {String(code)}
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InlineSelect;