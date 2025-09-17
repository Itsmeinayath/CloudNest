"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
// import Image from "next/image";
import { ArrowRight, Cloud, Lock, Zap, Search, Users, Shield, Sparkles, Play, ChevronRight } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";
import { motion } from "framer-motion";

// Logo Component (extracted from Navbar for landing page use)
const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradientLanding" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 2.00002C10.08 2.00002 6.5 5.58002 6.5 10C6.5 11.81 7.15 13.47 8.24 14.76L14.76 8.24002C13.47 7.15002 11.81 6.50002 10 6.50002C5.58 6.50002 2 10.08 2 14.5C2 18.92 5.58 22.5 10 22.5C11.81 22.5 13.47 21.85 14.76 20.76L20.76 14.76C21.85 13.47 22.5 11.81 22.5 10C22.5 5.58002 18.92 2.00002 14.5 2.00002ZM10 20.5C6.69 20.5 4 17.81 4 14.5C4 11.19 6.69 8.50002 10 8.50002C13.31 8.50002 16 11.19 16 14.5C16 17.81 13.31 20.5 10 20.5Z"
      fill="url(#logoGradientLanding)"
    />
  </svg>
);

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    viewport={{ once: true }}
    className="relative p-6 lg:p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm"
  >
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 mb-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="text-lg lg:text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">{title}</h3>
      <p className="text-gray-400 text-sm lg:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  </motion.div>
);

// Stats Component
const StatItem = ({ number, label, index }: { number: string; label: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
      {number}
    </div>
    <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">{label}</div>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Simple Logo Header */}
      <header className="absolute top-0 left-0 z-50 p-6 lg:p-8">
        <Link href="/" className="flex items-center gap-3 group transition-all duration-300">
          <Logo />
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            CloudNest
          </span>
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 lg:py-36 px-4 text-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
          {/* Enhanced animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.3),transparent_50%)] animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(236,72,153,0.3),transparent_50%)] animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.2),transparent_40%)] animate-pulse delay-2000"></div>
          </div>

          {/* Modern geometric patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-float delay-1000"></div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto relative z-10 max-w-7xl"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-full backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ Organizations
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 lg:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Enterprise-Grade Cloud Storage
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Built for Modern Teams
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 lg:mb-16 leading-relaxed px-4">
              Secure, intelligent, and lightning-fast cloud storage with AI-powered organization. 
              <br className="hidden md:block" />
              Trusted by <span className="text-purple-300 font-semibold">10,000+ professionals</span> worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-16">
              <SignedOut>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 lg:px-12 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-3 text-sm lg:text-base">
                      Start Free Trial 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
                <Link href="#demo">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center justify-center gap-3 px-6 lg:px-8 py-3 lg:py-4 text-white font-semibold border-2 border-gray-600 rounded-2xl hover:border-purple-500 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
                  >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm lg:text-base">Watch Demo</span>
                  </motion.button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 lg:px-12 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-3 text-sm lg:text-base">
                      Go to Dashboard 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 lg:py-20 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <StatItem number="10K+" label="Organizations Trust Us" index={0} />
              <StatItem number="500M+" label="Files Secured" index={1} />
              <StatItem number="99.99%" label="Uptime SLA" index={2} />
              <StatItem number="AES-256" label="Bank-Grade Encryption" index={3} />
            </div>
          </div>
        </section>

        {/* Product Preview Section */}
        <section className="py-16 lg:py-24 px-4 bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="container mx-auto max-w-7xl"
          >
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Designed for Professional Teams
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Experience enterprise-grade cloud storage with an interface so intuitive, 
                your team will be productive from day one. No training required.
              </p>
            </div>
            
            {/* Enhanced Dashboard Preview */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-3xl shadow-2xl p-4 lg:p-8 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-3xl"></div>
                <div className="relative z-10">
                  <DashboardPreview />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 px-4 md:px-6 bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 lg:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-full"
              >
                <Shield className="w-4 h-4" />
                Enterprise-Ready Features
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Everything Your Business Needs
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                From secure file sharing to AI-powered search, CloudNest provides all the tools 
                modern teams need to collaborate efficiently and securely.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
              <FeatureCard
                index={0}
                icon={<Cloud className="w-8 h-8 text-blue-400" />}
                title="Enterprise File Management"
                description="Advanced file organization with folder structures, tags, and metadata. Support for all file types with automated backup and version control."
              />
              <FeatureCard
                index={1}
                icon={<Lock className="w-8 h-8 text-green-400" />}
                title="Bank-Level Security"
                description="AES-256 encryption, SOC 2 compliance, and advanced access controls. Your data is protected with the same security used by financial institutions."
              />
              <FeatureCard
                index={2}
                icon={<Search className="w-8 h-8 text-purple-400" />}
                title="AI-Powered Discovery"
                description="Find files instantly using natural language queries. Our AI understands context, content, and relationships between your documents and media."
              />
              <FeatureCard
                index={3}
                icon={<Zap className="w-8 h-8 text-yellow-400" />}
                title="Global Performance"
                description="Lightning-fast access from anywhere with our global CDN. Sub-second file loading with 99.99% uptime SLA and redundant backup systems."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-24 px-4 md:px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                From startups to Fortune 500 companies, organizations worldwide trust CloudNest 
                to secure and organize their most critical business data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  quote: "CloudNest has transformed how our design team collaborates. The AI search finds project assets instantly, saving us hours every week.",
                  author: "Sarah Chen",
                  role: "Creative Director, DesignFlow",
                  avatar: "SC"
                },
                {
                  quote: "Security and compliance were our top priorities. CloudNest's enterprise features and SOC 2 certification made the decision easy.",
                  author: "Marcus Rodriguez",
                  role: "CISO, TechVentures Inc",
                  avatar: "MR"
                },
                {
                  quote: "The seamless integration with our existing tools and the intuitive interface had our entire team productive from day one.",
                  author: "Emma Thompson",
                  role: "VP Operations, GrowthCorp",
                  avatar: "ET"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 lg:p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700/50 rounded-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm lg:text-base">{testimonial.author}</div>
                      <div className="text-gray-400 text-xs lg:text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-16 lg:py-24 px-4 md:px-6 bg-gradient-to-br from-gray-900 via-purple-900/5 to-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Start free and scale as you grow. No hidden fees, no complex tiers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative p-6 lg:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-2xl backdrop-blur-sm"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-1">Free</div>
                  <div className="text-gray-400 text-sm mb-6">Forever</div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>5GB Storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Basic AI Search</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Mobile & Web Access</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                    Get Started
                  </button>
                </div>
              </motion.div>

              {/* Professional Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 lg:p-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-2xl backdrop-blur-sm scale-105"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-1">$12</div>
                  <div className="text-gray-400 text-sm mb-6">per user/month</div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>1TB Storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Advanced AI Features</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Team Collaboration</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Priority Support</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all">
                    Start Free Trial
                  </button>
                </div>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative p-6 lg:p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-2xl backdrop-blur-sm"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-1">Custom</div>
                  <div className="text-gray-400 text-sm mb-6">Contact us</div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Unlimited Storage</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>SOC 2 Compliance</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>24/7 Dedicated Support</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Custom Integrations</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                    Contact Sales
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Indicators Section */}
        <section className="py-16 lg:py-20 px-4 md:px-6 bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-8">
                Trusted by teams at these organizations
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60">
                {/* Company placeholders - these would be replaced with actual company logos */}
                {[
                  "TechCorp", "InnovateLabs", "DataFlow", "SecureCloud", "TeamSync", "BuildFast"
                ].map((company, index) => (
                  <div key={company} className="flex items-center justify-center h-12 px-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600/50">
                    <span className="text-gray-300 font-medium text-sm lg:text-base">{company}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Security & Compliance Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-xl">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white mb-1">SOC 2 Certified</div>
                <div className="text-xs text-gray-400">Security Compliant</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-xl">
                <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white mb-1">AES-256</div>
                <div className="text-xs text-gray-400">Bank-Grade Encryption</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-xl">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white mb-1">24/7 Support</div>
                <div className="text-xs text-gray-400">Enterprise Grade</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-xl">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white mb-1">99.99% SLA</div>
                <div className="text-xs text-gray-400">Guaranteed Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 px-4 md:px-6 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20 border-t border-gray-800">
          <div className="container mx-auto text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-full">
                <Users className="w-4 h-4" />
                Join 10,000+ Organizations
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Ready to Secure Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Business Data?
                </span>
              </h2>
              
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-400 mb-12 lg:mb-16 leading-relaxed max-w-3xl mx-auto px-4">
                Start with our free tier today. Enterprise-grade security, AI-powered organization, 
                and 24/7 support. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center">
                <SignedOut>
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-8 lg:px-12 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center gap-3 text-sm lg:text-base">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </motion.button>
                  </Link>
                  <div className="text-sm text-gray-500">
                    Free forever • No credit card required
                  </div>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-8 lg:px-12 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center gap-3 text-sm lg:text-base">
                        Go to Dashboard 
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </motion.button>
                  </Link>
                </SignedIn>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CloudNest</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Enterprise-grade cloud storage platform designed for modern businesses. 
                Secure, intelligent, and trusted by organizations worldwide.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-300 cursor-pointer">
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                {['Features', 'Security', 'Pricing', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-purple-400 transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                {['Help Center', 'Contact', 'Status', 'Privacy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-purple-400 transition-colors duration-300">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CloudNest. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500 mt-4 md:mt-0">
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
