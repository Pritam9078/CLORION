/**
 * Immediate error suppression script
 * This runs as early as possible to catch Phantom wallet errors
 */

(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Phantom wallet error patterns
  const phantomErrorPatterns = [
    'Unable to set window.solana, try uninstalling Phantom',
    'Unable to set window.phantom.solana, try uninstalling Phantom',
    'Unable to set window.phantom',
    'nextJsHandleConsoleError',
    'pages-dev-overlay-setup.js',
    'contentscript.js',
    'Cleared failed endpoints cache'
  ];
  
  // Override console.error immediately
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Check if this is a Phantom-related error
    for (const pattern of phantomErrorPatterns) {
      if (message.includes(pattern)) {
        // Silently suppress these errors
        return;
      }
    }
    
    // Call original for other errors
    originalError.apply(console, args);
  };
  
  // Override console.warn
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('Phantom') || 
        message.includes('window.solana') || 
        message.includes('window.phantom')) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
  
  // Handle window errors
  window.addEventListener('error', function(event) {
    const message = event.message || '';
    
    if (message.includes('Unable to set window.solana') ||
        message.includes('Unable to set window.phantom')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    const message = reason?.message || reason?.toString() || '';
    
    if (message.includes('window.solana') ||
        message.includes('window.phantom')) {
      event.preventDefault();
    }
  });
  
})();
