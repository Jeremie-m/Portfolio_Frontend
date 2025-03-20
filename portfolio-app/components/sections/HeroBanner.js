"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion'; 
import { useAuth } from '@/contexts/AuthContext';
import { useHeroBanner } from '@/hooks/useHeroBanner';
import EditBtn from '@/components/ui/EditBtn';
import HeroEditModal from '@/components/ui/modals/HeroEditModal';
import DynamicTypewriter from '@/components/ui/DynamicTypewriter';

const HeroBanner = ({ onOpenModal, activeModal }) => {
  const { isAdmin } = useAuth();
  const { texts, isLoading } = useHeroBanner();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <section className="w-full flex flex-col gap-[10px] px-[20px] md:px-[40px] lg:px-[60px] py-[10px]">
        {isAdmin && (
          <div className="w-full flex justify-center mb-[40px]">
            <EditBtn onOpenModal={onOpenModal} section="hero" />
          </div>
        )}
        <div className="w-full flex items-center gap-4 justify-between">
          <h1 className="flex flex-col flex-start md:text-left w-[50%]">
            <motion.span 
              className="text-white font-noto-sans text-[28px] md:text-[64px] lg:text-[96px]"
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                duration: 1,
                bounce: 0.1
              }}
            >
              Je suis
            </motion.span>
            {isAdmin ? (
              <span className="font-jetbrains-mono text-[22px] md:text-[48px] lg:text-[84px] text-white">
                En Mode Admin_
              </span>
            ) : (
              <DynamicTypewriter 
                texts={texts}
                speed={100}
                className="font-jetbrains-mono text-[20px] md:text-[48px] lg:text-[64px] text-white"
              />
            )}
          </h1>
          <motion.div 
            className={`relative w-[130px] h-[130px] min-w-[130px] min-h-[130px] md:w-[284px] md:h-[284px] md:min-w-[284px] md:min-h-[284px] lg:w-[400px] lg:h-[400px] lg:min-w-[400px] lg:min-h-[400px] rounded-full overflow-hidden ${isAdmin ? '[filter:drop-shadow(0_4px_10px_#EED40B)]' : '[filter:drop-shadow(0_4px_10px_#0B61EE)]'}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 }}}
            style={{
              borderRadius: "50%",
            }}
          >
            <Image 
              src="/images/profil.webp" 
              alt="Jérémie Marie" 
              fill
              sizes="(max-width: 744px) 130px, 284px"
              className="object-cover"
              priority 
            />
          </motion.div>
        </div>
      </section>

      <HeroEditModal 
        isOpen={activeModal === 'hero'}
        onClose={() => onOpenModal(null)}
      />
    </div>
  );
};

export default HeroBanner; 