import React from 'react';
import Image from 'next/image';

const Skills = () => {
  // Liste des compétences (à remplacer par vos propres compétences)
  const skills = [
    { name: 'HTML', icon: '/images/html.png' },
    { name: 'CSS', icon: '/images/css.png' },
    { name: 'JavaScript', icon: '/images/javascript.png' },
    { name: 'React', icon: '/images/react.png' },
    { name: 'Next.js', icon: '/images/nextjs.png' },
    { name: 'Node.js', icon: '/images/nodejs.png' },
    { name: 'Express', icon: '/images/express.png' },
    { name: 'Nest.js', icon: '/images/nestjs.png' },
    { name: 'MongoDB', icon: '/images/mongodb.png' },
    { name: 'PostgreSQL', icon: '/images/postgresql.png' },
    { name: 'Tailwind CSS', icon: '/images/tailwind.png' },
    { name: 'Figma', icon: '/images/figma.png' },
  ];

  return (
    <section id="skills" className="flex flex-col items-center gap-5 py-8">
      <h2 className="font-medium text-[24px] leading-[16px] text-center text-white">
        Mes Compétences
      </h2>
      <div className="w-80 grid grid-cols-3 gap-4 p-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 relative mb-2">
              {/* Remplacer par vos propres images */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                {/* Utiliser Image quand vous aurez les images */}
                {/* <Image src={skill.icon} alt={skill.name} width={40} height={40} /> */}
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                  {skill.name.substring(0, 2)}
                </div>
              </div>
            </div>
            <span className="text-xs text-white text-center">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills; 