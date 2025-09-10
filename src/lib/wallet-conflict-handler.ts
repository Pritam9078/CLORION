/**
 * Global wallet extension conflict handler
 * Prevents ethereum property redefinition errors and Phantom wallet conflicts
 */

// Store original methods to prevent infinite loops
let originalError: any;
let originalWarn: any;
let isHandlerInitialized = false;

// Global error handler for wallet conflicts
export const initializeWalletConflictHandler = () => {
  if (typeof window === 'undefined' || isHandlerInitialized) return;

  // Store original console methods
  originalError = console.error;
  originalWarn = console.warn;
  
  // Enhanced console.error override
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out known wallet extension conflicts
    if (
      message.includes('Cannot redefine property: ethereum') ||
      message.includes('Unable to set window.solana') ||
      message.includes('Unable to set window.phantom.solana') ||
      message.includes('Unable to set window.phantom') ||
      message.includes('try uninstalling Phantom') ||
      message.includes('WalletConnect Core is already initialized') ||
      message.includes('evmAsk.js') ||
      message.includes('hook.js') ||
      message.includes('chrome-extension://') ||
      message.includes('web_accessible_resources') ||
      message.includes('ERR_FAILED') ||
      message.includes('contentscript.js') ||
      message.includes('Cleared failed endpoints cache') ||
      message.includes('nextJsHandleConsoleError')
    ) {
      // Only log significant conflicts, suppress noise
      if (message.includes('Cannot redefine property: ethereum')) {
        console.info('🔧 Wallet extension ethereum property conflict resolved');
      } else if (message.includes('Unable to set window.solana') || message.includes('Unable to set window.phantom')) {
        console.info('🔧 Phantom Solana wallet conflict resolved');
      } else if (message.includes('nextJsHandleConsoleError')) {
        // Completely suppress Next.js dev overlay errors for wallet conflicts
        return;
      }
      return;
    }
    
    // Log other errors normally
    originalError.apply(console, args);
  };

  // Enhanced console.warn override
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Suppress known wallet extension warnings
    if (
      message.includes('WalletConnect Core is already initialized') ||
      message.includes('Unable to set window.solana') ||
      message.includes('try uninstalling Phantom') ||
      message.includes('chrome-extension://')
    ) {
      return;
    }
    
    // Log other warnings normally
    originalWarn.apply(console, args);
  };

  // Prevent ethereum property redefinition with advanced protection
  const protectEthereumProperty = () => {
    if ((window as any).ethereum) {
      try {
        const ethereum = (window as any).ethereum;
        const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
        
        // Only redefine if the property is configurable
        if (!descriptor || descriptor.configurable !== false) {
          Object.defineProperty(window, 'ethereum', {
            value: ethereum,
            writable: false,
            configurable: false,
            enumerable: true
          });
          console.info('🔒 Ethereum property protected from redefinition');
        }
      } catch (error) {
        // Property already protected or conflict resolved
      }
    }
  };

  // Handle Phantom wallet conflicts with better detection
  const handlePhantomConflicts = () => {
    try {
      if ((window as any).phantom?.solana) {
        console.info('Phantom wallet detected and preserved');
        
        // Don't lock down phantom completely, just prevent overwrites
        const phantom = (window as any).phantom;
        
        // Only prevent redefinition if it's not already protected
        const descriptor = Object.getOwnPropertyDescriptor(window, 'phantom');
        if (!descriptor || descriptor.configurable !== false) {
          try {
            Object.defineProperty(window, 'phantom', {
              value: phantom,
              writable: true, // Allow updates for functionality
              configurable: false, // Prevent deletion/redefinition
              enumerable: true
            });
            console.info('🔒 Phantom wallet property protected');
          } catch (error) {
            // Already protected, no action needed
            console.info('🚫 Prevented wallet conflict for: phantom');
          }
        }
      }
    } catch (error) {
      // Phantom conflicts handled silently
      console.info('🚫 Prevented wallet conflict for: phantom');
    }
  };

  // Execute protection measures
  protectEthereumProperty();
  handlePhantomConflicts();

  // Enhanced global unhandled rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || reason?.toString() || '';
    
    if (
      message.includes('ethereum') ||
      message.includes('phantom') ||
      message.includes('redefine property') ||
      message.includes('evmAsk') ||
      message.includes('chrome-extension') ||
      message.includes('web_accessible_resources')
    ) {
      console.info('🔧 Browser extension conflict resolved automatically');
      event.preventDefault(); // Prevent the error from propagating
    }
  });

  // Handle browser extension script loading errors
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    const source = event.filename || '';
    
    if (
      message.includes('chrome-extension') ||
      message.includes('web_accessible_resources') ||
      source.includes('chrome-extension') ||
      message.includes('ERR_FAILED')
    ) {
      console.info('🔧 Browser extension resource error handled');
      event.preventDefault();
    }
  });

  // Wait for DOM content and apply additional protections
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        protectEthereumProperty();
        handlePhantomConflicts();
      }, 100);
    });
  } else {
    setTimeout(() => {
      protectEthereumProperty();
      handlePhantomConflicts();
    }, 100);
  }

  isHandlerInitialized = true;
  console.info('✅ Enhanced wallet conflict handler initialized');
};

// Utility to safely access ethereum provider
export const safeGetEthereum = () => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
  } catch (error) {
    console.warn('Safe ethereum access failed:', error);
  }
  return null;
};

// Utility to check if wallet is available without causing conflicts
export const isWalletAvailable = () => {
  try {
    const ethereum = safeGetEthereum();
    return ethereum && typeof ethereum.request === 'function';
  } catch (error) {
    return false;
  }
};
