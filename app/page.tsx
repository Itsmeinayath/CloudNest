"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cloud, Lock, Zap, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
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
    className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg hover:bg-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 group"
  >
    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-700 rounded-lg border border-gray-600 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 px-4 text-center overflow-hidden bg-gray-900">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.2),transparent_70%)] animate-pulse-slow"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto relative z-10"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent max-w-4xl mx-auto">
              Your Personal Cloud, Reimagined
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Securely store, manage, and find your files with an intelligent,
              AI-powered cloud platform. Simple, fast, and built for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <SignedOut>
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-colors duration-300"
                  >
                    Get Started for Free
                  </motion.button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        </section>

        {/* Product Preview Section */}
        <section className="py-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="container mx-auto"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl shadow-purple-900/10 p-4 hover:scale-[1.01] transition-transform duration-300">
              <Image
                src="/dashboard-preview.png"
                alt="CloudNest Dashboard Preview"
                width={1200}
                height={600}
                className="rounded-lg w-full"
                priority
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 md:px-6 bg-gray-900">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                More Than Just Storage
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                CloudNest is packed with features to make your life easier.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                index={0}
                icon={<Cloud className="w-6 h-6 text-blue-400" />}
                title="Seamless Uploads"
                description="Effortlessly upload any file type with our simple drag-and-drop interface."
              />
              <FeatureCard
                index={1}
                icon={<Lock className="w-6 h-6 text-green-400" />}
                title="Fort-Knox Security"
                description="Your files are encrypted and protected, accessible only by you."
              />
              <FeatureCard
                index={2}
                icon={<Search className="w-6 h-6 text-purple-400" />}
                title="AI-Powered Search"
                description="Find any image by describing it. No more endless scrolling."
              />
              <FeatureCard
                index={3}
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
                title="Blazing Fast"
                description="Built on a modern stack for a smooth, responsive, and fast experience."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8">
              Sign up in seconds and join 1,000+ users building their personal cloud.
            </p>
            <SignedOut>
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-colors duration-300"
                >
                  Let's Go <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 mx-auto px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-colors duration-300"
                >
                  Back to Dashboard <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CloudNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
