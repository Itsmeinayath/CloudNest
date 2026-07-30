"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Cloud, Github } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Cloud className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          <span className="font-medium text-white tracking-tight text-lg">
            CloudNest
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-5">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full ring-1 ring-white/10",
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Itsmeinayath/CloudNest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8b8fa3] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Star on GitHub</span>
              </a>
              <div className="w-[1px] h-4 bg-white/10 hidden sm:block"></div>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#8b8fa3] hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
