import React, { useState, useEffect } from 'react';
import { isPWA, isOnline, setupNetworkMonitoring } from '../../utils/pwa';
import { Chromium, Smartphone  } from 'lucide-react';

const PWAStatus = ({ className = '' }) => {
    const [isPWAInstalled, setIsPWAInstalled] = useState(false);
    const [isOnlineStatus, setIsOnlineStatus] = useState(true);

    useEffect(() => {
        // Check if running as PWA
        setIsPWAInstalled(isPWA());

        // Set up network monitoring
        const cleanup = setupNetworkMonitoring(
            () => setIsOnlineStatus(true),
            () => setIsOnlineStatus(false)
        );

        return cleanup;
    }, []);

    return (
        <div
          className={`pwa-status ${className}`}
          style={{
            position: 'fixed',
            bottom: -4,
            left: -8,
            zIndex: 5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: '9px',
            gap: 8,
            whiteSpace: 'nowrap',
            flexWrap: 'nowrap',
          }}
        >
          <span style={{display:'inline-flex',alignItems:'center'}}>
            {isOnlineStatus ? '🟢 Online' : '🔴 Offline'}
          </span>
          <span style={{display:'inline-flex',alignItems:'center', gap: 4}}>
            {isPWAInstalled ? <Smartphone size={12} /> : <Chromium size={12} />}
            {isPWAInstalled ? 'PWA Mode' : 'Browser Mode'}
          </span>
        </div>
      );
};

export default PWAStatus;
