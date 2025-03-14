"use client";

import React from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
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
      <div className="flex items-center justify-between px-[10px] py-[10px]">
        <Link href="/">
          <span className="font-bold text-[14px] text-white cursor-pointer font-jetbrains-mono">
            {isAdmin ? '< Admin />' : '< jeremie-m.dev />'}
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          {isAdmin && (
            <button
              onClick={handleLogout}
              className="text-[12px] font-jetbrains-mono text-white hover:text-red-500 transition-colors duration-200"
            >
              Log Out
            </button>
          )}
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