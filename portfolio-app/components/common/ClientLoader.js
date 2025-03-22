'use client';

import { useEffect } from 'react';
import { lineSpinner } from 'ldrs';

const ClientLoader = ({ size = "40", stroke = "3", speed = "1", color = "white" }) => {
  useEffect(() => {
    lineSpinner.register();
  }, []);

  return (
    <div className="flex justify-center items-center w-full">
      <l-line-spinner
        size={size}
        stroke={stroke}
        speed={speed}
        color={color}
      ></l-line-spinner>
    </div>
  );
};

export default ClientLoader; 