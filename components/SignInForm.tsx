"use client"

// 🧰 IMPORT ALL THE TOOLS WE NEED
import { signInSchema } from "@/schemas/signInSchema"
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { set, z } from "zod"

// HeroUI components - our beautiful building blocks
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card"
import { Divider } from "@heroui/divider"

// Icons from Lucide React - beautiful, consistent icons
import {
  Mail,           // Email icon
  Lock,           // Password/security icon
  AlertCircle,    // Error/warning icon
  CheckCircle,    // Success/checkmark icon
  Eye,            // Show password icon
  EyeOff,         // Hide password icon
} from "lucide-react"

// Next.js optimized Link component
import Link from "next/link"

export default function SignInForm() {
    // 🎛️ YOUR EXACT ORIGINAL CODE - UNCHANGED!
    const router = useRouter()
    const {signIn,isLoaded,setActive} = useSignIn()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    
    // 🎨 ADDED: Password visibility toggle (for UI only)
    const [showPassword, setShowPassword] = useState(false)

    // 🎯 YOUR EXACT FORM SETUP - UNCHANGED!
    const {
        register,
        handleSubmit,
        formState: { errors }, // Added this to show validation errors in UI
    } = useForm({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    })

    // 🚀 YOUR EXACT SUBMIT HANDLER - UNCHANGED!
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        
        if(!isLoaded) return
        setIsSubmitting(true)
        setAuthError(null)

        try {
           const result = await signIn.create({
                identifier: data.identifier,
                password: data.password,
        })

        if (result.status === "complete"){
            await setActive({session: result.createdSessionId});
            router.push("/dashboard")
        }
        else{
            setAuthError("Sign in failed. Please check your credentials and try again.")
        }

        } catch (error:any) {
            setAuthError(
                error.errors?.[0]?.message || "An unexpected error occurred during sign in. Please try again."
            )
            
        }finally{
            setIsSubmitting(false)
            if (authError === null) {
                router.push("/dashboard")
            }
        }
    }   

    // 🎨 BEAUTIFUL UI WRAPPED AROUND YOUR LOGIC
    return(
        // 🌈 FULL-SCREEN BACKGROUND WITH GRADIENT
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
          
          {/* 🏠 MAIN SIGN-IN CARD */}
          <Card className="w-full max-w-md border border-default-200 bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
            
            {/* 📋 FORM HEADER */}
            <CardHeader className="flex flex-col gap-3 items-center pb-2 pt-8">
              
              {/* 🎯 BEAUTIFUL WELCOME BACK ICON */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  {/* Welcome back / login icon */}
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                
                {/* ✨ FLOATING DECORATIVE ELEMENTS */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h1>
                <p className="text-default-500 text-center leading-relaxed">
                  Sign in to <span className="font-semibold text-blue-600">CloudNest</span> and access your<br />
                  secure cloud storage 🗂️
                </p>
              </div>
            </CardHeader>

            {/* ➖ ELEGANT SEPARATOR */}
            <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

            <CardBody className="py-6 px-6">
              
              {/* 🚨 YOUR EXACT ERROR HANDLING - JUST PRETTIER */}
              {authError && (
                <div className="bg-danger-50 border-l-4 border-danger-400 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger-500" />
                  <div>
                    <p className="font-medium text-sm">Sign-in Error</p>
                    <p className="text-sm opacity-90">{authError}</p>
                  </div>
                </div>
              )}

              {/* 📝 YOUR EXACT FORM - JUST BEAUTIFUL */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* 📧 EMAIL/USERNAME INPUT FIELD */}
                <div className="space-y-2">
                  <label
                    htmlFor="identifier"
                    className="text-sm font-semibold text-default-900 flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-blue-500" />
                    Email Address
                  </label>
                  <Input
                    id="identifier"
                    type="email"
                    placeholder="your.email@example.com"
                    startContent={<Mail className="h-4 w-4 text-default-400" />}
                    isInvalid={!!errors.identifier}
                    errorMessage={errors.identifier?.message}
                    {...register("identifier")}
                    className="w-full"
                    classNames={{
                      inputWrapper: `border-2 transition-all duration-200 hover:border-blue-300 
                        ${errors.identifier ? 'border-danger-300' : 'border-default-300'} 
                        focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-100`,
                      input: "text-default-900 placeholder:text-default-400"
                    }}
                  />
                </div>

                {/* 🔐 PASSWORD INPUT FIELD */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-default-900 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4 text-green-500" />
                      Password
                    </label>
                    
                    {/* 🔗 FORGOT PASSWORD LINK */}
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:text-primary-600 font-medium hover:underline transition-all"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  
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
                      inputWrapper: `border-2 transition-all duration-200 hover:border-green-300 
                        ${errors.password ? 'border-danger-300' : 'border-default-300'} 
                        focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-100`
                    }}
                  />
                </div>

                {/* 🎯 SECURITY TRUST INDICATOR */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm text-default-700 font-medium">
                        🔒 Secure Sign-In
                      </p>
                      <p className="text-xs text-default-600 leading-relaxed">
                        Your connection is encrypted and your data is protected
                      </p>
                    </div>
                  </div>
                </div>

                {/* 🚀 YOUR EXACT SUBMIT BUTTON - JUST BEAUTIFUL */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  isLoading={isSubmitting}
                  startContent={!isSubmitting ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  ) : null}
                >
                  {isSubmitting ? "Signing you in..." : "Sign In"}
                </Button>

                {/* 🎯 ADDITIONAL TRUST SIGNALS */}
                <div className="text-center">
                  <p className="text-xs text-default-500">
                    🛡️ Protected by enterprise-grade security
                  </p>
                </div>
              </form>
            </CardBody>

            {/* ➖ FOOTER SEPARATOR */}
            <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

            {/* 🔗 FOOTER WITH SIGN-UP LINK */}
            <CardFooter className="flex justify-center py-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-default-600">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-primary hover:text-primary-600 font-semibold underline-offset-2 hover:underline transition-all"
                  >
                    Sign up here
                  </Link>
                </p>
                <p className="text-xs text-default-400">
                  🚀 Join thousands of users managing their files securely
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
    )
}