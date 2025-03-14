"use client"

import React from 'react'
import Image from 'next/image'

const Card = ({ skill }) => {
  return (
    <div 
      className="
        w-[96px] 
        h-[170px] 
        bg-[#0A52D0] 
        px-4 
        py-3.5 
        flex 
        flex-col 
        items-center 
        gap-7
        rounded-lg
      "
    >
      <div className="w-[76px] h-[76px] relative">
        <Image
          src={skill.image_url}
          alt={`${skill.name} icon`}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-white text-[16px] font-bold font-montserrat">
        {skill.name}
      </h3>
    </div>
  )
}

export default Card 