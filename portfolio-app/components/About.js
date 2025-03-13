"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EditBtn from './EditBtn';

const About = ({ onOpenModal }) => {
  const { isAdmin } = useAuth();

  return (
    <>
      {isAdmin && (
        <div className="w-full flex justify-center mb-2">
          <EditBtn onOpenModal={onOpenModal} section="about" />
        </div>
      )}
      <section id="about" className="w-full flex flex-col items-center gap-[30px] px-5">
        <h2 className="font-medium text-[24px] text-center text-white font-montserrat">
          Qui suis-je ?
        </h2>
        <p className="font-medium text-xs leading-4 text-white font-montserrat">
          Passionné par les nouvelles technologies, j&apos;ai débuté ma vie professionnelle en tant que technicien informatique, avant d&apos;innover et de faire naître le premier bar eSport de Normandie, le WarpZone.
          <br /><br />
          Cette expérience unique et entrepreneuriale m&apos;a appris à jongler avec plusieurs casquettes et à faire preuve d&apos;une grande adaptation, et ce durant sept belles années.
          <br /><br />
          Fort de cette aventure, j&apos;ai décidé de quitter le monde de la nuit pour me réorienter vers le développement web.
          <br /><br />
          Aujourd&apos;hui, en tant que développeur full-stack junior, je me suis familiarisé avec le front-end (HTML, CSS, Tailwind, React et Next.js) ainsi qu&apos;avec le back-end (Node.js, Express, Nest.js, MongoDB, PostgreSQL).
          <br /><br />
          Je peux aussi collaborer efficacement avec les équipes créatives grâce à mes compétences en Photoshop et Figma.
        </p>
      </section>
    </>
  );
};

export default About; 