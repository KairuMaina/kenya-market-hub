
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Critical React validation before doing anything
function validateReact() {
  if (!React) {
    throw new Error('React module failed to load');
  }
  if (typeof React.useState !== 'function') {
    throw new Error('React hooks not available');
  }
  if (typeof React.useEffect !== 'function') {
    throw new Error('React useEffect not available');
  }
  return true;
}

// Validate React immediately
try {
  validateReact();
  console.log('✅ React validation passed in main.tsx');
} catch (error) {
  console.error('❌ Critical React validation error:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; background: #fee; color: #c00;">
      <h1>Application Error</h1>
      <p>React module failed to load properly. Please refresh the page.</p>
      <p style="font-size: 12px; margin-top: 20px;">Error: ${error.message}</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #c00; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
    </div>
  `;
  throw error;
}

// Service worker registration
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
