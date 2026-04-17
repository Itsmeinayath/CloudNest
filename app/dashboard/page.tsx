import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import Navbar from '@/components/Navbar';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#f0f0f3]">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardContent 
          userId={user.id} 
        />
      </main>
    </div>
  );
}
