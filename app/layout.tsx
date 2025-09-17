import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
// Temporarily commented out Clerk for landing page preview
// import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CloudNest",
  description: "Your modern cloud storage solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Temporarily disabled ClerkProvider for landing page preview
    // <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans">
          {/* The ThemeProvider handles light/dark mode safely, 
            preventing hydration errors.
          */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    // </ClerkProvider>
  );
}
