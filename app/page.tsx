"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
// import Image from "next/image";
import { ArrowRight, Cloud, Lock, Zap, Search, Users, Shield, Sparkles, Play, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import DashboardPreview from "@/components/DashboardPreview";
import { motion } from "framer-motion";

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
    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
      {number}
    </div>
    <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 lg:py-36 px-4 text-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
          {/* Enhanced animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.3),transparent_50%)] animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(236,72,153,0.3),transparent_50%)] animate-pulse delay-1000"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.2),transparent_40%)] animate-pulse delay-2000"></div>
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
              Introducing CloudNest 2.0
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 lg:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Your Personal Cloud,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 lg:mb-16 leading-relaxed px-4">
              Experience the future of cloud storage with AI-powered organization, 
              military-grade security, and blazing-fast performance. 
              <span className="text-purple-300 font-semibold">Simple. Intelligent. Secure.</span>
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
                      Get Started for Free 
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
        <section className="py-16 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-gray-800">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <StatItem number="10K+" label="Active Users" index={0} />
              <StatItem number="50M+" label="Files Stored" index={1} />
              <StatItem number="99.9%" label="Uptime" index={2} />
              <StatItem number="256-bit" label="Encryption" index={3} />
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
                Beautiful. Intuitive. Powerful.
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Experience a cloud storage platform that's as beautiful as it is functional. 
                Every detail crafted for the modern user.
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
                Enterprise-Grade Features
              </motion.div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                More Than Just Storage
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                CloudNest combines cutting-edge technology with intuitive design to deliver 
                a cloud storage experience that anticipates your needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
              <FeatureCard
                index={0}
                icon={<Cloud className="w-8 h-8 text-blue-400" />}
                title="Seamless Uploads"
                description="Effortlessly upload any file type with our intuitive drag-and-drop interface. Batch uploads, progress tracking, and smart compression included."
              />
              <FeatureCard
                index={1}
                icon={<Lock className="w-8 h-8 text-green-400" />}
                title="Fort-Knox Security"
                description="Your files are protected with military-grade encryption, two-factor authentication, and advanced threat detection systems."
              />
              <FeatureCard
                index={2}
                icon={<Search className="w-8 h-8 text-purple-400" />}
                title="AI-Powered Search"
                description="Find any image by describing it in natural language. Our AI understands context, objects, and even emotions in your photos."
              />
              <FeatureCard
                index={3}
                icon={<Zap className="w-8 h-8 text-yellow-400" />}
                title="Blazing Fast"
                description="Built on a global CDN with edge caching for instant access. Experience sub-second load times from anywhere in the world."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Trusted by Professionals
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Join thousands of creators, developers, and businesses who trust CloudNest with their most important files.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "CloudNest has revolutionized how I organize my creative projects. The AI search finds exactly what I need in seconds.",
                  author: "Sarah Chen",
                  role: "Digital Artist",
                  avatar: "SC"
                },
                {
                  quote: "Finally, a cloud storage that actually understands security. Perfect for our team's sensitive client data.",
                  author: "Marcus Rodriguez",
                  role: "CTO, TechFlow",
                  avatar: "MR"
                },
                {
                  quote: "The interface is incredibly intuitive. My entire team was productive from day one without any training.",
                  author: "Emma Thompson",
                  role: "Project Manager",
                  avatar: "ET"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/80 border border-gray-700/50 rounded-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Sparkles key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 md:px-6 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20 border-t border-gray-800">
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-full">
                <Users className="w-4 h-4" />
                Join 10,000+ Happy Users
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Ready to Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Digital Life?
                </span>
              </h2>
              
              <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                Start your journey with CloudNest today. No credit card required, 
                no setup fees, just intelligent cloud storage that works.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <SignedOut>
                  <Link href="/sign-up">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(124, 58, 237, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-3">
                        Start Free Today
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
                      className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-3">
                        Return to Dashboard 
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
                The intelligent cloud storage platform designed for the modern world. 
                Secure, fast, and built with AI at its core.
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
