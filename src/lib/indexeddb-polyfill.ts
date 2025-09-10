/**
 * IndexedDB Polyfill for SSR environments
 * Prevents "indexedDB is not defined" errors during server-side rendering
 */

if (typeof global !== 'undefined' && !global.indexedDB) {
  // Mock IndexedDB for server-side rendering
  const mockIndexedDB = {
    open: () => ({
      addEventListener: () => {},
      removeEventListener: () => {},
      result: {
        createObjectStore: () => ({}),
        deleteObjectStore: () => {},
        transaction: () => ({
          objectStore: () => ({
            add: () => ({ addEventListener: () => {} }),
            put: () => ({ addEventListener: () => {} }),
            get: () => ({ addEventListener: () => {} }),
            delete: () => ({ addEventListener: () => {} }),
            clear: () => ({ addEventListener: () => {} }),
            count: () => ({ addEventListener: () => {} }),
            getAll: () => ({ addEventListener: () => {} }),
            getAllKeys: () => ({ addEventListener: () => {} }),
            index: () => ({
              get: () => ({ addEventListener: () => {} }),
              getAll: () => ({ addEventListener: () => {} }),
              getAllKeys: () => ({ addEventListener: () => {} }),
              count: () => ({ addEventListener: () => {} })
            }),
            createIndex: () => {},
            deleteIndex: () => {}
          }),
          addEventListener: () => {},
          removeEventListener: () => {}
        })
      }
    }),
    deleteDatabase: () => ({ addEventListener: () => {} }),
    databases: () => Promise.resolve([])
  };

  global.indexedDB = mockIndexedDB as any;
  
  console.info('✅ IndexedDB polyfill initialized for SSR');
}

// Also add for window object in browser
if (typeof window !== 'undefined' && !window.indexedDB) {
  // This should rarely happen in modern browsers, but just in case
  const mockIndexedDB = {
    open: () => ({
      addEventListener: () => {},
      removeEventListener: () => {},
      result: null
    }),
    deleteDatabase: () => ({ addEventListener: () => {} }),
    databases: () => Promise.resolve([])
  };

  (window as any).indexedDB = mockIndexedDB;
  console.info('✅ IndexedDB polyfill initialized for browser');
}

export {};
