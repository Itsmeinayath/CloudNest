"use client";

import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function UserProfilePage() {
  return (
    <div className="flex items-center justify-center py-8">
      <UserProfile
        // The path prop tells Clerk where this component is located.
        path="/user-profile" 
        // The appearance prop lets us style it to match our app.
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#6C47FF', // Use the same purple as our sign-in form
            colorBackground: '#18181B',
          },
          elements: {
            card: 'shadow-2xl bg-zinc-900 border border-zinc-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-zinc-400',
            formButtonPrimary: 'bg-primary hover:bg-primary/90',
            formFieldInput: 'border-zinc-700 focus:border-primary',
            formFieldLabel: 'text-zinc-300',
            badge: 'hidden', // This property hides the "Secured by Clerk" badge
          },
        }} 
      />
    </div>
  );
}
