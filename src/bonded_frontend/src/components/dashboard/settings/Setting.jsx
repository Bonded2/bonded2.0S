import React, { useState } from 'react'
import { signoutII } from '../../../services/ii'
import ListItem from '../../../reusable/ListItem'
import { SettingFunction } from './SettingFunction'
import styles from './scss/_setting.module.scss'

// ANCHOR: Settings component with menu items using ListItem
const Setting = () => {

  const [isSigningOut, setIsSigningOut] = useState(false)
  const { menuItems, handleMenuItemClick } = SettingFunction()

  const handleSignOut = async () => {

    setIsSigningOut(true)

    try {

      const signout = await signoutII()

      if (signout) {
        window.location.reload()
      }

    } catch (error) {
      console.error(error)
    } finally {
      window.location.reload()
      setTimeout(() =>
        setIsSigningOut(false), 800
      )
    }

  }

  // ANCHOR: Handle menu item click with special case for logout
  const onMenuItemClick = (item) => {
    if (item.id === 'logout') {
      handleSignOut()
    } else {
      handleMenuItemClick(item.id)
    }
  }

  return (
    <div className={styles.setting}>

      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Settings</h1>
      </div>

      <div className={styles.menuContainer}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            icon={item.icon}
            text={item.text}
            variant={item.variant}
            onClick={() => onMenuItemClick(item)}
            disabled={isSigningOut && item.id === 'logout'}
          />
        ))}
      </div>

    </div>

  )
}

export default Setting