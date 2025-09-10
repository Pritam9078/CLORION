"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex items-center justify-center"
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 120, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl"
            />
          </div>

          {/* Main Loading Content */}
          <div className="relative flex flex-col items-center space-y-8">
            {/* Floating Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0],
              }}
              transition={{
                scale: { duration: 1, ease: "easeOut" },
                rotate: { duration: 1, ease: "easeOut" },
                y: { 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="relative"
            >
              {/* Logo container with better visibility */}
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-gray-200/20 p-3">
                <motion.img 
                  src="/clorion-logo.png" 
                  alt="CLORIT Logo" 
                  className="w-full h-full object-contain"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              </div>
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl -z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl -z-20 scale-110" />
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-green-700 bg-clip-text text-transparent">
                CLORIT
              </h1>
              <p className="text-gray-600 mt-2 font-light">
                Blue Carbon Registry
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-64 bg-gray-200/50 rounded-full h-1 overflow-hidden backdrop-blur-sm"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-gray-500 text-sm font-light"
            >
              Loading experience...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
