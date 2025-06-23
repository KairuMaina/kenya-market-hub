
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple React validation
function validateReact() {
  if (!React || typeof React.useState !== 'function') {
    throw new Error('React module failed to load');
  }
  return true;
}

// Validate React
try {
  validateReact();
  console.log('✅ React validation passed');
} catch (error) {
  console.error('❌ React validation error:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; background: #fee; color: #c00;">
      <h1>Application Error</h1>
      <p>React module failed to load properly. Please refresh the page.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #c00; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
    </div>
  `;
  throw error;
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
