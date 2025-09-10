"use client";

import { motion } from 'framer-motion';

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating orb - top left */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"
      />

      {/* Medium floating orb - top right */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-lg"
      />

      {/* Small floating orb - bottom left */}
      <motion.div
        animate={{
          x: [0, 70, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-br from-purple-400/12 to-pink-400/12 rounded-full blur-lg"
      />

      {/* Large floating orb - bottom right */}
      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/8 to-green-400/8 rounded-full blur-2xl"
      />

      {/* Geometric shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-1/3 left-1/4 w-16 h-16 border border-blue-300/20 rounded-lg transform rotate-45"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          x: [0, -25, 0],
          y: [0, 35, 0],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full"
      />
    </div>
  );
}

export function GlassmorphismCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ 
        y: -5,
        scale: 1.02,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`backdrop-blur-sm bg-white/60 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
