import React, { useState, useEffect } from 'react';
import { canInstallPWA, installPWA } from '../../utils/pwa';

const PWAInstallButton = ({ className = '', children }) => {
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        // Check if PWA can be installed
        const checkInstallable = () => {
            setShowInstallButton(canInstallPWA());
        };

        checkInstallable();
        window.addEventListener('beforeinstallprompt', checkInstallable);
        window.addEventListener('appinstalled', () => setShowInstallButton(false));

        return () => {
            window.removeEventListener('beforeinstallprompt', checkInstallable);
            window.removeEventListener('appinstalled', () => setShowInstallButton(false));
        };
    }, []);

    const handleInstall = async () => {
        try {
            const installed = await installPWA();
            if (installed) {
                console.log('PWA installed successfully');
                setShowInstallButton(false);
            }
        } catch (error) {
            console.error('Failed to install PWA:', error);
        }
    };

    if (!showInstallButton) {
        return null;
    }

    return (
        <button
            onClick={handleInstall}
            className={`pwa-install-button ${className}`}
            aria-label="Install App"
        >
            {children || 'Install App'}
        </button>
    );
};

export default PWAInstallButton;
