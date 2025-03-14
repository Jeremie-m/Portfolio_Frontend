import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full h-[118px] flex justify-center items-center gap-2.5 bg-black px-[13px] py-[38px]">
      <span className="font-bold text-[10px] font-jetbrains-mono text-center text-white">
        © {currentYear} Jérémie Marie. Tous droits réservés.
        <br />| Designed & developped by Jérémie Marie |
      </span>
    </footer>
  );
};

export default Footer; 