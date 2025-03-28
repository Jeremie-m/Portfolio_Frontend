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
      <div className="flex items-center justify-between px-[10px] py-[10px] md:py-[16px] lg:py-[22px]">
        <Link className="flex items-center gap-4 lg:gap-1" href="/">
          <span className="font-bold text-[14px] md:text-[18px] lg:text-[28px] text-white cursor-pointer font-jetbrains-mono">
            {isAdmin ? '< Admin />' : '< jeremie-m.dev />'}
          </span>
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="text-[12px] md:text-[14px] lg:text-[16px] font-jetbrains-mono text-white hover:text-red-500 transition-colors duration-200"
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