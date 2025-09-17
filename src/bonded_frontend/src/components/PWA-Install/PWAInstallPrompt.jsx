import React, { useEffect, useState } from 'react';
import styles from './scss/_installPrompt.module.scss';
import appIcon from '@/assets/applogo/web-app.png';

const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (/CriOS/i.test(ua)) return 'Chrome on iOS';
    if (/FxiOS/i.test(ua)) return 'Firefox on iOS';
    if (/EdgiOS/i.test(ua)) return 'Edge on iOS';
    if (/OPiOS/i.test(ua)) return 'Opera on iOS';
    if (/SamsungBrowser/i.test(ua)) return 'Samsung Browser';
    if (/Chrome/i.test(ua)) return 'Chrome';
    if (/Firefox/i.test(ua)) return 'Firefox';
    if (/Safari/i.test(ua)) return 'Safari';
    if (/Edge/i.test(ua)) return 'Edge';
    if (/Opera/i.test(ua)) return 'Opera';
    return 'Unknown Browser';
};

const PWAInstallPrompt = () => {
    const [installPromptEvent, setInstallPromptEvent] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);
    const [guidedInstallStep, setGuidedInstallStep] = useState(0);

    useEffect(() => {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const android = /Android/.test(navigator.userAgent);
        setIsIOS(iOS);
        setIsAndroid(android);
        setIsStandalone(window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', () => setShowPrompt(false));

        const lastDismissed = localStorage.getItem('pwaPromptDismissed');
        // Cooldown: 24 hours
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const recentlyDismissed = lastDismissed ? parseInt(lastDismissed, 10) > oneDayAgo : false;

        const ua = navigator.userAgent;
        const isMobileSafari = iOS && /Safari/i.test(ua) && !(/CriOS/i.test(ua));
        const isSamsung = android && /SamsungBrowser/i.test(ua);

        // Show prompt for iOS Safari and Samsung Browser (no reliable beforeinstallprompt)
        if (!recentlyDismissed && !isStandalone && (isMobileSafari || isSamsung)) {
            setTimeout(() => setShowPrompt(true), 3000);
        }

        // Fallback: if no beforeinstallprompt fired after a short delay
        // and we're not on iOS/Samsung, still show the prompt so users see guidance.
        if (!recentlyDismissed && !isStandalone && !isMobileSafari && !isSamsung) {
            setTimeout(() => {
                if (!installPromptEvent) setShowPrompt(true);
            }, 5000);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (installPromptEvent) {
            setIsInstalling(true);
            try {
                installPromptEvent.prompt();
                await installPromptEvent.userChoice;
            } catch { }
            setIsInstalling(false);
            setInstallPromptEvent(null);
            setShowPrompt(false);
            return;
        }

        if (isIOS) {
            setShowIOSGuide(true);
            setGuidedInstallStep(0);
            return;
        }

        // Fallback
        alert('To install, use the browser menu and choose "Add to Home screen".');
    };

    const handleDismiss = () => {
        localStorage.setItem('pwaPromptDismissed', Date.now().toString());
        setShowPrompt(false);
    };

    if (isStandalone || !showPrompt) return null;

    const iosInstallSteps = [
        { title: 'Tap the Share Button', description: 'Bottom toolbar in Safari', icon: '↗' },
        { title: 'Find "Add to Home Screen"', description: 'Scroll options if needed', icon: '📲' },
        { title: 'Tap "Add"', description: 'App appears on your home screen', icon: '✓' },
    ];

    return (
        <div className={styles.promptRoot}>
            <div className={styles.promptCard}>
                <div className={styles.iconWrap}>
                    <img src={appIcon} loading="eager" alt="Bonded App Icon" width={48} height={48} />
                </div>
                <div className={styles.content}>
                    <h3>Install Bonded</h3>
                    <p>Get quick access and work offline.</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.dismissBtn} onClick={handleDismiss}>Not now</button>
                    <button className={styles.installBtn} onClick={handleInstallClick} disabled={isInstalling}>
                        {isInstalling ? 'Installing…' : isIOS ? 'Show steps' : 'Install'}
                    </button>
                </div>
            </div>

            {showIOSGuide && (
                <div className={styles.iosOverlay} onClick={() => setShowIOSGuide(false)}>
                    <div className={styles.iosGuide} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.iosHeader}>
                            <h2>Install on iOS</h2>
                            <button className={styles.closeBtn} onClick={() => setShowIOSGuide(false)}>×</button>
                        </div>

                        <div className={styles.iosSteps}>
                            {iosInstallSteps.map((step, index) => (
                                <div key={index} className={`${styles.iosStep} ${index === guidedInstallStep ? styles.active : ''} ${index < guidedInstallStep ? styles.completed : ''}`}>
                                    <div className={styles.stepNumber}>{index + 1}</div>
                                    <div className={styles.stepIcon}>{step.icon}</div>
                                    <div className={styles.stepContent}>
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.iosActions}>
                            <button className={styles.prevBtn} onClick={() => setGuidedInstallStep(Math.max(0, guidedInstallStep - 1))} disabled={guidedInstallStep === 0}>Previous</button>
                            <button className={styles.nextBtn} onClick={() => {
                                if (guidedInstallStep < iosInstallSteps.length - 1) setGuidedInstallStep(guidedInstallStep + 1);
                                else setShowIOSGuide(false);
                            }}>{guidedInstallStep < iosInstallSteps.length - 1 ? 'Next' : 'Done'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PWAInstallPrompt;


