'use client';

import { createContext, useContext, useState } from 'react';
import { skills as mockSkills } from '@/features/skills/mocks/skills';

const SkillsContext = createContext();

export function SkillsProvider({ children }) {
  const [globalSkills, setGlobalSkills] = useState([...mockSkills]);

  const value = {
    globalSkills,
    setGlobalSkills
  };

  return (
    <SkillsContext.Provider value={value}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkillsContext() {
  const context = useContext(SkillsContext);
  if (!context) {
    throw new Error('useSkillsContext must be used within a SkillsProvider');
  }
  return context;
} 