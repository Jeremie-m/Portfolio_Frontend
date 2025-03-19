"use client";

import React from 'react';
import Link from 'next/link';
import NavLinks from '@/components/ui/NavLinks';
import BurgerMenu from '@/components/ui/modals/BurgerMenu';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ onOpenModal, activeModal }) => {
  const { isAdmin, setIsAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAdmin(false);
  };

  return (
    <header className="z-100 w-full header-bg">
      <div className="flex items-center justify-between px-[10px] py-[10px] md:py-[16px] lg:py-[22px]">
        <Link className="flex items-center gap-4 lg:gap-1" href="/">
          <span className="font-bold text-[14px] md:text-[20px] lg:text-[32px] text-white cursor-pointer font-jetbrains-mono">
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
    </header>
  );
};

export default Header; 