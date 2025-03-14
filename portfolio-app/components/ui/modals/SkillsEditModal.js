'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import ConfirmModal from './ConfirmModal';
import { useSkills } from '@/hooks/useSkills';

const SkillsEditModal = ({ isOpen, onClose }) => {
  const { skills, isLoading, error, saveSkills, deleteSkill, addSkill } = useSkills();
  const [isSaving, setIsSaving] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const newInputRef = useRef(null);

  const handleSkillChange = async (id, field, value) => {
    const updatedSkills = skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    await saveSkills(updatedSkills);
  };

  const handleDeleteClick = (id) => {
    setSkillToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (skillToDelete) {
      try {
        await deleteSkill(skillToDelete);
        setSkillToDelete(null);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const handleCancelDelete = () => {
    setSkillToDelete(null);
  };

  const handleAddSkill = async () => {
    try {
      // Générer un nouvel ID unique
      const newId = Math.max(...skills.map(skill => skill.id), 0) + 1;
      
      const newSkill = {
        id: newId,
        name: "Nouvelle compétence",
        image_url: "/images/skills/defaut.svg",
        level: 1
      };

      const updatedSkills = [newSkill, ...skills];
      await saveSkills(updatedSkills);

      setTimeout(() => {
        if (newInputRef.current) {
          newInputRef.current.focus();
          newInputRef.current.select();
        }
      }, 0);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
    }
  };

  // Gestion du scroll de l'arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Erreur">
        <div className="text-red-500">{error}</div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Gestion des Skills"
      >
        <div className="flex flex-col h-[70vh]">
          <div className="sticky top-0 z-10 p-6 pb-4 border-b border-white/10">
            <button
              onClick={handleAddSkill}
              className="w-full h-[40px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
              disabled={isLoading || isSaving}
            >
              <span className="text-[14px] font-montserrat text-[#C8B20C]">
                Ajouter une compétence
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="flex items-center gap-2 min-w-0">
                    <Image 
                      src={skill.image_url || '/images/skills/default.svg'} 
                      alt={skill.name}
                      width={36}
                      height={36}
                      className="w-8 h-8 min-w-[32px] min-h-[32px] object-contain"
                    />
                    <input
                      ref={index === 0 ? newInputRef : null}
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border border-white rounded px-2 py-1.5 text-white text-[14px] font-montserrat focus:outline-none focus:border-primary focus:bg-white focus:text-black transition-colors duration-200"
                      disabled={isSaving}
                    />
                    <button 
                      onClick={() => handleDeleteClick(skill.id)}
                      className="p-1.5 hover:opacity-80 transition-opacity shrink-0"
                      disabled={isSaving}
                    >
                      <Image 
                        src="/images/delete.svg" 
                        alt="Supprimer" 
                        width={16} 
                        height={16}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-white/10 bg-transparent">
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading || isSaving}
            >
              {isSaving ? <Loader size="20" /> : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={skillToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        type="skills"
        confirmText="Supprimer"
        confirmColor="red"
        level={2}
      />
    </>
  );
};

export default SkillsEditModal; 