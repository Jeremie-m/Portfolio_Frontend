'use client';

import dynamic from 'next/dynamic';

// Charger dynamiquement le composant ClientLoader
const ClientLoader = dynamic(() => import('./ClientLoader'), {
  ssr: false, // Désactiver le SSR pour ce composant
  loading: () => (
    <div className="flex justify-center items-center w-full h-[40px]">
      <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin"></div>
    </div>
  ),
});

const Loader = (props) => {
  return <ClientLoader {...props} />;
};

export default Loader; 