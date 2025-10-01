import React from 'react'
import styles from './scss/_header.module.scss'
import { Settings, Search } from 'lucide-react';
import Rimuro from '@/assets/example/rimuro.jpg'
import logo from '/icons/icon-384x384.png'
import { Link, useNavigate } from 'react-router-dom'
import { Session } from '../../../routes/SessionProvider';

const Header = () => {
  const navigate = useNavigate();
  const { userData } = Session()

  const handleSearchClick = () => {
    navigate('/dashboard/search');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/dashboard/search');
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>

        <Link to="/dashboard/profile-information">
          <img src={userData?.profile || logo} loading="eager" alt="" />
        </Link>

        <div className={styles.searchWrapper}>
          <Link to="/dashboard/search" className={styles.searchIconLink}>
            <Search className={styles.searchIcon} />
          </Link>
          <input
            type="text" name="" id=""
            placeholder="Search for something"
            className={styles.searchInput}
            onClick={handleSearchClick}
            onKeyDown={handleSearchKeyDown}
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