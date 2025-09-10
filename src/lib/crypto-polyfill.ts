// Crypto polyfill for crypto.randomUUID
import { v4 as uuidv4 } from 'uuid';

// Polyfill for crypto.randomUUID if not available
export function ensureCryptoRandomUUID() {
  if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
    (window.crypto as any).randomUUID = function() {
      return uuidv4() as `${string}-${string}-${string}-${string}-${string}`;
    };
  }
  
  // For Node.js environments
  if (typeof global !== 'undefined' && global.crypto && !global.crypto.randomUUID) {
    (global.crypto as any).randomUUID = function() {
      return uuidv4() as `${string}-${string}-${string}-${string}-${string}`;
    };
  }
  
  // Ensure crypto exists globally with fallback
  if (typeof globalThis !== 'undefined' && !globalThis.crypto) {
    (globalThis as any).crypto = {
      randomUUID: () => uuidv4()
    };
  }
}

// Safe randomUUID function that works everywhere
export function safeRandomUUID(): string {
  // Use the fallback pattern mentioned in the error
  return (crypto?.randomUUID?.() ?? uuidv4());
}

// Initialize the polyfill
ensureCryptoRandomUUID();
