"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Shield, TrendingUp, Users, Globe, Zap, Sparkles, Award, BarChart3 } from "lucide-react";
import { Preloader } from "@/components/Preloader";
import { FloatingShapes, GlassmorphismCard } from "@/components/FloatingShapes";

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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  CLORIT
                </h1>
              </motion.div>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">
                  How It Works
                </Link>
                <Link href="#dashboard" className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105">
                  Dashboard
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/auth/login" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </nav>
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
                  <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Blockchain-Powered Carbon Registry
                  </span>
                </motion.div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
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
                className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
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
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-3 relative overflow-hidden"
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
                    className="group border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 backdrop-blur-sm"
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
                    className="text-4xl font-bold text-gray-900 mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Blue Carbon Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From project registration to credit trading, CLORIT provides a comprehensive 
              platform for managing blue carbon initiatives with transparency and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Blockchain Verification",
                description: "Immutable project registration and credit issuance using Ethereum smart contracts for maximum transparency and trust."
              },
              {
                icon: Globe,
                title: "Satellite Monitoring",
                description: "Real-time satellite data integration for automated MRV (Monitoring, Reporting, Verification) of ecosystem health."
              },
              {
                icon: TrendingUp,
                title: "Carbon Marketplace",
                description: "Seamless trading platform for verified carbon credits with instant settlement and retirement capabilities."
              },
              {
                icon: Users,
                title: "Multi-Stakeholder Platform",
                description: "Role-based access for project owners, verifiers, traders, and administrators with customized dashboards."
              },
              {
                icon: Leaf,
                title: "Blue Carbon Focus",
                description: "Specialized for coastal ecosystems including mangroves, seagrass beds, and salt marshes with ecosystem-specific methodologies."
              },
              {
                icon: Zap,
                title: "Automated Workflows",
                description: "Streamlined processes for project lifecycle management from registration to credit retirement."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How CLORIT Works</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              A simple, transparent process from project registration to carbon credit trading
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Register Project",
                description: "Submit your blue carbon project with GIS boundaries, ecosystem details, and baseline data."
              },
              {
                step: "02",
                title: "Satellite Verification",
                description: "Automated satellite monitoring tracks vegetation indices and biomass changes over time."
              },
              {
                step: "03",
                title: "Credit Issuance",
                description: "Verified projects receive tokenized carbon credits on the blockchain for transparent trading."
              },
              {
                step: "04",
                title: "Marketplace Trading",
                description: "Trade credits with corporate buyers and individuals committed to carbon neutrality."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="opacity-90 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trader Dashboard Access Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to the Trader Dashboard!
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                After logging in, you gain access to a powerful suite of tools designed to help you explore, 
                purchase, and manage blockchain-based carbon credits with full transparency and flexibility.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                As a Trader, you can:
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2" />
                      Advanced Marketplace Tools
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Track real-time price analytics and market trends</li>
                      <li>• Explore supply-demand curves for different project types</li>
                      <li>• Place bids or bulk orders and split credits for resale</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                      <Shield className="w-6 h-6 mr-2" />
                      Portfolio Management
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Manage your credit portfolio (active vs retired)</li>
                      <li>• Visualize your climate impact (tonnes of CO₂ offset)</li>
                      <li>• Set auto-retirement schedules for compliance</li>
                      <li>• Download export-ready ESG reports</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-purple-50 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                      <Zap className="w-6 h-6 mr-2" />
                      Financial Features
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Multi-wallet support (MetaMask, Coinbase, UPI)</li>
                      <li>• Secure credits through hedging/futures contracts</li>
                      <li>• Stake tokens in DeFi pools for yield</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-yellow-50 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
                      <Globe className="w-6 h-6 mr-2" />
                      Trust & Transparency
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Verify every credit with Blockchain Explorer</li>
                      <li>• Review project ratings & certifications</li>
                      <li>• Access full credit provenance data</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6 md:col-span-2 lg:col-span-2">
                  <div className="bg-indigo-50 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      Community & Collaboration
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Gift credits for CSR or campaigns</li>
                      <li>• Join corporate alliances to buy credits collectively</li>
                      <li>• Track how your purchases directly support coastal communities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white">
                <h4 className="text-xl font-semibold mb-4 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 mr-2" />
                  Your Trading Journey
                </h4>
                <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">Login</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="bg-white/20 px-3 py-1 rounded-full">Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="bg-white/20 px-3 py-1 rounded-full">Browse Projects</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="bg-white/20 px-3 py-1 rounded-full">Buy Credits</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="bg-white/20 px-3 py-1 rounded-full">Manage Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                  <span className="bg-white/20 px-3 py-1 rounded-full">Generate ESG Reports</span>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link 
                  href="/auth/login" 
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  Access Trader Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join the blue carbon revolution and contribute to global climate goals while 
              generating sustainable revenue from your coastal ecosystem projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register?role=PROJECT_OWNER" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Register a Project
              </Link>
              <Link 
                href="/auth/register?role=TRADER" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Start Trading Credits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">CLORIT</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Pioneering blockchain-based blue carbon registry for a sustainable future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/verification" className="hover:text-white transition-colors">Verification</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CLORIT. All rights reserved. Building the future of blue carbon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
