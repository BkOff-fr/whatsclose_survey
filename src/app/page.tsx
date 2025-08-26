'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingScreen from '@/components/UI/LoadingScreen';

// Dynamic import avec loading personnalisé
const WhatsCloseExperience = dynamic(
  () => import('@/components/Experience/WhatsCloseExperience'),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

export default function Home() {
  return (
    <main className="min-h-screen relative bg-black overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <WhatsCloseExperience />
      </Suspense>
    </main>
  );
}