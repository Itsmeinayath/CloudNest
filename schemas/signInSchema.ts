import * as z from 'zod';


export const signInSchema = z.object({
    identifier : z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'please enter a valid email' })
        .or(z.string().min(1, { message: 'Username is required' })),

    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(64, { message: 'Password must be at most 64 characters long' })

});

export type SignInFormData = z.infer<typeof signInSchema>;