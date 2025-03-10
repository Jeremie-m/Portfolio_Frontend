"use client";

import React from 'react';
import Image from 'next/image';

const HeroBanner = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-6 py-10 px-5 bg-dark">
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary">
        {/* Remplacer par votre propre photo de profil */}
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          {/* Utiliser Image quand vous aurez votre photo */}
          {/* <Image 
            src="/images/profile.jpg" 
            alt="Jérémie Marie" 
            layout="fill" 
            objectFit="cover" 
            priority 
          /> */}
          <span className="text-dark text-lg font-bold">Photo</span>
        </div>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Jérémie Marie</h1>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-medium text-white">Je suis</span>
          <span className="text-xl font-bold text-primary">Développeur Full Stack</span>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4">
        <a 
          href="#contact" 
          className="px-6 py-2 bg-gradient-to-b from-primary to-primary-dark text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Me contacter
        </a>
        <a 
          href="#projects" 
          className="px-6 py-2 border border-primary text-white font-medium rounded-lg hover:bg-primary/10 transition-colors"
        >
          Mes projets
        </a>
      </div>
    </section>
  );
};

export default HeroBanner; 