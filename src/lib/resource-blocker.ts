/**
 * Advanced resource blocker to prevent unnecessary Web3 resource loading
 * This will completely eliminate font preloading and API call warnings
 */

export class ResourceBlocker {
  private static instance: ResourceBlocker;
  private blockedUrls: Set<string> = new Set();
  private originalFetch: typeof fetch;

  constructor() {
    this.originalFetch = window.fetch;
    this.initializeBlocking();
    this.preventEthereumConflicts();
  }

  static getInstance(): ResourceBlocker {
    if (!ResourceBlocker.instance) {
      ResourceBlocker.instance = new ResourceBlocker();
    }
    return ResourceBlocker.instance;
  }

  private initializeBlocking() {
    // Block font preloading
    this.blockFontPreloading();
    
    // Block unnecessary API calls
    this.blockUnnecessaryAPICalls();
    
    // Block resource hints
    this.blockResourceHints();
    
    // Clean up existing problematic elements
    this.cleanupExistingElements();
  }

  private blockFontPreloading() {
    // Override link creation to prevent font preloading
    const originalCreateElement = document.createElement;
    
    document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
      const element = originalCreateElement.call(this, tagName, options) as HTMLElement;
      
      if (tagName.toLowerCase() === 'link') {
        const linkElement = element as HTMLLinkElement;
        
        // Block Reown font preloading
        const originalSetAttribute = linkElement.setAttribute.bind(linkElement);
        linkElement.setAttribute = function(name: string, value: string) {
          if (name === 'href' && value.includes('fonts.reown.com')) {
            console.log('🚫 Blocked Reown font preload:', value);
            return;
          }
          originalSetAttribute(name, value);
        };
      }
      
      return element;
    };
  }

  private blockUnnecessaryAPICalls() {
    // Override fetch to block problematic requests
    window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString();
      
      // Block Coinbase tracking and metrics
      if (this.shouldBlockUrl(url)) {
        console.log('🚫 Blocked unnecessary request:', url);
        return Promise.reject(new Error(`Blocked request to ${url}`));
      }
      
      return this.originalFetch.call(window, input, init);
    };
  }

  private shouldBlockUrl(url: string): boolean {
    const blockedPatterns = [
      'cca-lite.coinbase.com',
      'metrics',
      'analytics',
      'tracking',
      'fonts.reown.com',
      'web3modal.com/fonts',
      'walletconnect.com/fonts'
    ];
    
    return blockedPatterns.some(pattern => url.includes(pattern));
  }

  private blockResourceHints() {
    // Prevent resource hints from being added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Remove problematic link elements
            if (element.tagName === 'LINK') {
              const linkElement = element as HTMLLinkElement;
              const href = linkElement.href || '';
              
              if (href.includes('fonts.reown.com') || 
                  href.includes('web3modal.com') ||
                  href.includes('_next/static/media') ||
                  (linkElement.rel === 'preload' && linkElement.as === 'font' && 
                   (href.includes('.woff2') || href.includes('.woff')))) {
                console.info('🚫 Blocked problematic resource:', href.split('/').pop());
                element.remove();
              }
            }
          }
        });
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true
    });
  }

  private cleanupExistingElements() {
    // Remove existing problematic elements
    const removeProblematicLinks = () => {
      const links = document.querySelectorAll('link[href*="fonts.reown.com"], link[href*="web3modal.com"]');
      links.forEach(link => {
        console.log('🚫 Cleaned up existing problematic link:', link.getAttribute('href'));
        link.remove();
      });
    };

    // Run immediately and periodically
    removeProblematicLinks();
    setInterval(removeProblematicLinks, 1000);
  }

  public addBlockedUrl(url: string) {
    this.blockedUrls.add(url);
  }

  public removeBlockedUrl(url: string) {
    this.blockedUrls.delete(url);
  }

  private preventEthereumConflicts() {
    // Prevent multiple wallet extensions from conflicting
    if (typeof window !== 'undefined') {
      // Store the original ethereum object if it exists
      const originalEthereum = (window as any).ethereum;
      
      // Override Object.defineProperty for the ethereum property
      const originalDefineProperty = Object.defineProperty;
      Object.defineProperty = function(obj: any, prop: string, descriptor: PropertyDescriptor) {
        // If trying to redefine window.ethereum, silently ignore
        if (obj === window && prop === 'ethereum') {
          console.log('🚫 Prevented ethereum redefinition conflict');
          return originalEthereum || obj;
        }
        
        // For Phantom wallet conflicts
        if (prop === 'solana' || prop === 'phantom') {
          console.log('🚫 Prevented wallet conflict for:', prop);
          return obj;
        }
        
        return originalDefineProperty.call(this, obj, prop, descriptor);
      };
      
      // Suppress specific errors
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args[0]?.toString() || '';
        
        if (message.includes('Cannot redefine property: ethereum') ||
            message.includes('Unable to set window.solana') ||
            message.includes('Unable to set window.phantom')) {
          return; // Silently ignore these wallet conflicts
        }
        
        originalConsoleError.apply(console, args);
      };
    }
  }
}

// Initialize the resource blocker
if (typeof window !== 'undefined') {
  ResourceBlocker.getInstance();
}
