'use client';

import Image from 'next/image';

const EditBtn = ({ onOpenModal, section }) => {
  const handleClick = () => {
    onOpenModal(section);
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-2 text-[14px] font-jetbrains-mono text-white hover:text-[#EED40B] transition-colors duration-200 pb-1"
    >
      <Image 
        src="/images/edit.svg" 
        alt="Edit" 
        width={16} 
        height={16} 
      />
      Edit
    </button>
  );
};

export default EditBtn; 