import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/dashboard/navigation/Header'
import Navigation from '@/components/dashboard/navigation/Navigation'
import styles from './scss/_dashboardpage.module.scss'

const DashboardPage = () => {
    return (
        <>
            <Header />

            <main className={styles.dashboardPage}>
                <Outlet />
            </main>
            
            <Navigation />
        </>
    )
}

export default DashboardPage