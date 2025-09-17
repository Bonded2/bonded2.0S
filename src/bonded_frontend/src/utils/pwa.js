let swRegistration = null;
let hasReloadedForSW = false;
let deferredInstallPrompt = null;

export const initializePWA = async () => {
  if (!('serviceWorker' in navigator)) {
    console.info('PWA: Service Worker not supported');
    return;
  }

  try {
    swRegistration = await navigator.serviceWorker.register('/sw.js'); // ensure /sw.js is at site root
    console.log('PWA: SW registered', swRegistration);

    // Immediately check for an update on load
    safeUpdateCheck();

    // When a new worker is found
    swRegistration.addEventListener('updatefound', () => {
      const installing = swRegistration.installing;
      if (!installing) return;

      installing.addEventListener('statechange', () => {
        // New code installed and waiting to take over
        if (installing.state === 'installed' && swRegistration.waiting && navigator.serviceWorker.controller) {
          showUpdateNotification();
        }
      });
    });

    // If we re-enter the page and there is a waiting SW, prompt update
    if (swRegistration.waiting && navigator.serviceWorker.controller) {
      showUpdateNotification();
    }

    // Only reload once when the new controller takes over
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hasReloadedForSW) return;
      hasReloadedForSW = true;
      console.log('PWA: New SW activated, reloading once');
      window.location.reload();
    });

    // Handle install prompt lifecycle
    setupInstallPrompt();

    // Optional: visibility-based update checks (cheap + effective)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') safeUpdateCheck();
    });

  } catch (err) {
    console.error('PWA: SW registration failed:', err);
  }
};

/**
 * Ask the waiting service worker to activate immediately
 */
export const activateUpdateNow = () => {
  if (!swRegistration || !swRegistration.waiting) return;
  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
};

/**
 * Show update UI
 */
const showUpdateNotification = () => {
  // Avoid duplicating banner
  if (document.querySelector('.pwa-update-notification')) return;

  const el = document.createElement('div');
  el.className = 'pwa-update-notification pwa-fade-in';
  el.innerHTML = `
    <div class="update-icon">🔄</div>
    <div class="update-content">
      <div class="update-title">Update available</div>
      <div class="update-message">A new version is ready.</div>
    </div>
    <div class="update-actions">
      <button class="update-btn">Update</button>
      <button class="dismiss-btn">Later</button>
    </div>
  `;
  document.body.appendChild(el);

  el.querySelector('.update-btn').addEventListener('click', () => {
    activateUpdateNow();
    el.remove();
  });
  el.querySelector('.dismiss-btn').addEventListener('click', () => el.remove());
};

/**
 * Guarded update check (no throw)
 */
const safeUpdateCheck = () => {
  if (!swRegistration) return;
  swRegistration.update().catch(() => {});
};

/**
 * Install prompt lifecycle
 */
export const setupInstallPrompt = () => {
  // Some browsers (iOS Safari) never fire this
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('PWA: Install prompt ready');
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA: App installed');
    deferredInstallPrompt = null;
  });
};

/**
 * Prompt user to install the PWA (must be called from a user gesture)
 * @returns {Promise<boolean>}
 */
export const installPWA = async () => {
  if (!deferredInstallPrompt) return false;
  try {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return outcome === 'accepted';
  } catch (err) {
    console.error('PWA: install failed', err);
    return false;
  }
};

/**
 * Can we show an install prompt button?
 */
export const canInstallPWA = () => !!deferredInstallPrompt;

/**
 * Is app running as PWA?
 */
export const isPWA = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true || // iOS Safari
  document.referrer.startsWith('android-app://');

/**
 * Network helpers
 */
export const isOnline = () => navigator.onLine;

export const setupNetworkMonitoring = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};
