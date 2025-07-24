import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Navbar from '@/components/Navbar';
import DashboardContent from '@/components/DashboardContent';

// This is a Server Component, so we can fetch data directly on the server.
export default async function DashboardPage() {
  // Get the authenticated user from Clerk.
  const user = await currentUser();

  // If the user is not logged in, protect the page by redirecting to the sign-in page.
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* The Navbar is rendered at the top of the page. */}
      <Navbar />

      {/* The main content area of the dashboard. */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* We pass the user's ID and name down to the DashboardContent client component. */}
        <DashboardContent 
          userId={user.id} 
          userName={user.firstName || user.emailAddresses[0].emailAddress} 
        />
      </main>
    </div>
  );
}
