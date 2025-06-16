'use client';
// 🧰 IMPORT ALL THE TOOLS WE NEED
// React hooks for managing component state and behavior
import { useState } from 'react';

// Form handling library - makes forms easy and powerful
import { useForm } from 'react-hook-form';

// Connects Zod validation with React Hook Form
import { zodResolver } from '@hookform/resolvers/zod';

// HeroUI components - our beautiful building blocks
import { 
    Card,           // Container for our form
    CardHeader,     // Top section with title
    CardBody,       // Main content area
    CardFooter,     // Bottom section with links
    Button,         // Clickable buttons
    Input,          // Text input fields
    Divider,        // Visual separator lines
    Link            // Clickable links
} from "@heroui/react";

// Icons from Lucide React - beautiful, consistent icons
import { 
    Mail,           // Email icon
    Lock,           // Password/security icon
    Eye,            // Show password icon
    EyeOff,         // Hide password icon
    AlertCircle,    // Error/warning icon
    CheckCircle     // Success/checkmark icon
} from "lucide-react";

// Our validation schema and types
import { signUpSchema, type SignUpFormData } from '@/schemas/signUpSchema';

// 📝 MAIN SIGN-UP FORM COMPONENT
// This is the complete form users see when creating an account
export default function SignUpForm() {
    
    // 🎛️ STATE MANAGEMENT
    // Think of state as the "memory" of our component
    
    // Controls whether password is visible or hidden (starts hidden for security)
    const [showPassword, setShowPassword] = useState(false);
    
    // Controls whether confirm password is visible or hidden
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Stores any error messages from the server (like "email already exists")
    const [authError, setAuthError] = useState<string | null>(null);
    
    // Tracks if the form is currently being submitted (prevents double-clicks)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🎯 FORM SETUP WITH REACT HOOK FORM
    // This powerful library handles all form logic for us
    const {
        register,      // Connects input fields to form state
        handleSubmit,  // Handles form submission
        watch,         // Watches field values in real-time
        formState: { errors, isValid } // Form validation state
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema), // Use our Zod schema for validation
        mode: 'onChange' // Validate as user types (real-time feedback)
    });

    // 👀 WATCH FIELDS FOR REAL-TIME FEEDBACK
    // These give us live updates as user types
    const watchEmail = watch('email');                           // Current email value
    const watchPassword = watch('password');                     // Current password value
    const watchPasswordConfirmation = watch('passwordConfirmation'); // Current confirm password value

    // 🚀 FORM SUBMISSION HANDLER
    // This runs when user clicks "Create Account" button
    const onSubmit = async (data: SignUpFormData) => {
        // Start loading state (button shows spinner)
        setIsSubmitting(true);
        
        // Clear any previous errors
        setAuthError(null);
        
        try {
            // 🔥 THIS IS WHERE YOUR SIGN-UP LOGIC GOES
            console.log('Sign up data:', data);
            
            // Example: Send data to your backend
            // const response = await fetch('/api/auth/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            // Example: Use Clerk for authentication
            // await signUp.create({
            //     emailAddress: data.email,
            //     password: data.password
            // });
            
            // If successful, redirect user or show success message
            
        } catch (error) {
            // If something goes wrong, show user-friendly error
            setAuthError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            // Always stop loading state, whether success or error
            setIsSubmitting(false);
        }
    };

    // 💪 PASSWORD STRENGTH CHECKER
    // Analyzes password and gives it a score from 0-4
    const getPasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 8) strength++;           // Long enough?
        if (/[A-Z]/.test(password)) strength++;         // Has uppercase letter?
        if (/[0-9]/.test(password)) strength++;         // Has number?
        if (/[^A-Za-z0-9]/.test(password)) strength++;  // Has special character?
        return strength;
    };

    // 📝 PASSWORD STRENGTH TEXT
    // Converts number score to user-friendly text
    const getPasswordStrengthText = (password: string): string => {
        const strength = getPasswordStrength(password);
        if (strength <= 1) return "Weak password";
        if (strength <= 2) return "Fair password";  
        if (strength <= 3) return "Good password";
        return "Strong password";
    };

    // 🎨 RENDER THE BEAUTIFUL FORM
    return (
        // 🌈 BACKGROUND CONTAINER
        // Full-screen background with gradient and centering
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            
            {/* 🏠 MAIN FORM CARD */}
            {/* The white container that holds everything */}
            <Card className="w-full max-w-md border border-default-200 bg-white/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
                
                {/* 📋 FORM HEADER */}
                {/* Top section with logo, title, and description */}
                <CardHeader className="flex flex-col gap-3 items-center pb-2 pt-8">
                    
                    {/* 🎯 BEAUTIFUL LOGO/ICON */}
                    <div className="relative">
                        {/* Main logo container with gradient background */}
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                            {/* CloudNest logo icon */}
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l4-7 4 7M3 7l9 6 9-6" />
                            </svg>
                        </div>
                        
                        {/* ✨ FLOATING DECORATIVE ELEMENTS */}
                        {/* Small animated dots that make the logo pop */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                    </div>
                    
                    {/* 📝 TITLE AND DESCRIPTION */}
                    <div className="text-center">
                        {/* Main title with gradient text effect */}
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Create Your Account
                        </h1>
                        
                        {/* Subtitle explaining what the app does */}
                        <p className="text-default-500 text-center leading-relaxed">
                            Join <span className="font-semibold text-blue-600">CloudNest</span> to start managing your<br />
                            images securely in the cloud ☁️
                        </p>
                    </div>
                </CardHeader>

                {/* ➖ VISUAL SEPARATOR */}
                {/* Gradient line that separates header from form */}
                <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

                {/* 📝 MAIN FORM CONTENT */}
                <CardBody className="py-6 px-6">
                    
                    {/* 🚨 ERROR MESSAGE DISPLAY */}
                    {/* Shows server errors like "email already exists" */}
                    {authError && (
                        <div className="bg-danger-50 border-l-4 border-danger-400 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in slide-in-from-top-2">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-danger-500" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Sign-up Error</p>
                                <p className="text-sm opacity-90">{authError}</p>
                            </div>
                        </div>
                    )}

                    {/* 📝 THE ACTUAL FORM */}
                    {/* This handles all user input and validation */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        {/* 📧 EMAIL INPUT FIELD */}
                        <div className="space-y-2">
                            {/* Field label with icon */}
                            <label
                                htmlFor="email"
                                className="text-sm font-semibold text-default-900 flex items-center gap-2"
                            >
                                <Mail className="h-4 w-4 text-blue-500" />
                                Email Address
                            </label>
                            
                            {/* The actual input field */}
                            <Input
                                id="email"
                                type="email"                                    // HTML5 email validation
                                placeholder="your.email@example.com"           // Hint text
                                startContent={<Mail className="h-4 w-4 text-default-400" />} // Icon inside input
                                isInvalid={!!errors.email}                     // Red border if error
                                errorMessage={errors.email?.message}           // Show validation error
                                {...register("email")}                        // Connect to form state
                                className="w-full"
                                classNames={{
                                    // Custom styling for different states
                                    inputWrapper: `border-2 transition-all duration-200 hover:border-blue-300 
                                        ${errors.email ? 'border-danger-300' : 'border-default-300'} 
                                        focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-100`,
                                    input: "text-default-900 placeholder:text-default-400"
                                }}
                            />
                            
                            {/* ✅ EMAIL VALIDATION SUCCESS INDICATOR */}
                            {/* Shows checkmark when email format is valid */}
                            {watchEmail && !errors.email && (
                                <div className="flex items-center gap-2 text-success-600 text-xs">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Valid email format</span>
                                </div>
                            )}
                        </div>

                        {/* 🔐 PASSWORD INPUT FIELD */}
                        <div className="space-y-2">
                            {/* Field label with lock icon */}
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-default-900 flex items-center gap-2"
                            >
                                <Lock className="h-4 w-4 text-purple-500" />
                                Password
                            </label>
                            
                            {/* Password input with show/hide toggle */}
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}      // Toggle between hidden/visible
                                placeholder="••••••••"                        // Dots placeholder
                                startContent={<Lock className="h-4 w-4 text-default-400" />}
                                endContent={
                                    // Button to toggle password visibility
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                        type="button"                          // Prevent form submission
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
                            
                            {/* 💪 PASSWORD STRENGTH INDICATOR */}
                            {/* Visual bars showing password strength */}
                            {watchPassword && (
                                <div className="space-y-2">
                                    {/* Four strength bars */}
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                    getPasswordStrength(watchPassword) >= level
                                                        ? level <= 2 ? 'bg-warning-400'     // Weak = orange
                                                        : level <= 3 ? 'bg-primary-400'     // Fair = blue  
                                                        : 'bg-success-400'                  // Strong = green
                                                        : 'bg-default-200'                  // Empty = gray
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    
                                    {/* Strength text feedback */}
                                    <div className="flex items-center gap-2 text-xs">
                                        {getPasswordStrength(watchPassword) >= 3 ? (
                                            <CheckCircle className="h-3 w-3 text-success-500" />
                                        ) : (
                                            <AlertCircle className="h-3 w-3 text-warning-500" />
                                        )}
                                        <span className={getPasswordStrength(watchPassword) >= 3 ? 'text-success-600' : 'text-warning-600'}>
                                            {getPasswordStrengthText(watchPassword)}
                                        </span>
                                    </div>
                                </div>
                            )}
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
                            
                            {/* ✅ PASSWORD MATCH SUCCESS INDICATOR */}
                            {/* Shows when both passwords match */}
                            {watchPasswordConfirmation && watchPassword && !errors.passwordConfirmation && (
                                <div className="flex items-center gap-2 text-success-600 text-xs">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Passwords match perfectly!</span>
                                </div>
                            )}
                        </div>

                        {/* 📜 TERMS & CONDITIONS SECTION */}
                        {/* Legal agreement with styled background */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm text-default-700 font-medium">
                                        🎉 Welcome to CloudNest!
                                    </p>
                                    <p className="text-xs text-default-600 leading-relaxed">
                                        By creating an account, you agree to our{" "}
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

                        {/* 🚀 SUBMIT BUTTON */}
                        {/* The main call-to-action button */}
                        <Button
                            type="submit"
                            size="lg"
                            className={`w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                                isSubmitting 
                                    ? 'bg-default-300 cursor-not-allowed'           // Disabled state
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' // Active state
                            }`}
                            isLoading={isSubmitting}                               // Shows spinner when submitting
                            disabled={!isValid || isSubmitting}                   // Disabled until form is valid
                            startContent={!isSubmitting ? (
                                // Icon shown when not loading
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            ) : null}
                        >
                            {isSubmitting ? "Creating your account..." : "Create Account"}
                        </Button>

                        {/* 🎯 ADDITIONAL TRUST SIGNALS */}
                        <div className="text-center">
                            {/* Security reassurance */}
                            <p className="text-xs text-default-500 mb-3">
                                🔒 Your data is encrypted and secure
                            </p>
                            
                            {/* 📱 SOCIAL SIGN-UP OPTIONS */}
                            <div className="space-y-2">
                                <p className="text-xs text-default-400">or continue with</p>
                                <div className="flex gap-2 justify-center">
                                    {/* Google Sign-up Button */}
                                    <Button variant="bordered" size="sm" className="flex-1 max-w-[100px]">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                    </Button>
                                    
                                    {/* Twitter Sign-up Button */}
                                    <Button variant="bordered" size="sm" className="flex-1 max-w-[100px]">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardBody>

                {/* ➖ ANOTHER VISUAL SEPARATOR */}
                <Divider className="bg-gradient-to-r from-transparent via-default-200 to-transparent mx-6" />

                {/* 🔗 FOOTER WITH SIGN-IN LINK */}
                <CardFooter className="flex justify-center py-6">
                    <div className="text-center space-y-2">
                        {/* Link to sign-in page for existing users */}
                        <p className="text-sm text-default-600">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="text-primary hover:text-primary-600 font-semibold underline-offset-2 hover:underline transition-all"
                            >
                                Sign in here
                            </Link>
                        </p>
                        
                        {/* Social proof to encourage sign-ups */}
                        <p className="text-xs text-default-400">
                            🚀 Join thousands of users already using CloudNest
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}