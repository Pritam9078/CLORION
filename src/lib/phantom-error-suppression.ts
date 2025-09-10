/**
 * Phantom Wallet Error Suppression Utility
 * Specifically handles Next.js dev overlay errors related to Phantom wallet
 */

export const initializePhantomErrorSuppression = () => {
  if (typeof window === 'undefined') return;

  // Store original console methods
  const originalConsoleError = window.console.error;
  const originalConsoleWarn = window.console.warn;

  // Override console.error to suppress Phantom-specific errors
  window.console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Phantom wallet specific error patterns
    const phantomErrorPatterns = [
      'Unable to set window.solana, try uninstalling Phantom',
      'Unable to set window.phantom.solana, try uninstalling Phantom',
      'Unable to set window.phantom',
      'nextJsHandleConsoleError',
      'pages-dev-overlay-setup.js',
      'contentscript.js',
      'Cleared failed endpoints cache'
    ];

    // Check if this is a Phantom-related error
    const isPhantomError = phantomErrorPatterns.some(pattern => 
      message.includes(pattern)
    );

    if (isPhantomError) {
      // Completely suppress these errors in development
      return;
    }

    // Call original console.error for non-Phantom errors
    originalConsoleError.apply(window.console, args);
  };

  // Also suppress warnings
  window.console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    const phantomWarningPatterns = [
      'try uninstalling Phantom',
      'Phantom wallet',
      'window.solana',
      'window.phantom'
    ];

    const isPhantomWarning = phantomWarningPatterns.some(pattern => 
      message.includes(pattern)
    );

    if (isPhantomWarning) {
      return;
    }

    originalConsoleWarn.apply(window.console, args);
  };

  // Handle Next.js specific errors
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('error', (event) => {
      const message = event.message || '';
      const source = event.filename || '';
      
      // Suppress Next.js dev overlay errors for Phantom
      if (
        message.includes('Unable to set window.solana') ||
        message.includes('Unable to set window.phantom') ||
        source.includes('pages-dev-overlay-setup.js') ||
        source.includes('contentscript.js')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message = reason?.message || reason?.toString() || '';
      
      if (
        message.includes('window.solana') ||
        message.includes('window.phantom') ||
        message.includes('Phantom')
      ) {
        event.preventDefault();
      }
    });
  }

  console.info('🔧 Phantom wallet error suppression initialized');
};

// Additional utility to check if Phantom is installed without errors
export const isPhantomInstalled = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    // Check for Phantom without triggering errors
    const phantom = (window as any).phantom;
    return phantom && phantom.solana && phantom.solana.isPhantom;
  } catch (error) {
    // Silent fail
    return false;
  }
};

// Safe way to get Phantom provider
export const getPhantomProvider = () => {
  try {
    if (typeof window === 'undefined') return null;
    
    const phantom = (window as any).phantom;
    if (phantom && phantom.solana && phantom.solana.isPhantom) {
      return phantom.solana;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
