"use client"

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext';

const Card = ({ skill }) => {
  const { isAdmin } = useAuth();

  return (
    <div 
    className={`
      w-[96px] 
      h-[170px] 
      md:w-[237px]
      md:h-[419px]
      lg:w-[338px]
      lg:h-[600px]
      ${isAdmin ? 'bg-[#caaa08]' : 'bg-[#0A52D0]'}
      px-4 
      py-3.5 
      md:px-8
      md:py-6
      lg:px-12
      lg:py-10
      flex 
      flex-col 
      items-center 
      gap-7
      md:gap-10
      lg:gap-16
      rounded-lg
    `}
    >
      <div className="w-[76px] h-[76px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] relative">
        <Image
          src={skill.image_url}
          alt={`${skill.name} icon`}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-white text-[16px] md:text-[32px] lg:text-[48px] font-bold font-montserrat text-center">
        {skill.name}
      </h3>
    </div>
  )
}

export default Card 