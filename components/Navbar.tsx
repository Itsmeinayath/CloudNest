"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Logo Component
const Logo = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradientNav" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 2.00002C10.08 2.00002 6.5 5.58002 6.5 10C6.5 11.81 7.15 13.47 8.24 14.76L14.76 8.24002C13.47 7.15002 11.81 6.50002 10 6.50002C5.58 6.50002 2 10.08 2 14.5C2 18.92 5.58 22.5 10 22.5C11.81 22.5 13.47 21.85 14.76 20.76L20.76 14.76C21.85 13.47 22.5 11.81 22.5 10C22.5 5.58002 18.92 2.00002 14.5 2.00002ZM10 20.5C6.69 20.5 4 17.81 4 14.5C4 11.19 6.69 8.50002 10 8.50002C13.31 8.50002 16 11.19 16 14.5C16 17.81 13.31 20.5 10 20.5Z"
      fill="url(#logoGradientNav)"
    />
  </svg>
);

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Enhanced backdrop with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-slate-900/90 to-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/10"></div>
      
      <div className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Enhanced Logo Section */}
            <Link href="/" className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Logo />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent tracking-tight">
                CloudNest
              </span>
            </Link>

            {/* Enhanced Navigation Buttons */}
            <div className="flex items-center gap-3">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <Link
                  href="/sign-in"
                  className="group relative px-6 py-2.5 text-sm font-medium text-gray-200 hover:text-white rounded-xl border border-gray-600/50 hover:border-gray-500/70 bg-gray-800/30 hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </Link>
                
                <Link
                  href="/sign-up"
                  className="group relative overflow-hidden px-6 py-2.5 text-sm font-medium text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Enhanced gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 group-hover:from-purple-500 group-hover:via-blue-500 group-hover:to-purple-600 transition-all duration-300"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  
                  {/* Border gradient */}
                  <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/30 transition-colors duration-300"></div>
                  
                  <span className="relative z-10 font-semibold">Sign Up</span>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
