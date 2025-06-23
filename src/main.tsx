
import React from 'react';
import { createRoot } from 'react-dom/client';
import { validateReactModule } from './utils/reactValidation';
import App from './App.tsx';
import './index.css';

// Validate React module before doing anything else
try {
  validateReactModule();
  console.log('React validation passed in main.tsx');
} catch (error) {
  console.error('Critical React validation error:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>React module failed to load properly. Please refresh the page.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
    </div>
  `;
  throw error;
}

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
