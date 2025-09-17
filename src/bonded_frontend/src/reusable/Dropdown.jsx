import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styles from './scss/Dropdown.module.scss'

const Dropdown = ({
  options = [],
  value = '',
  onChange = () => { },
  onSelect = () => { },
  placeholder = 'Select an option',
  searchable = true,
  className = '',
  maxHeight = '200px',
  showSearchIcon = true,

  isOpen: controlledIsOpen,
  onOpenChange,
  showChevron = false,
  upIcon = null,
  downIcon = null,
  showRightCode = true,
  showLeftFlag = true,
  inlineList = false,
  asButton = false,
  ...props
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectedOption = options.find(o => o.code === value)
  const displayLabel = selectedOption
    ? selectedOption.name
    : (asButton ? placeholder : (searchTerm || placeholder))
  const [filteredOptions, setFilteredOptions] = useState(options)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setOpen = (next) => {
    if (onOpenChange) onOpenChange(next)
    if (controlledIsOpen === undefined) setInternalIsOpen(next)
  }

  // ANCHOR: Filter options based on search term
  useEffect(() => {
    if (searchable && searchTerm) {
      const filtered = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options)
    }
  }, [searchTerm, options, searchable])

  // ANCHOR: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // ANCHOR: Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    onChange(newValue)

    // ANCHOR: Open dropdown when user starts typing
    if (!isOpen && newValue.length > 0) {
      setOpen(true)
    }
  }

  // ANCHOR: Handle option selection
  const handleOptionSelect = (option) => {
    // keep searchTerm only for input mode; for asButton we show selectedOption.name via value
    if (!asButton) setSearchTerm(option.name)
    onChange(option.code)      // <-- emit code, not name
    onSelect(option)
    setOpen(false)
  }


  // ANCHOR: Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      setSearchTerm('')
    }
  }

  const handleToggle = (e) => {
    // Prevent outside-click closer from racing, and ensure consistent toggle
    e.preventDefault();
    e.stopPropagation();
    setOpen(!isOpen);
    if (!asButton && !isOpen) {
      // focus input when opening in input mode
      inputRef.current?.focus();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdownContainer} ${className}`}
      {...props}
    >
      <div
        className={styles.dropdownInput}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onMouseDown={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleToggle(e);
          if (e.key === 'Escape') { setOpen(false); setSearchTerm(''); }
        }}
      >
        {asButton ? (
          <button
            type="button"
            className={styles.buttonLike}
            // Button no longer needs its own click; wrapper handles it
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            {displayLabel}
          </button>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
            autoComplete="off"
          />
        )}
        {showChevron ? (
          <div className={styles.searchIcon} onMouseDown={handleToggle}>
            {isOpen ? upIcon : downIcon}
          </div>
        ) : showSearchIcon && (
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className={inlineList ? styles.dropdownListInline : styles.dropdownList} style={{ maxHeight }}>
          {filteredOptions.map((option, index) => (
            <div
              key={`${option.code}-${index}`}
              className={styles.dropdownItem}
              onClick={() => handleOptionSelect(option)}
            >
              {showLeftFlag && option.flag && (
                <span className={styles.flag}>{option.flag}</span>
              )}
              <span className={styles.optionName}>{option.name}</span>
              {showRightCode && option.code && (
                <span className={styles.optionCode}>{option.code}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && searchTerm && (
        <div className={styles.dropdownList}>
          <div className={styles.noResults}>
            No results found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  )
}

// ANCHOR: PropTypes for type checking and documentation
Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      flag: PropTypes.string
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  maxHeight: PropTypes.string,
  showSearchIcon: PropTypes.bool
}

// ANCHOR: Default props
Dropdown.defaultProps = {
  options: [],
  value: '',
  onChange: () => { },
  onSelect: () => { },
  placeholder: 'Select an option',
  searchable: true,
  className: '',
  maxHeight: '200px',
  showSearchIcon: true,
  showRightCode: true,
  showLeftFlag: true
}

export default Dropdown