"use client";

import { useEffect } from 'react';
import { ensureCryptoRandomUUID } from '@/lib/crypto-polyfill';
import { ResourceBlocker } from '@/lib/resource-blocker';
import { initializeWalletConflictHandler } from '@/lib/wallet-conflict-handler';
import { initializePhantomErrorSuppression } from '@/lib/phantom-error-suppression';

export function ClientInitializer() {
  useEffect(() => {
    // Initialize Phantom error suppression first (most specific)
    initializePhantomErrorSuppression();
    
    // Initialize wallet conflict handler
    initializeWalletConflictHandler();
    
    // Ensure crypto polyfill is loaded
    ensureCryptoRandomUUID();
    
    // Initialize advanced resource blocking
    ResourceBlocker.getInstance();
    
    // Additional aggressive cleanup
    const cleanupInterval = setInterval(() => {
      // Remove any Reown font links that might have been added dynamically
      const reownLinks = document.querySelectorAll('link[href*="fonts.reown.com"]');
      reownLinks.forEach(link => link.remove());
      
      // Remove any preload links with font type
      const fontPreloads = document.querySelectorAll('link[rel="preload"][as="font"]');
      fontPreloads.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('reown') || href.includes('web3modal')) {
          link.remove();
        }
      });
    }, 500);
    
    // Override console errors for blocked resources
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      
      // Suppress specific Web3 font loading errors and wallet conflicts
      if (message.includes('fonts.reown.com') || 
          message.includes('Failed to load resource') ||
          message.includes('cca-lite.coinbase.com') ||
          message.includes('Cannot redefine property: ethereum') ||
          message.includes('Unable to set window.solana') ||
          message.includes('Unable to set window.phantom') ||
          message.includes('try uninstalling Phantom') ||
          message.includes('nextJsHandleConsoleError') ||
          message.includes('contentscript.js') ||
          message.includes('Cleared failed endpoints cache') ||
          message.includes('pages-dev-overlay-setup.js') ||
          message.includes('In HTML') ||
          message.includes('cannot be a descendant of') ||
          message.includes('cannot contain a nested')) {
        return; // Silently ignore these errors
      }
      
      originalError.apply(console, args);
    };
    
    console.log('🚀 CLORIT initialized with advanced resource blocking');
    
    // Cleanup on unmount
    return () => {
      clearInterval(cleanupInterval);
      console.error = originalError;
    };
  }, []);

  return null;
}
