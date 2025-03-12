'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminTheme() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <style jsx global>{`
      /* Les styles seront définis ensemble */

      /* Header background en mode admin */
      .header-bg {
        background: linear-gradient(135deg, #EED40B 0%, #A35608 100%) !important;
      }

      /* Couleur du texte "Voir mon CV" en mode admin */
      .text-primary {
        color: #C8B20C !important;
      }
    `}</style>
  );
} 