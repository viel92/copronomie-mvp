'use client'

import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { UserTypesSection } from '../components/UserTypesSection';
import { StatsSection } from '../components/StatsSection';
import { Footer } from '../components/Footer';
import { authService } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const handleSignOut = async () => {
    await authService.logout();
    setUser(null);
    router.push('/');
  };

  return (
    <main className="min-h-screen">
      <Header user={user} onSignOut={handleSignOut} />
      <HeroSection />
      <UserTypesSection />
      <StatsSection />
      <Footer />
    </main>
  )
}