import React from 'react'
import styles from './scss/_search.module.scss'
import { X, Plus } from 'lucide-react'
import { SearchFunction } from './SearchFunction'

const Search = () => {

  const {
    suggestedSearches,
    handleCloseSearch,
    searchResults,
  } = SearchFunction();

  return (
    <div className={styles.search}>

      <div className={styles.searchHeader}>
        <p>Suggested searches</p>
        <X className={styles.searchClose} onClick={handleCloseSearch} />
      </div>

      {/* Suggested searches */}
      <div className={styles.searchSuggestion}>
        <div className={styles.searchSuggestionList}>
          {suggestedSearches.map((search) => (
            <div className={styles.searchSuggestionItem} key={search.id}>
              <Plus className={styles.searchSuggestionIcon} />
              <p>{search.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className={styles.searchHeader}>
        <p>Search Results</p>
      </div>

      <div className={styles.searchResults}>
        {searchResults.map((result) => (
          <div className={styles.searchResultsItem} key={result.id}>

            <div className={styles.searchResultsHeader}>
              <div className={styles.searchResultsIcon}>
                {result.icon}
              </div>
              <p className={styles.searchResultsTitle}>{result.title}</p>
              <p className={styles.searchResultsTime}>{result.time}</p>
            </div>
            
            <div className={styles.searchResultsContent}>
              <p className={styles.searchResultsMessage}>{result.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Search