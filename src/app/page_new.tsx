import Link from "next/link";
import { ArrowRight, Leaf, Shield, TrendingUp, Users, Globe, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                CLORION
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link href="#dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link 
                href="/auth/login" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Blue Carbon Registry for a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Sustainable Future
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Harness the power of blockchain technology and satellite monitoring to create, 
              verify, and trade blue carbon credits from mangroves, seagrass, and wetland ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/register" 
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Start Your Project <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/marketplace" 
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Projects Registered", value: "150+", icon: Leaf },
              { label: "CO₂ Captured", value: "50,000t", icon: TrendingUp },
              { label: "Credits Issued", value: "45,000", icon: Shield },
              { label: "Active Traders", value: "1,200+", icon: Users },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
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
              From project registration to credit trading, CLORION provides a comprehensive 
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
            <h2 className="text-4xl font-bold mb-4">How CLORION Works</h2>
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
                <h3 className="text-xl font-bold">CLORION</h3>
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
            <p>&copy; 2025 CLORION. All rights reserved. Building the future of blue carbon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
