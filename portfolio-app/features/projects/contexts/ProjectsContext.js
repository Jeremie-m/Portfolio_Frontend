'use client';

import { createContext, useContext, useState } from 'react';
import { projects as mockProjects } from '@/features/projects/mocks/projects';

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [globalProjects, setGlobalProjects] = useState([...mockProjects]);

  const value = {
    globalProjects,
    setGlobalProjects
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
} 