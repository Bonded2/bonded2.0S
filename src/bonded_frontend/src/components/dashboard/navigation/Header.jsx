import React from 'react'
import styles from './scss/_header.module.scss'
import { Settings, Search } from 'lucide-react';
import Rimuro from '@/assets/example/rimuro.jpg'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>

        <Link to="/dashboard/profile-information">
          <img src={Rimuro} loading="eager" alt="" />
        </Link>

        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text" name="" id=""
            placeholder="Search for something"
            className={styles.searchInput}
          />
        </div>

        <Link to="/dashboard/settings">
          <Settings className={styles.settingsIcon} />
        </Link>
      </div>

    </div>
  )
}

export default Header