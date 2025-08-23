"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.35 11.1H12.18V13.83H18.68C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5.03 16.25 5.03 12.55C5.03 8.85 8.36 5.83 12.19 5.83C14.29 5.83 15.99 6.69 17.29 7.84L19.38 5.83C17.38 3.99 15.08 3 12.19 3C7.03 3 3 7.54 3 12.55C3 17.56 7.03 22.1 12.19 22.1C17.64 22.1 21.55 18.27 21.55 12.81C21.55 12.21 21.48 11.65 21.35 11.1Z" fill="#FFFFFF"/>
    </svg>
);

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: unknown) {
      setError((err as { errors?: Array<{ message: string }> }).errors?.[0]?.message || 'An error occurred with Google Sign-Up.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError('');

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep('verify');
    } catch (err: unknown) {
      setError((err as { errors?: Array<{ message: string }> }).errors?.[0]?.message || 'An error occurred during sign-up.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      }
    } catch (err: unknown) { // CORRECTED: Added opening brace for the catch block
      setError((err as { errors?: Array<{ message: string }> }).errors?.[0]?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-white shadow-2xl shadow-purple-900/10">
        
        <AnimatePresence mode="wait">
          {step === 'signup' && (
            <motion.div key="signup" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
                <p className="text-gray-400 mt-2 text-sm">Join CloudNest to get started</p>
              </div>

              <button onClick={handleGoogleSignUp} className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors mb-4 text-sm font-medium">
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-4">
                <hr className="w-full border-gray-700" />
                <span className="text-gray-500 text-xs font-medium">OR</span>
                <hr className="w-full border-gray-700" />
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email-signup" className="text-sm font-medium text-gray-300 mb-1.5 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="password-signup" className="text-sm font-medium text-gray-300 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm" required />
                  </div>
                </div>
                <div id="clerk-captcha"></div>
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 pt-4 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300 disabled:bg-purple-800 disabled:opacity-70 transform hover:scale-[1.02]">
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight className="h-5 w-5" /></>}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div key="verify" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }}>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">Verify Your Email</h1>
                <p className="text-gray-400 mt-2 text-sm">Enter the code sent to <span className="text-purple-400 font-medium">{email}</span></p>
              </div>
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="text-sm font-medium text-gray-300 mb-1.5 block">Verification Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="6-digit code" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm" required maxLength={6} autoFocus />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all duration-300 disabled:bg-purple-800 disabled:opacity-70 transform hover:scale-[1.02]">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Verify Account'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

        <p className="text-center text-gray-400 text-sm mt-6">
          {step === 'signup' ? "Already have an account? " : "Didn't get a code? "}
          <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors">
            {step === 'signup' ? "Sign in" : "Go back"}
          </Link>
        </p>
      </div>
    </div>
  );
}
