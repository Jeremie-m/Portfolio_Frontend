"use client";

import React from 'react';
import FanCards from './FanCards';
import { useAuth } from '@/contexts/AuthContext';
import EditBtn from './EditBtn';

const Skills = ({ onOpenModal }) => {
  const { isAdmin } = useAuth();

  return (
    <>
      {isAdmin && (
        <div className="w-full flex justify-center mb-4">
          <EditBtn onOpenModal={onOpenModal} section="skills" />
        </div>
      )}
      <section id="skills" className="flex flex-col items-center gap-20 px-2">
        <h2 className="font-medium text-[24px] leading-4 text-center text-white font-montserrat">
          Mes Compétences
        </h2>
        <FanCards />
      </section>
    </>
  );
};

export default Skills; 