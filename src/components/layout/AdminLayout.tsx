"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard,
  Folder,
  ShieldCheck,
  Satellite,
  Building,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  User,
  Settings,
  LogOut,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: string[];
}

const adminMenu: MenuItem[] = [
  { 
    name: "Dashboard", 
    path: "/admin/dashboard", 
    icon: LayoutDashboard,
    roles: ["ADMIN", "VERIFIER"]
  },
  { 
    name: "Projects", 
    path: "/admin/projects", 
    icon: Folder,
    badge: "12",
    roles: ["ADMIN", "VERIFIER"]
  },
  { 
    name: "Verification", 
    path: "/admin/verification", 
    icon: ShieldCheck,
    badge: "3",
    roles: ["ADMIN", "VERIFIER"]
  },
  { 
    name: "Satellite Analysis", 
    path: "/admin/satellite-analysis", 
    icon: Satellite,
    roles: ["ADMIN", "VERIFIER"]
  },
  { 
    name: "Enterprises", 
    path: "/admin/enterprises", 
    icon: Building,
    roles: ["ADMIN"]
  },
  { 
    name: "Analytics", 
    path: "/admin/analytics", 
    icon: BarChart3,
    roles: ["ADMIN", "VERIFIER"]
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Filter menu items based on user role
  const filteredMenu = adminMenu.filter(item => 
    item.roles.includes(user?.role || "")
  );

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-75 animate-pulse" />
            <img 
              src="/clorion-logo.png" 
              alt="CLORION" 
              className="relative w-8 h-8 rounded-lg object-contain"
            />
          </div>
          <div className={cn("transition-all duration-300", 
            sidebarOpen || isMobile ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CLORION
            </span>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300",
              sidebarOpen ? "rotate-0" : "rotate-180"
            )} />
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className={cn("p-4 border-b border-gray-700 transition-all duration-300",
        sidebarOpen || isMobile ? "opacity-100" : "opacity-0 h-16 overflow-hidden"
      )}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "admin@clorion.com"}
            </p>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400 text-xs">
            {user?.role || "ADMIN"}
          </Badge>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r"
                    initial={false}
                  />
                )}
                
                {/* Hover glow effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isActive && "opacity-30"
                )} />
                
                <Icon className={cn("w-5 h-5 relative z-10 transition-colors duration-200",
                  isActive ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400"
                )} />
                
                <span className={cn("relative z-10 font-medium transition-all duration-300",
                  sidebarOpen || isMobile ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                )}>
                  {item.name}
                </span>
                
                {item.badge && (sidebarOpen || isMobile) && (
                  <Badge className={cn("ml-auto text-xs relative z-10",
                    isActive 
                      ? "bg-cyan-500 text-white" 
                      : "bg-gray-600 text-gray-300 group-hover:bg-cyan-500 group-hover:text-white"
                  )}>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200",
            sidebarOpen || isMobile ? "justify-start" : "justify-center"
          )}
        >
          <Settings className="w-4 h-4" />
          <span className={cn("transition-all duration-300",
            sidebarOpen || isMobile ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            Settings
          </span>
        </Link>
        
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
            sidebarOpen || isMobile ? "justify-start" : "justify-center"
          )}
        >
          <LogOut className="w-4 h-4" />
          <span className={cn("transition-all duration-300",
            sidebarOpen || isMobile ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-slate-800/95 backdrop-blur-sm border-r border-gray-700 relative z-10"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-80 h-full bg-slate-800/95 backdrop-blur-sm border-r border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/clorion-logo.png" 
                    alt="CLORION" 
                    className="w-8 h-8 rounded-lg object-contain"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    CLORION
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <SidebarContent isMobile />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-slate-800/95 backdrop-blur-sm border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/clorion-logo.png" 
                alt="CLORION" 
                className="w-6 h-6 rounded object-contain"
              />
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CLORION
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <ProfileDropdown isDarkMode={true} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
      </div>
    </div>
  );
}
