"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
// import Image from "next/image";
import { ArrowRight, Cloud, Lock, Zap, Search, Sparkles, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

// Enhanced Feature Card Component
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
    className="group relative p-8 bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 border border-gray-700/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm"
  >
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Enhanced icon container */}
    <div className="relative flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/50 group-hover:border-purple-500/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>
    </div>
    
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 group-hover:bg-clip-text transition-all duration-300">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
      {description}
    </p>
    
    {/* Subtle border glow */}
    <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white font-sans">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(124,58,237,0.1),transparent,rgba(59,130,246,0.1))] animate-spin [animation-duration:20s]"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0s] hidden md:block"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:1s] hidden md:block"></div>
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:2s] hidden md:block"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto relative z-10"
          >
            {/* Enhanced badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm text-purple-200 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Cloud Storage</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                Your Personal Cloud,
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Securely store, manage, and find your files with an intelligent, AI-powered cloud platform. 
              <span className="text-purple-300 font-medium"> Simple, fast, and built for you.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    {/* Enhanced gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-purple-600"></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started for Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </SignedOut>
              
              <SignedIn>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    {/* Enhanced gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-purple-600"></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </SignedIn>
              
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 text-lg font-medium text-gray-200 hover:text-white rounded-2xl border-2 border-gray-600/50 hover:border-purple-500/50 bg-gray-800/20 hover:bg-gray-800/40 backdrop-blur-sm transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    View Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Product Preview Section */}
        <section className="py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="container mx-auto"
          >
            {/* Placeholder for product preview */}
            <div className="relative bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 border border-gray-700/50 rounded-3xl shadow-2xl shadow-purple-900/10 p-8 hover:scale-[1.01] transition-transform duration-500 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative text-center text-gray-400 py-16">
                <Cloud className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-lg">Dashboard Preview Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                    More Than Just Storage
                  </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  CloudNest is packed with intelligent features designed to make your digital life effortless and secure.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <FeatureCard
                index={0}
                icon={<Cloud className="w-8 h-8 text-blue-400" />}
                title="Seamless Uploads"
                description="Effortlessly upload any file type with our intuitive drag-and-drop interface. Support for all major formats and bulk uploads."
              />
              <FeatureCard
                index={1}
                icon={<Lock className="w-8 h-8 text-green-400" />}
                title="Fort-Knox Security"
                description="Your files are encrypted end-to-end and protected with enterprise-grade security. Only you have access to your data."
              />
              <FeatureCard
                index={2}
                icon={<Search className="w-8 h-8 text-purple-400" />}
                title="AI-Powered Search"
                description="Find any image by describing it naturally. Our AI understands content and context for lightning-fast file discovery."
              />
              <FeatureCard
                index={3}
                icon={<Zap className="w-8 h-8 text-yellow-400" />}
                title="Blazing Fast"
                description="Built on modern cloud infrastructure for instant uploads, downloads, and seamless performance across all devices."
              />
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-24 px-4 md:px-6 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20"></div>
          <div className="absolute inset-0 border-t border-gray-700/50"></div>
          
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                  Ready to Get Started?
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Join <span className="text-purple-300 font-semibold">1,000+</span> users who trust CloudNest 
                with their digital files. Start your journey to smarter cloud storage today.
              </p>
              
              <SignedOut>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden px-10 py-5 text-xl font-semibold text-white rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    {/* Enhanced gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-purple-600"></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <span className="relative z-10 flex items-center gap-3">
                      Let&apos;s Go
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </SignedOut>
              
              <SignedIn>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden px-10 py-5 text-xl font-semibold text-white rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    {/* Enhanced gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-purple-600"></div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    <span className="relative z-10 flex items-center gap-3">
                      Back to Dashboard
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>
              </SignedIn>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-r from-gray-900/90 via-slate-900/90 to-gray-900/90 border-t border-gray-700/50 py-8 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CloudNest. All rights reserved. 
            <span className="text-purple-400 ml-2">Built with ❤️ for your digital life.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
