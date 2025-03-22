'use client';

import { useAuth } from '@/features/auth/contexts/AuthContext';

export default function AdminTheme() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <style jsx global>{`
      .header-bg {
        background: linear-gradient(135deg, #EED40B 0%, #A35608 100%) !important;
      }
    `}</style>
  );
} 