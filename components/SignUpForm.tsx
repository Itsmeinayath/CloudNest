"use client";

// 🧰 IMPORT ALL THE TOOLS WE NEED
// React hooks for managing component state and behavior
import { useState } from "react";

// Form handling library - makes forms easy and powerful
import { useForm } from "react-hook-form";

// Connects Zod validation with React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";

// Clerk authentication hooks - handles user sign-up and verification
import { useSignUp } from "@clerk/nextjs";

// Next.js navigation hook
import { useRouter } from "next/navigation";

// Next.js optimized Link component
import Link from "next/link";

// Zod for TypeScript type inference
import { z } from "zod";

// HeroUI components - our beautiful building blocks
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";

// Icons from Lucide React - beautiful, consistent icons
import {
  Mail,           // Email icon
  Lock,           // Password/security icon
  AlertCircle,    // Error/warning icon
  CheckCircle,    // Success/checkmark icon
  Eye,            // Show password icon
  EyeOff,         // Hide password icon
} from "lucide-react";

// Our validation schema
import { signUpSchema } from "@/schemas/signUpSchema";

// 📝 MAIN SIGN-UP FORM COMPONENT
// This is the complete form users see when creating an account
export default function SignUpForm() {
  // 🎛️ NAVIGATION AND AUTHENTICATION SETUP
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  // 🎛️ STATE MANAGEMENT
  // Think of state as the "memory" of our component
  const [isSubmitting, setIsSubmitting] = useState(false);           // Prevents double-clicking submit
  const [authError, setAuthError] = useState<string | null>(null);   // Stores sign-up errors
  const [verifying, setVerifying] = useState(false);                // Shows verification form
  const [verificationCode, setVerificationCode] = useState("");     // Stores OTP code
  const [verificationError, setVerificationError] = useState<string | null>(null); // Verification errors
  const [showPassword, setShowPassword] = useState(false);          // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility

  // 🎯 FORM SETUP WITH REACT HOOK FORM
  // This powerful library handles all form logic for us
  const {
    register,      // Connects input fields to form state
    handleSubmit,  // Handles form submission
    formState: { errors }, // Form validation errors
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema), // Use our Zod schema for validation
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // 🚀 MAIN SIGN-UP SUBMISSION HANDLER
  // This runs when user clicks "Create Account" button
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // Safety check - make sure Clerk is loaded
    if (!isLoaded) return;

    // Start loading state and clear any previous errors
    setIsSubmitting(true);
    setAuthError(null);

    try {
      // 🔥 CREATE USER ACCOUNT WITH CLERK
      // This sends user data to Clerk's secure servers
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // 📧 PREPARE EMAIL VERIFICATION
      // Clerk sends a 6-digit code to user's email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Switch to verification mode (shows OTP form)
      setVerifying(true);
      
    } catch (error: any) {
      // 🚨 HANDLE SIGN-UP ERRORS
      console.error("Sign-up error:", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-up. Please try again."
      );
    } finally {
      // Always stop loading state, whether success or error
      setIsSubmitting(false);
    }
  };

  // 🔐 EMAIL VERIFICATION HANDLER
  // This runs when user submits the 6-digit code
  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Safety checks
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      // 🎯 VERIFY THE CODE WITH CLERK
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      // ✅ SUCCESS - ACCOUNT IS VERIFIED!
      if (result.status === "complete") {
        // Activate the user session
        await setActive({ session: result.createdSessionId });
        
        // Redirect to dashboard (user is now logged in!)
        router.push("/dashboard");
      } else {
        // Something went wrong with verification
        setVerificationError(
          "Verification could not be completed. Please try again."
        );
      }
    } catch (error: any) {
      // 🚨 HANDLE VERIFICATION ERRORS
      console.error("Verification error:", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occurred during verification. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📱 VERIFICATION FORM (SHOWN AFTER SIGN-UP)
  // This beautiful OTP form appears when user needs to verify email
  if (verifying) {
    return (
      // 🌈 FULL-SCREEN BACKGROUND WITH GRADIENT
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        
        {/* 🏠 VERIFICATION CARD */}
        <Card className="w-full max-w-md border border-default-200 bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
          
          {/* 📋 VERIFICATION HEADER */}
          <CardHeader className="flex flex-col gap-3 items-center pb-2 pt-8">
            
            {/* 🎯 BEAUTIFUL VERIFICATION ICON */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              {/* ✨ FLOATING DECORATIVE ELEMENTS */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                Verify Your Email
              </h1>
              <p className="text-default-500 text-center leading-relaxed">
                We've sent a 6-digit verification code to<br />
                <span className="font-medium text-blue-600">your email address</span>
              </p>
            </div>
          </CardHeader>

          {/* ➖ ELEGANT SEPARATOR */}
          <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

          <CardBody className="py-6 px-6">
            
            {/* 🚨 VERIFICATION ERROR DISPLAY */}
            {verificationError && (
              <div className="bg-danger-50 border-l-4 border-danger-400 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger-500" />
                <div>
                  <p className="font-medium text-sm">Verification Error</p>
                  <p className="text-sm opacity-90">{verificationError}</p>
                </div>
              </div>
            )}

            {/* 📝 VERIFICATION FORM */}
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              
              {/* 🎨 BEAUTIFUL CODE INPUT */}
              <div className="space-y-3">
                <label
                  htmlFor="verificationCode"
                  className="text-sm font-semibold text-default-900 text-center block"
                >
                  Enter Verification Code
                </label>
                
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full"
                  classNames={{
                    inputWrapper: "border-2 border-default-300 hover:border-green-400 focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100 transition-all duration-200",
                    input: "text-center text-lg font-medium tracking-wider"
                  }}
                  maxLength={6}
                  autoFocus
                />
                
                {/* ⏰ HELPFUL HINT */}
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-700">
                    💡 Check your email inbox and spam folder
                  </p>
                </div>
              </div>

              {/* 🚀 VERIFY BUTTON */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                isLoading={isSubmitting}
                disabled={verificationCode.length < 6}
                startContent={!isSubmitting ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : null}
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            {/* 🔄 RESEND SECTION */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-default-500">
                Didn't receive a code?
              </p>
              <Button
                variant="light"
                color="primary"
                size="sm"
                className="font-medium hover:bg-primary-50 transition-colors"
                onClick={async () => {
                  if (signUp) {
                    await signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    });
                  }
                }}
                startContent={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Resend Code
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // 🎨 MAIN SIGN-UP FORM (SHOWN FIRST)
  // This is the beautiful form users see when they first visit
  return (
    // 🌈 FULL-SCREEN BACKGROUND WITH GRADIENT
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      
      {/* 🏠 MAIN SIGN-UP CARD */}
      <Card className="w-full max-w-md border border-default-200 bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
        
        {/* 📋 FORM HEADER */}
        <CardHeader className="flex flex-col gap-3 items-center pb-2 pt-8">
          
          {/* 🎯 BEAUTIFUL LOGO/BRAND */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
              {/* CloudNest logo icon */}
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l4-7 4 7M3 7l9 6 9-6" />
              </svg>
            </div>
            
            {/* ✨ FLOATING DECORATIVE ELEMENTS */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-default-500 text-center leading-relaxed">
              Join <span className="font-semibold text-blue-600">CloudNest</span> to start managing your<br />
              images securely in the cloud ☁️
            </p>
          </div>
        </CardHeader>

        {/* ➖ ELEGANT SEPARATOR */}
        <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

        <CardBody className="py-6 px-6">
          
          {/* 🚨 SIGN-UP ERROR DISPLAY */}
          {authError && (
            <div className="bg-danger-50 border-l-4 border-danger-400 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger-500" />
              <div>
                <p className="font-medium text-sm">Sign-up Error</p>
                <p className="text-sm opacity-90">{authError}</p>
              </div>
            </div>
          )}

          {/* 📝 MAIN SIGN-UP FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* 📧 EMAIL INPUT FIELD */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-default-900 flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-blue-500" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                startContent={<Mail className="h-4 w-4 text-default-400" />}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                {...register("email")}
                className="w-full"
                classNames={{
                  inputWrapper: `border-2 transition-all duration-200 hover:border-blue-300 
                    ${errors.email ? 'border-danger-300' : 'border-default-300'} 
                    focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-100`,
                  input: "text-default-900 placeholder:text-default-400"
                }}
              />
            </div>

            {/* 🔐 PASSWORD INPUT FIELD */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-default-900 flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-purple-500" />
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                startContent={<Lock className="h-4 w-4 text-default-400" />}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="hover:bg-default-100 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-default-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-default-500" />
                    )}
                  </Button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                {...register("password")}
                className="w-full"
                classNames={{
                  inputWrapper: `border-2 transition-all duration-200 hover:border-purple-300 
                    ${errors.password ? 'border-danger-300' : 'border-default-300'} 
                    focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-100`
                }}
              />
            </div>

            {/* 🔄 CONFIRM PASSWORD FIELD */}
            <div className="space-y-2">
              <label
                htmlFor="passwordConfirmation"
                className="text-sm font-semibold text-default-900 flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-green-500" />
                Confirm Password
              </label>
              <Input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                startContent={<Lock className="h-4 w-4 text-default-400" />}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    className="hover:bg-default-100 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-default-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-default-500" />
                    )}
                  </Button>
                }
                isInvalid={!!errors.passwordConfirmation}
                errorMessage={errors.passwordConfirmation?.message}
                {...register("passwordConfirmation")}
                className="w-full"
                classNames={{
                  inputWrapper: `border-2 transition-all duration-200 hover:border-green-300 
                    ${errors.passwordConfirmation ? 'border-danger-300' : 'border-default-300'} 
                    focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100`
                }}
              />
            </div>

            {/* 📜 TERMS & CONDITIONS SECTION */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-default-700 font-medium">
                    🎉 Welcome to CloudNest!
                  </p>
                  <p className="text-xs text-default-600 leading-relaxed">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* 🚀 CREATE ACCOUNT BUTTON */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              isLoading={isSubmitting}
              startContent={!isSubmitting ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              ) : null}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            {/* 🎯 TRUST SIGNALS */}
            <div className="text-center">
              <p className="text-xs text-default-500">
                🔒 Your data is encrypted and secure
              </p>
            </div>
          </form>
        </CardBody>

        {/* ➖ FOOTER SEPARATOR */}
        <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

        {/* 🔗 FOOTER WITH SIGN-IN LINK */}
        <CardFooter className="flex justify-center py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-default-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary-600 font-semibold underline-offset-2 hover:underline transition-all"
              >
                Sign in here
              </Link>
            </p>
            <p className="text-xs text-default-400">
              🚀 Join thousands of users already using CloudNest
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}