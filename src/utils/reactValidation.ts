
import React from 'react';

export const validateReactModule = () => {
  if (!React) {
    console.error('React module is null or undefined');
    throw new Error('React module is not properly loaded');
  }
  
  if (typeof React.useState !== 'function') {
    console.error('React.useState is not available');
    throw new Error('React hooks are not available');
  }
  
  if (typeof React.useEffect !== 'function') {
    console.error('React.useEffect is not available');
    throw new Error('React hooks are not available');
  }
  
  if (typeof React.createContext !== 'function') {
    console.error('React.createContext is not available');
    throw new Error('React context API is not available');
  }
  
  console.log('React module validation passed');
  return true;
};
