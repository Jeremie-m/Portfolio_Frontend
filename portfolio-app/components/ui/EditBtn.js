'use client';

import Image from 'next/image';

const EditBtn = ({ onOpenModal, section }) => {
  const handleClick = () => {
    onOpenModal(section);
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-2 text-[14px] md:text-[20px] lg:text-[32px] font-jetbrains-mono text-white hover:text-[#EED40B] transition-colors duration-200 pb-1"
    >
      <Image 
        src="/images/edit.svg" 
        alt="Edit" 
        width={16} 
        height={16}
        className="w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12"
      />
      Edit
    </button>
  );
};

export default EditBtn; 