import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Projects = () => {
  // Liste des projets (à remplacer par vos propres projets)
  const projects = [
    {
      id: 1,
      title: 'Portfolio',
      description: 'Mon portfolio personnel développé avec Next.js et Tailwind CSS',
      image: '/images/portfolio.jpg',
      technologies: 'Next.js, Tailwind CSS',
      github: 'https://github.com/jeremie-m/portfolio',
      demo: 'https://jeremie-m.dev',
    },
    {
      id: 2,
      title: 'Blog Tech',
      description: 'Un blog sur les technologies web',
      image: '/images/blog.jpg',
      technologies: 'React, Node.js, MongoDB',
      github: 'https://github.com/jeremie-m/blog',
      demo: 'https://blog.jeremie-m.dev',
    },
    {
      id: 3,
      title: 'E-commerce',
      description: 'Une application e-commerce complète',
      image: '/images/ecommerce.jpg',
      technologies: 'Next.js, Nest.js, PostgreSQL',
      github: 'https://github.com/jeremie-m/ecommerce',
      demo: 'https://shop.jeremie-m.dev',
    },
  ];

  return (
    <section id="projects" className="w-full flex flex-col items-center gap-8 py-8">
      <h2 className="font-medium text-[24px] leading-[16px] text-center text-white">
        Mes Projets
      </h2>
      
      <div className="w-full flex flex-col gap-8 px-5">
        {projects.map((project) => (
          <div key={project.id} className="w-full bg-dark border border-primary rounded-lg overflow-hidden">
            <div className="w-full h-40 relative bg-gray-800">
              {/* Remplacer par vos propres images */}
              {/* <Image src={project.image} alt={project.title} layout="fill" objectFit="cover" /> */}
              <div className="w-full h-full flex items-center justify-center text-white">
                Image du projet: {project.title}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-white mb-2">{project.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{project.description}</p>
              <p className="text-xs text-gray-400 mb-4">Technologies: {project.technologies}</p>
              <div className="flex justify-between">
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-white bg-primary-dark hover:bg-primary px-3 py-1 rounded"
                >
                  GitHub
                </a>
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-white bg-primary hover:bg-primary-dark px-3 py-1 rounded"
                >
                  Démo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/projects">
        <div className="h-12 w-[143px] flex flex-col justify-center items-center gap-2 bg-gradient-to-b from-primary to-primary-dark rounded-lg cursor-pointer">
          <div className="justify-center items-center self-stretch grow px-6 py-2.5">
            <span className="font-medium text-xs text-center text-white">Voir plus de projets</span>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default Projects; 