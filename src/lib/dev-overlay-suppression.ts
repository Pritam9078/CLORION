/**
 * Next.js Dev Overlay Error Suppression
 * Specifically targets the pages-dev-overlay-setup.js errors
 */

declare global {
  interface Window {
    __nextDevOverlayErrorSuppression?: boolean;
  }
}

export const suppressDevOverlayWalletErrors = () => {
  if (typeof window === 'undefined' || window.__nextDevOverlayErrorSuppression) {
    return;
  }

  // Mark as initialized
  window.__nextDevOverlayErrorSuppression = true;

  // Target the specific Next.js dev overlay error handler
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Override console.error
  console.error = function(...args: any[]) {
    const message = args.join(' ');
    const stack = new Error().stack || '';

    // Check if this error comes from Next.js dev overlay
    const isNextJsDevOverlay = stack.includes('pages-dev-overlay-setup.js') || 
                               stack.includes('nextJsHandleConsoleError') ||
                               message.includes('nextJsHandleConsoleError');

    // Specific Phantom wallet errors
    const isPhantomError = message.includes('Unable to set window.solana') ||
                           message.includes('Unable to set window.phantom') ||
                           message.includes('try uninstalling Phantom');

    // Content script errors
    const isContentScriptError = message.includes('contentscript.js') ||
                                  message.includes('Cleared failed endpoints cache');

    if ((isNextJsDevOverlay && isPhantomError) || isContentScriptError) {
      // Completely suppress these specific errors
      return;
    }

    // Call original for other errors
    originalConsoleError.apply(this, args);
  };

  // Override console.warn
  console.warn = function(...args: any[]) {
    const message = args.join(' ');
    
    const isPhantomWarning = message.includes('Phantom') ||
                             message.includes('window.solana') ||
                             message.includes('window.phantom');

    if (isPhantomWarning) {
      return;
    }

    originalConsoleWarn.apply(this, args);
  };

  // Intercept and modify Next.js error handling
  const interceptNextJsErrors = () => {
    // Look for Next.js error handling functions and wrap them
    if (typeof window !== 'undefined') {
      const originalAddEventListener = window.addEventListener;
      
      window.addEventListener = function(
        type: string, 
        listener: EventListenerOrEventListenerObject | null, 
        options?: boolean | AddEventListenerOptions
      ) {
        if (type === 'error' || type === 'unhandledrejection') {
          const wrappedListener = function(event: Event) {
            const errorEvent = event as ErrorEvent;
            const rejectionEvent = event as PromiseRejectionEvent;
            const message = errorEvent.message || rejectionEvent.reason?.message || '';
            
            if (message.includes('Unable to set window.solana') ||
                message.includes('Unable to set window.phantom')) {
              // Prevent the error from bubbling up
              event.preventDefault();
              event.stopPropagation();
              return false;
            }
            
            if (typeof listener === 'function') {
              return (listener as EventListener).call(window, event);
            } else if (listener && typeof listener === 'object' && 'handleEvent' in listener) {
              return listener.handleEvent(event);
            }
          };
          
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        
        if (listener) {
          return originalAddEventListener.call(this, type, listener, options);
        }
      };
    }
  };

  // Apply immediately
  interceptNextJsErrors();

  // Also apply after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', interceptNextJsErrors);
  }

  console.info('🔧 Next.js dev overlay wallet error suppression active');
};

// Auto-initialize if in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  suppressDevOverlayWalletErrors();
}
