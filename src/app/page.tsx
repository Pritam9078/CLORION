"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Shield, TrendingUp, Users, Globe, Zap, Sparkles, Award, BarChart3, CheckCircle, Star, Mail } from "lucide-react";
import { Preloader } from "@/components/Preloader";
import { FloatingShapes, GlassmorphismCard } from "@/components/FloatingShapes";
import { CustomerSupport } from "@/components/CustomerSupport";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnhancedFooterNavigation } from "@/components/EnhancedFooterNavigation";
import { EnhancedHeaderNavigation } from "@/components/EnhancedHeaderNavigation";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="min-h-screen bg-white relative overflow-hidden"
      >
        {/* Floating Background Elements */}
        <FloatingShapes />

        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/70 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <img 
                  src="/clorion-logo.png" 
                  alt="CLORION Logo" 
                  className="w-10 h-10 rounded-xl object-contain"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-green-700 bg-clip-text text-transparent nav-brand">
                  CLORION
                </h1>
              </motion.div>
              
              <EnhancedHeaderNavigation />
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative py-32 px-4">
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200/30 mb-8"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent badge-text">
                    Blockchain-Powered Carbon Registry
                  </span>
                </motion.div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-h1 leading-tight mb-8"
              >
                Blue Carbon Registry for a{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  Sustainable Future
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="text-body-large max-w-3xl mx-auto mb-12"
              >
                Harness the power of blockchain technology and satellite monitoring to create, 
                verify, and trade blue carbon credits from mangroves, seagrass, and wetland ecosystems.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/auth/register" 
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden btn-text-large"
                  >
                    <span className="relative z-10">Start Your Project</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/marketplace" 
                    className="group border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 backdrop-blur-sm btn-text-large"
                  >
                    Explore Marketplace
                  </Link>
                </motion.div>
              </motion.div>

              {/* Floating Action Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="mt-16"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex flex-col items-center gap-2 text-gray-400"
                >
                  <span className="text-sm font-light">Scroll to explore</span>
                  <div className="w-6 h-10 border-2 border-gray-300 rounded-full relative">
                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1 h-3 bg-gray-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: "Projects Registered", value: "150+", icon: Leaf, color: "from-green-500 to-emerald-600" },
                { label: "CO₂ Captured", value: "50,000t", icon: TrendingUp, color: "from-blue-500 to-cyan-600" },
                { label: "Credits Issued", value: "45,000", icon: Shield, color: "from-purple-500 to-violet-600" },
                { label: "Active Traders", value: "1,200+", icon: Users, color: "from-pink-500 to-rose-600" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div 
                    className="stat-number mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 relative">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-h2 mb-6">
                Revolutionizing{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Carbon Markets
                </span>
              </h2>
              <p className="text-body-large max-w-3xl mx-auto">
                Our comprehensive platform combines cutting-edge technology with environmental science 
                to create a transparent, efficient carbon credit ecosystem.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Blockchain Security",
                  description: "Immutable verification and transparent tracking of all carbon credits using smart contracts.",
                  color: "from-blue-500 to-cyan-600"
                },
                {
                  icon: Globe,
                  title: "Satellite Monitoring",
                  description: "Real-time ecosystem health tracking using advanced satellite imagery and AI analysis.",
                  color: "from-green-500 to-emerald-600"
                },
                {
                  icon: TrendingUp,
                  title: "Automated MRV",
                  description: "Streamlined monitoring, reporting, and verification processes with minimal manual intervention.",
                  color: "from-purple-500 to-violet-600"
                },
                {
                  icon: Award,
                  title: "Verified Credits",
                  description: "Government-audited carbon credits with international compliance and recognition.",
                  color: "from-amber-500 to-orange-600"
                },
                {
                  icon: BarChart3,
                  title: "Market Analytics",
                  description: "Advanced trading tools and market insights for optimal carbon credit portfolio management.",
                  color: "from-pink-500 to-rose-600"
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  description: "Connect with environmental projects, verifiers, and traders in a collaborative ecosystem.",
                  color: "from-indigo-500 to-blue-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassmorphismCard className="p-8 h-full">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-h4 mb-4">{feature.title}</h3>
                    <p className="text-body leading-relaxed">{feature.description}</p>
                  </GlassmorphismCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple, transparent, and efficient process from project registration to credit trading.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Register Project",
                  description: "Upload your blue carbon project details, including GIS boundaries, ecosystem type, and baseline measurements.",
                  icon: Leaf
                },
                {
                  step: "02", 
                  title: "Verification",
                  description: "Our satellite-powered MRV system monitors your project and generates verification reports for government audit.",
                  icon: Shield
                },
                {
                  step: "03",
                  title: "Earn & Trade",
                  description: "Receive tokenized carbon credits on blockchain and trade them on our secure marketplace platform.",
                  icon: TrendingUp
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <GlassmorphismCard className="p-8 text-center relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="text-blue-600 font-bold text-lg mb-2">Step {step.step}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </GlassmorphismCard>

                  {/* Connection line for desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 origin-left"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Showcase */}
        <section id="dashboard" className="py-24 px-4 relative">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Powerful{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Manage your carbon portfolio, track performance, and access market insights 
                through our intuitive and comprehensive dashboard.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-8">
                  {[
                    {
                      icon: BarChart3,
                      title: "Advanced Analytics",
                      description: "Track your portfolio performance with real-time charts and comprehensive reporting."
                    },
                    {
                      icon: TrendingUp,
                      title: "Market Insights",
                      description: "Stay ahead with market trends, price predictions, and trading opportunities."
                    },
                    {
                      icon: CheckCircle,
                      title: "Automated Verification",
                      description: "Monitor project health and verification status with satellite data integration."
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4"
                    >
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <GlassmorphismCard className="p-8">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Portfolio Overview</h3>
                      <Star className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold">$294,580</div>
                        <div className="text-gray-300 text-sm">Total Value</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">+12.4%</div>
                        <div className="text-gray-300 text-sm">Monthly Return</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {["Mangrove Credits", "Seagrass Credits", "Salt Marsh Credits"].map((credit, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300">{credit}</span>
                          <span className="font-medium">{Math.floor(Math.random() * 1000) + 500}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-green-600/90" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"
            />
          </div>

          <div className="container mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to make an impact?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
                Join thousands of environmental projects and traders creating a sustainable future 
                through verified blue carbon credits.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link 
                  href="/auth/register"
                  className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3"
                >
                  Get Started Today
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Customer Support Section */}
        <CustomerSupport />

        {/* Footer */}
        <footer className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 right-20 w-32 h-32 bg-blue-400 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                rotate: [180, 90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-10 left-20 w-24 h-24 bg-purple-400 rounded-full blur-xl"
            />
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="/clorion-logo.png" 
                    alt="CLORION Logo" 
                    className="w-10 h-10 rounded-xl object-contain"
                  />
                  <h3 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] hover:scale-105 transition-all duration-300 cursor-pointer">
                    CLORION
                  </h3>
                </div>
                <p className="text-gray-400">
                  Revolutionizing carbon markets through blockchain technology and satellite monitoring.
                </p>
              </div>
            </div>

            {/* Enhanced Navigation */}
            <EnhancedFooterNavigation />

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 mb-4 md:mb-0">&copy; 2025 <span className="font-bold text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer">CLORIT</span>. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Contact us:</span>
                <div className="flex items-center gap-3">
                  <a 
                    href="mailto:clorit2025@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                    aria-label="Email CLORION"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </>
  );
}
