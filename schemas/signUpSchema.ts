// 🧰 IMPORT ZOD VALIDATION LIBRARY
// Zod helps us check if user input is correct and safe
import * as z from 'zod';

// 📝 SIGN UP FORM VALIDATION RULES
// This defines exactly what we accept when someone creates an account
export const signUpSchema = z
    .object({
        // 📧 EMAIL VALIDATION
        // Make sure they give us a real email address
        email: z
            .string() // Must be text
            .min(1, {message:'Email is required'}) // Can't be empty
            .email({message :'Invalid email format'}), // Must look like: user@example.com

        // 🔐 PASSWORD VALIDATION  
        // Strong password requirements for security
        password: z
            .string() // Must be text
            .min(1, {message: 'Password is required'}) // Can't be empty
            .min(8, {message: 'Password must be at least 8 characters long'}) // Security: minimum length
            .max(64, {message: 'Password must be at most 64 characters long'}), // Prevent super long passwords

        // 🔄 PASSWORD CONFIRMATION
        // Make sure they typed their password correctly twice
        passwordConfirmation: z
            .string() // Must be text
            .min(1,{message: 'Password confirmation is required'}) // Can't be empty
    })

    // 🔍 CUSTOM VALIDATION RULE
    // Check that both password fields match exactly
    // This prevents typos when creating accounts
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match', // Error message to show user
        path: ['passwordConfirmation'] // Which field to highlight as wrong
    });

// 🎯 TYPESCRIPT TYPES
// These give you perfect autocomplete and error checking
export type SignUpFormData = z.infer<typeof signUpSchema>;


/*
Why We Use Zod:
🛡️ Data Validation - Makes sure users enter correct data
🔒 Security - Prevents bad/malicious data from breaking your app
🎯 TypeScript Integration - Gives you perfect type safety
📝 User-Friendly Errors - Shows helpful error messages to users
🚀 Full-Stack Validation - Works on both frontend AND backend

*/