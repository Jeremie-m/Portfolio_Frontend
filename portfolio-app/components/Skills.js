"use client";

import React from 'react';
import FanCards from './FanCards';
import { useAuth } from '@/contexts/AuthContext';
import EditBtn from './EditBtn';
import SkillsEditModal from '@/components/ui/modals/SkillsEditModal';

const Skills = ({ onOpenModal, activeModal }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="w-full flex flex-col gap-[10px] px-[10px] py-[16px]">
      {isAdmin && (
        <div className="w-full flex justify-center mb-2">
          <EditBtn onOpenModal={onOpenModal} section="skills" />
        </div>
      )}
      <section id="skills" className="flex flex-col items-center gap-20 px-2">
        <h2 className="font-medium text-[24px] leading-4 text-center text-white font-montserrat">
          Mes Compétences
        </h2>
        <FanCards />
      </section>

      <SkillsEditModal
        isOpen={activeModal === 'skills'}
        onClose={() => onOpenModal(null)}
      />
    </div>
  );
};

export default Skills; 