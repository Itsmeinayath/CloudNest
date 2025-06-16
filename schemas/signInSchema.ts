import * as z from 'zod';


// 🔧 IMPROVED VERSION - More Flexible
export const signInSchema = z.object({
    // 🆔 IDENTIFIER - Accept email OR username
    // Just check it's not empty, validate the format on backend
    identifier: z
        .string()
        .min(1, { message: 'Email or username is required' })
        .trim(), // Remove extra spaces

    // 🔐 PASSWORD - Same validation as before
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(64, { message: 'Password must be at most 64 characters long' })
});