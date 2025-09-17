import { Search } from 'lucide-react';
import styles from './scss/SearchBar.module.scss';

const SearchBar = ({
    placeholder = "Search",
    showIcon = true,
    value = "",
    onChange = () => { },
    onSearch = () => { },
    className = "",
    fullWidth = false,
    ...props
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(value);
        }
    };

    return (
        <div
            className={`${styles.searchBarContainer} ${fullWidth ? styles.fullWidth : ""} ${className}`}
        >
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={styles.searchInput}
                    {...props}
                />
                {showIcon && (
                    <button
                        type="button"
                        className={styles.searchIconButton}
                        onClick={() => onSearch(value)}
                        aria-label="Search"
                    >
                        <Search className={styles.searchIcon} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;