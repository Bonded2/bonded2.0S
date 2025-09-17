import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style/main.scss';
import { initializePWA, setupInstallPrompt } from './utils/pwa';

const initApp = async () => {
  setupInstallPrompt();
  await initializePWA();
};

initApp().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
