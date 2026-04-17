"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Cloud } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0d12]/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight text-lg">
            CloudNest
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full ring-1 ring-[rgba(255,255,255,0.1)]",
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#8b8fa3] hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/25"
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
