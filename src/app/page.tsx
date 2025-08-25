'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import pour la scène 3D
const WhatsCloseExperience = dynamic(
  () => import('@/components/Experience/WhatsCloseExperience'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 text-2xl animate-pulse">Chargement de l'expérience...</div>
      </div>
    )
  }
);

export default function Home() {
  return (
    <div className="min-h-screen relative bg-black">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <WhatsCloseExperience />
      </Suspense>
    </div>
  );
}