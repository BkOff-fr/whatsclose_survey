'use client';

import dynamic from 'next/dynamic';
import ChatSurvey from '@/components/Survey/ChatSurvey';

// Dynamic imports for heavy components
const AnimatedBackground = dynamic(
  () => import('@/components/Background/AnimatedBackground'),
  { ssr: false }
);

// Option: Use ThreeBackground instead for more advanced 3D effects
// const ThreeBackground = dynamic(
//   () => import('@/components/Background/ThreeBackground'),
//   { ssr: false }
// );

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      {/* Or use: <ThreeBackground /> */}
      <ChatSurvey />
    </div>
  );
}