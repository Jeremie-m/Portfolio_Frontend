'use client';

import React from 'react';
import NavLinks from '@/components/ui/NavLinks';
import Modal from './Modal';

const BurgerMenu = ({ isOpen, onOpen, onClose }) => {
  const handleToggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <div className="md:hidden">
      <button 
        onClick={handleToggle}
        className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Menu"
      >
        {/* Navigation */}
        <div className="flex flex-col">
          <NavLinks onClick={onClose} isModal={true} />
        </div>
      </Modal>
    </div>
  );
};

export default BurgerMenu; 