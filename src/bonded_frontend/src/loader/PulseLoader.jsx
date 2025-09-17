import React from 'react';
import styles from './scss/_pulseleader.module.scss';

const PulseLoader = ({ color = "#424242", size = 20 }) => {
  const pulseStyle = {
    '--pulse-color': color,
    '--pulse-size': `${size}px`,
  };

  return (
    <div className={styles.pulseLoader} style={pulseStyle}>
      <div className={styles.pulseDot}></div>
      <div className={styles.pulseDot}></div>
      <div className={styles.pulseDot}></div>
    </div>
  );
};

export default PulseLoader;
