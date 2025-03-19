"use client";

import React from 'react';
import FanCards from '@/components/ui/FanCards';
import { useAuth } from '@/contexts/AuthContext';
import EditBtn from '@/components/ui/EditBtn';
import SkillsEditModal from '@/components/ui/modals/SkillsEditModal';

const Skills = ({ onOpenModal, activeModal }) => {
  const { isAdmin } = useAuth();

  return (
    <section id="skills" className="w-full flex flex-col gap-[10px] px-[10px] md:px-[20px] lg:px-[40px] py-[16px]">
      {isAdmin && (
        <div className="w-full flex justify-center mb-2 md:mb-[40px]">
          <EditBtn onOpenModal={onOpenModal} section="skills" />
        </div>
      )}
      <div className="w-full flex flex-col items-center gap-8 md:gap-20 lg:gap-30">
        <h2 className="font-medium text-[24px] md:text-[40px] lg:text-[64px] text-center text-white font-montserrat">
          Mes Compétences
        </h2>
        <div className="w-full">
          <FanCards />
        </div>
      </div>

      <SkillsEditModal
        isOpen={activeModal === 'skills'}
        onClose={() => onOpenModal(null)}
      />
    </section>
  );
};

export default Skills; 