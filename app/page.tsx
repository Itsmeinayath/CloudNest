import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Cloud, Lock, Zap, Search, Bot } from "lucide-react";
import Navbar from "@/components/Navbar";

// A reusable Feature Card component for a consistent look
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
  <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg hover:bg-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-700 rounded-lg border border-gray-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default function HomePage() {
  return (
    // Set a solid background color for the main container to prevent transparency issues
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-4 text-center overflow-hidden bg-gray-900">
          <div className="absolute inset-0 -top-1/2 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your Personal Cloud, Reimagined
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Securely store, manage, and find your files with an intelligent, AI-powered cloud platform. Simple, fast, and built for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <SignedOut>
                <Link href="/sign-up">
                  <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                    Get Started for Free
                  </button>
                </Link>
                <Link href="/sign-in">
                  <button className="px-8 py-3 bg-gray-800/50 text-white font-semibold rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              </SignedIn>
            </div>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<Cloud className="w-6 h-6 text-blue-400" />} title="Seamless Uploads" description="Effortlessly upload any file type with our simple drag-and-drop interface." />
              <FeatureCard icon={<Lock className="w-6 h-6 text-green-400" />} title="Fort-Knox Security" description="Your files are encrypted and protected, accessible only by you." />
              <FeatureCard icon={<Search className="w-6 h-6 text-purple-400" />} title="AI-Powered Search" description="Find any image by describing it. No more endless scrolling." />
              <FeatureCard icon={<Zap className="w-6 h-6 text-yellow-400" />} title="Blazing Fast" description="Built on a modern stack for a smooth, responsive, and fast experience." />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 bg-gray-900">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8">
              Sign up in seconds and get access to your own smart cloud.
            </p>
            <SignedOut>
              <Link href="/sign-up">
                <button className="flex items-center gap-2 mx-auto px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                  Let's Go <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 mx-auto px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                  Back to Dashboard <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CloudNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
