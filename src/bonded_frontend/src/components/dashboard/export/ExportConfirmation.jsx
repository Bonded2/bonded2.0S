import React from 'react'
import { useNavigate } from 'react-router-dom'
import style from './scss/_confirmation.module.scss'
import Button from '@/reusable/Button'
import Breadcrumb from '@/reusable/Breadcrumb'

const ExportConfirmation = () => {
    const navigate = useNavigate()

    const breadcrumbItems = [
        { label: 'Export data', to: '/dashboard/export' },
    ]

    return (
        <div className={style.confirmationContainer}>
            <Breadcrumb items={breadcrumbItems} />
            
            <div className={style.content}>
                <div className={style.header}>
                    <p className={style.headerTitle}>You've built your story</p>
                    <p className={style.semititle}>Your export has finished, everything's good to go.</p>
                </div>

                <div className={style.buttonGroup}>
                    <Button
                        variant="primary"
                        size="large"
                        className={style.button}
                    >
                        View
                    </Button>
                    <Button
                        variant="secondary"
                        size="large"
                        className={style.button}
                        onClick={() => navigate('/dashboard/export')}
                    >
                        Back
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ExportConfirmation