"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion'; 
import { useAuth } from '@/contexts/AuthContext';
import EditBtn from './EditBtn';

const HeroBanner = ({ onOpenModal }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <section className="w-full flex flex-col gap-[10px] px-[10px] py-[16px]">
        {isAdmin && (
          <div className="w-full flex justify-center mb-2">
            <EditBtn onOpenModal={onOpenModal} section="hero" />
          </div>
        )}
        <div className="w-full flex items-center justify-center gap-2">
          <h1 className="flex flex-col">
            <motion.span 
              className="text-white font-noto-sans text-[28px]"
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                duration: 3,
                bounce: 0.1
              }}
            >
              Je suis
            </motion.span>
            <span className={`font-jetbrains-mono text-[22px] text-white`}>
              {isAdmin ? 'En Mode Admin_' : 'Développeur Full-Stack_'}
            </span>
          </h1>
          <motion.div 
            className={`relative w-[130px] h-[130px] min-w-[130px] min-h-[130px] rounded-full overflow-hidden ${isAdmin ? '[filter:drop-shadow(0_4px_10px_#EED40B)]' : '[filter:drop-shadow(0_4px_10px_#0B61EE)]'}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 }}}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
            }}
          >
            <Image 
              src="/images/profil.webp" 
              alt="Jérémie Marie" 
              layout="fill" 
              objectFit="cover" 
              priority 
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner; 