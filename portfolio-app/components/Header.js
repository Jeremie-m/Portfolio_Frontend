"use client";

import React from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import BurgerMenu from './BurgerMenu';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <header className={`w-full h-[50px] flex justify-between items-center header-bg px-2 outline ${isAdmin ? 'outline-[#EED40B]' : 'outline-[#0b61ee]'}`}>
      <Link href="/">
        <span className="font-bold text-[14px] text-white cursor-pointer font-jetbrains-mono">
          {isAdmin ? '< Admin />' : '< jeremie-m.dev />'}
        </span>
      </Link>

      <div className="flex items-center">
        {/* Navigation desktop */}
        <NavLinks />
        {children}
        {/* Menu burger pour mobile */}
        <BurgerMenu />
      </div>
    </header>
  );
};

export default Header; 