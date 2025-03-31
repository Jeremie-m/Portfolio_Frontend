"use client"

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/features/auth/contexts/AuthContext';

const Card = ({ skill }) => {
  const { isAdmin } = useAuth();

  return (
    <div 
    className={`
      w-[67px] 
      h-[117px] 
      md:w-[166px]
      md:h-[293px]
      lg:w-[236px]
      lg:h-[420px]
      ${isAdmin ? 'bg-[#caaa08]' : 'bg-[#0A52D0]'}
      rounded-[8px]
      md:rounded-[16px]
      lg:rounded-[24px]
      flex 
      flex-col 
      items-center 
      justify-center 
      gap-1
      md:gap-2
      lg:gap-3
      p-1
      md:p-2
      lg:p-3
    `}
    >
      <div className="w-[53px] h-[53px] md:w-[133px] md:h-[133px] lg:w-[180px] lg:h-[180px] relative">
        <Image
          src={skill.image_url}
          alt={`${skill.name} icon`}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-white text-[14px] md:text-[24px] lg:text-[34px] font-bold font-montserrat text-center">
        {skill.name}
      </h3>
    </div>
  )
}

export default Card 