import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full h-[120px] md:h-[120px] lg:h-[180px] flex justify-center items-center gap-2.5 bg-black px-[13px] py-[38px]">
      <span className="font-bold text-[10px] md:text-[14px] lg:text-[16px] font-jetbrains-mono text-center text-white">
        © {currentYear} Jérémie Marie. Tous droits réservés.
        <br />| Designed & developped by Jérémie Marie |
      </span>
    </footer>
  );
};

export default Footer; 