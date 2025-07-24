"use client";

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

// A simple, abstract logo component. You can replace this with your SVG.
const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradientNav" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22d3ee"/>
        <stop offset="100%" stopColor="#4f46e5"/>
      </linearGradient>
    </defs>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5 2.00002C10.08 2.00002 6.5 5.58002 6.5 10C6.5 11.81 7.15 13.47 8.24 14.76L14.76 8.24002C13.47 7.15002 11.81 6.50002 10 6.50002C5.58 6.50002 2 10.08 2 14.5C2 18.92 5.58 22.5 10 22.5C11.81 22.5 13.47 21.85 14.76 20.76L20.76 14.76C21.85 13.47 22.5 11.81 22.5 10C22.5 5.58002 18.92 2.00002 14.5 2.00002ZM10 20.5C6.69 20.5 4 17.81 4 14.5C4 11.19 6.69 8.50002 10 8.50002C13.31 8.50002 16 11.19 16 14.5C16 17.81 13.31 20.5 10 20.5Z" fill="url(#logoGradientNav)"/>
  </svg>
);

// Theme switcher button component
// const ThemeSwitcher = () => {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   // useEffect only runs on the client, so we can safely show the UI
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return null; // return null on the server to avoid hydration mismatch
//   }

//   return (
//     <button
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//       className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//       aria-label="Toggle theme"
//     >
//       {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//     </button>
//   );
// };

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand Name */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              CloudNest
            </span>
          </Link>

          {/* Right side actions */}
          {/* <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <UserButton afterSignOutUrl="/" />
          </div> */}

        </div>
      </div>
    </header>
  );
}
