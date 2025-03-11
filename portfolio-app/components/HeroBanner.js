"use client";

import React from 'react';
import Image from 'next/image';

const HeroBanner = () => {
  return (
    <section className="w-full flex items-center justify-center gap-2 px-[10px] py-[16px] bg-dark">
      {/* Ici s'inscrira le futur composant de hero banner text dynamique*/}
      <h1 className="flex flex-col">
        <span className="text-white font-noto-sans text-[28px]">Je suis</span>
        <span className="text-primary font-jetbrains-mono text-[22px]">Développeur Full-Stack_</span>
      </h1>
      <div className="relative w-[130px] h-[130px] min-w-[130px] min-h-[130px] rounded-full overflow-hidden [filter:drop-shadow(0_4px_10px_#0B61EE)]">
        <Image 
          src="/images/profil.webp" 
          alt="Jérémie Marie" 
          layout="fill" 
          objectFit="cover" 
          priority 
        />
      </div>
    </section>
  );
};

export default HeroBanner; 