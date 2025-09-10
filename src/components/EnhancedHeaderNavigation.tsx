"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  description: string;
}

export function EnhancedHeaderNavigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationItems: NavItem[] = [
    {
      name: "Features",
      href: "#features",
      description: "Discover our platform capabilities"
    },
    {
      name: "How It Works",
      href: "#how-it-works",
      description: "Learn the simple 3-step process"
    },
    {
      name: "Dashboard",
      href: "#dashboard",
      description: "Preview our powerful analytics"
    },
    {
      name: "Support",
      href: "#support",
      description: "Get help from our expert team"
    }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map((item) => (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={() => setHoveredItem(item.name)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link 
            href={item.href}
            className="group text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 nav-link flex items-center gap-1 py-2"
          >
            {item.name}
            <motion.div
              animate={{ 
                rotate: hoveredItem === item.name ? 180 : 0,
                scale: hoveredItem === item.name ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </Link>
          
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredItem === item.name && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
              >
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl backdrop-blur-lg whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-medium">
                    {item.description}
                  </div>
                  {/* Arrow */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link 
          href="/auth/login" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium btn-text-base"
        >
          Get Started
        </Link>
      </motion.div>
    </nav>
  );
}
