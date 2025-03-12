'use client';

import dynamic from 'next/dynamic';

const VideoBackground = dynamic(() => import('@/components/VideoBackground'), {
  loading: () => <div className="fixed inset-0 bg-black" />,
  ssr: false
});

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen text-white antialiased">
      <VideoBackground />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
} 