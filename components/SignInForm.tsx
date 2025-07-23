"use client";

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// A better Google SVG icon
const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.35 11.1H12.18V13.83H18.68C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5.03 16.25 5.03 12.55C5.03 8.85 8.36 5.83 12.19 5.83C14.29 5.83 15.99 6.69 17.29 7.84L19.38 5.83C17.38 3.99 15.08 3 12.19 3C7.03 3 3 7.54 3 12.55C3 17.56 7.03 22.1 12.19 22.1C17.64 22.1 21.55 18.27 21.55 12.81C21.55 12.21 21.48 11.65 21.35 11.1Z" fill="#FFFFFF"/>
    </svg>
);

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred with Google Sign-In.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.create({ identifier: email });
      const firstFactor = result.supportedFirstFactors?.find(
        (factor) => factor.strategy === 'password'
      );

      if (firstFactor) {
        setStep('password');
      } else {
        setError("Password is not a supported sign-in method for this account.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred. Please check your email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'password', password });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      } else if (result.status === 'needs_second_factor') {
        setError("Two-factor authentication is required.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#111113] p-4 font-sans">
      <div className="w-full max-w-md bg-[#18181B] border border-zinc-800 rounded-2xl p-8 text-white shadow-2xl shadow-purple-900/10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Sign in to CloudNest</h1>
          <p className="text-zinc-400 mt-2 text-sm">Welcome back! Please sign in to continue</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors mb-6 text-sm font-medium"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <hr className="w-full border-zinc-700" />
          <span className="text-zinc-500 text-xs font-medium">OR</span>
          <hr className="w-full border-zinc-700" />
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.form
              key="email"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onSubmit={handleEmailSubmit}
            >
              <label htmlFor="email" className="text-sm font-medium text-zinc-300 mb-2 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300 disabled:bg-purple-800 disabled:opacity-70 transform hover:scale-[1.02]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight className="h-5 w-5" /></>}
              </button>
            </motion.form>
          )}

          {step === 'password' && (
            <motion.form
              key="password"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onSubmit={handlePasswordSubmit}
            >
              <label htmlFor="password" className="text-sm font-medium text-zinc-300 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300 disabled:bg-purple-800 disabled:opacity-70 transform hover:scale-[1.02]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && <p className="text-red-400 text-sm mt-4 text-center animate-pulse">{error}</p>}

        <p className="text-center text-zinc-400 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
