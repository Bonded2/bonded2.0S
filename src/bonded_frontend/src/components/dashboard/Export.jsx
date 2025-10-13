import React from 'react'
import styles from './scss/_export.module.scss'
import { ExportFunction } from './ExportFunction'
import { ArrowRight } from 'lucide-react';
import Button from '@/reusable/Button';
import { useNavigate } from 'react-router-dom';

const Export = () => {
  const { data } = ExportFunction()
  const navigate = useNavigate();

  return (
    <div className={styles.exportContainer}>

      <div className={styles.header}>
        <p className={styles.headerTitle}>Export data</p>
      </div>

      <div className={styles.exportContent}>
        {data.map((item) => (
          <div
            className={styles.exportContentItem}
            key={item.id}
            onClick={() => navigate(item.link)}
          >
            <p className={styles.exportContentItemTitle}>{item.title}</p>
            <p className={styles.exportContentItemContent}>{item.content}</p>
            <span>
              <p>Start</p>
              <ArrowRight />
            </span>
          </div>
        ))}
      </div>

      <div className={styles.exportButton}>
        <Button
          variant="primary"
          size="medium"
        >
          Export All Data
        </Button>
      </div>

    </div>
  )
}

export default Export