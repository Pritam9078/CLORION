"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  PlusCircle, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  HelpCircle, 
  Code, 
  Users, 
  Info, 
  Mail as MailIcon, 
  Shield, 
  FileCheck,
  Mail
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function EnhancedFooterNavigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navigationSections: NavSection[] = [
    {
      title: "Platform",
      items: [
        {
          name: "Marketplace",
          href: "/marketplace",
          description: "Browse and trade carbon credits easily",
          icon: ShoppingCart
        },
        {
          name: "Register Project",
          href: "/auth/register",
          description: "Start your blue carbon project today",
          icon: PlusCircle
        },
        {
          name: "Dashboard",
          href: "/dashboard",
          description: "View your projects, credits, and stats",
          icon: BarChart3
        },
        {
          name: "Analytics",
          href: "/analytics",
          description: "Track performance and trends at a glance",
          icon: TrendingUp
        }
      ]
    },
    {
      title: "Resources",
      items: [
        {
          name: "Documentation",
          href: "/docs",
          description: "Learn how to integrate and use CLORIT APIs",
          icon: FileText
        },
        {
          name: "Help Center",
          href: "/help",
          description: "Get support and find answers quickly",
          icon: HelpCircle
        },
        {
          name: "API",
          href: "/api",
          description: "Integrate CLORIT into your applications",
          icon: Code
        },
        {
          name: "Community",
          href: "/community",
          description: "Connect with developers and users",
          icon: Users
        }
      ]
    },
    {
      title: "Company",
      items: [
        {
          name: "About",
          href: "/about",
          description: "Learn about our mission and team",
          icon: Info
        },
        {
          name: "Contact",
          href: "/contact",
          description: "Get in touch with our team",
          icon: MailIcon
        },
        {
          name: "Privacy",
          href: "/privacy",
          description: "How we protect your data",
          icon: Shield
        },
        {
          name: "Terms",
          href: "/terms",
          description: "Terms of service and usage",
          icon: FileCheck
        }
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:clorit2025@gmail.com',
      description: 'Email CLORION Support'
    }
  ];

  const handleSocialClick = (url: string) => {
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {navigationSections.map((section) => (
        <div key={section.title}>
          <h4 className="font-bold mb-4 text-white">{section.title}</h4>
          <ul className="space-y-3">
            {section.items.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className="group flex items-start gap-2 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredItem(`${section.title}-${item.name}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    initial={{ scale: 1, opacity: 0.7 }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <item.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {item.name}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: hoveredItem === `${section.title}-${item.name}` ? 1 : 0,
                          scale: hoveredItem === `${section.title}-${item.name}` ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                    </div>
                    <AnimatePresence>
                      {hoveredItem === `${section.title}-${item.name}` && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -5 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -5 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="text-xs text-gray-500 mt-1 leading-relaxed"
                        >
                          {item.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Enhanced Connect Section */}
      <div>
        <h4 className="font-bold mb-4 text-white">Connect</h4>
        <div className="space-y-3">
          {socialLinks.map((social) => (
            <div key={social.name} className="relative">
              <button
                onClick={() => handleSocialClick(social.url)}
                className="group flex items-start gap-2 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer w-full text-left"
                onMouseEnter={() => setHoveredItem(`Connect-${social.name}`)}
                onMouseLeave={() => setHoveredItem(null)}
                aria-label={social.description}
              >
                <motion.div
                  initial={{ scale: 1, opacity: 0.7 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="mt-0.5 flex-shrink-0"
                >
                  <social.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </motion.div>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {social.name}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: hoveredItem === `Connect-${social.name}` ? 1 : 0,
                        scale: hoveredItem === `Connect-${social.name}` ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                    />
                  </div>
                  <AnimatePresence>
                    {hoveredItem === `Connect-${social.name}` && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -5 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-xs text-gray-500 mt-1 leading-relaxed"
                      >
                        {social.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
