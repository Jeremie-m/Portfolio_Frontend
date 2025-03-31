"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NavLinks from '@/components/layout/NavLinks';
import BurgerMenu from '@/components/modals/BurgerMenu';
import { useAuth } from '@/features/auth/contexts/AuthContext';

const Header = ({ onOpenModal, activeModal }) => {
  const { isAdmin, setIsAdmin } = useAuth();

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    setIsAdmin(false);
  };

  // Variantes d'animation pour le header
  const headerVariants = {
    hidden: { 
      y: "-100%", 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  return (
    <motion.header 
      className="z-100 w-full header-bg"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="w-full max-w-[1300px] mx-auto flex items-center justify-between px-[8px] py-[6px] md:py-[10px] lg:py-[14px]">
        <Link className="flex items-center gap-3 lg:gap-1" href="/">
          <span className="font-bold text-[12px] md:text-[16px] lg:text-[22px] text-white cursor-pointer font-jetbrains-mono">
            {isAdmin ? '< Admin />' : '< jeremie-m.dev />'}
          </span>
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="text-[10px] md:text-[12px] lg:text-[14px] font-jetbrains-mono text-white hover:text-red-500 transition-colors duration-200"
            >
              Log Out
            </button>
          )}
        </Link>

        <div className="flex items-center gap-4">
          <NavLinks />
          <BurgerMenu 
            isOpen={activeModal === 'menu'}
            onOpen={() => onOpenModal('menu')}
            onClose={() => onOpenModal(null)}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 