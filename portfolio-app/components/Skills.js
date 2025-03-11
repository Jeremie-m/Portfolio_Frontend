"use client";

import React from 'react';
import FanCards from './FanCards';

const Skills = () => {
  return (
    <section id="skills" className="flex flex-col items-center gap-20 px-2">
      <h2 className="font-medium text-[24px] leading-4 text-center text-white font-montserrat">
        Mes Compétences
      </h2>
      <FanCards />
    </section>
  );
};

export default Skills; 