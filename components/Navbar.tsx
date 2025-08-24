"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Logo Component
const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradientNav" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22d3ee" />
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Enhanced Logo with better spacing and hover effects */}
          <Link href="/" className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <Logo />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white tracking-tight group-hover:bg-gradient-to-r group-hover:from-cyan-200 group-hover:to-purple-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              CloudNest
            </span>
          </Link>

          {/* Enhanced Right Side Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Auth State */}
            <SignedIn>
              <div className="flex items-center gap-3">
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-purple-500/30 hover:ring-purple-400/50 transition-all duration-300"
                    }
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-2 lg:gap-3">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/80 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-600/50"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="relative px-4 lg:px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/20 hover:border-purple-400/30 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Sign Up</span>
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
