"use client";

import React from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import BurgerMenu from './BurgerMenu';

const Header = () => {
  return (
    <header className="w-full h-[50px] flex justify-between items-center header-bg px-2 outline outline-[#0b61ee] header-bg">
      <Link href="/">
        <span className="font-bold text-[14px] text-white cursor-pointer font-jetbrains-mono">
          &lt; jeremie-m.dev /&gt;
        </span>
      </Link>
      
      {/* Navigation desktop */}
      <NavLinks />
      
      {/* Menu burger pour mobile */}
      <BurgerMenu />
    </header>
  );
};

export default Header; 