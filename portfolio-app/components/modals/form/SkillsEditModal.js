'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Modal from '@/components/modals/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { useSkills } from '@/features/skills/hooks/useSkills';

const SkillsEditModal = ({ isOpen, onClose }) => {
  const { skills, isLoading, error, updateSkill, deleteSkill, addSkill } = useSkills();
  const [isSaving, setIsSaving] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [tempImageUrls, setTempImageUrls] = useState({});
  const [lastAddedId, setLastAddedId] = useState(null);
  const [localSkills, setLocalSkills] = useState([]);
  const [modifiedSkills, setModifiedSkills] = useState(new Set());
  const fileInputRef = useRef(null);

  // Initialiser localSkills avec les skills actuels quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setLocalSkills([...skills]);
      setModifiedSkills(new Set()); // Réinitialiser les modifications
      setTempImageUrls({}); // Réinitialiser les images temporaires
    }
  }, [isOpen, skills]);

  const handleSkillChange = (id, field, value) => {
    const updatedSkills = localSkills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    setLocalSkills(updatedSkills);
    setModifiedSkills(prev => new Set(prev).add(id));  // Marquer comme modifié uniquement lors d'un changement
  };

  const handleSkillUpdate = async (id) => {
    try {
      const skill = localSkills.find(s => s.id === id);
      if (!skill) return;
      
      // Ne garder que les propriétés nécessaires
      const skillToUpdate = {
        name: skill.name,
        image_url: skill.image_url
      };
      
      await updateSkill(id, skillToUpdate);
      setModifiedSkills(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleSkillBlur = async (id) => {
    // Ne rien faire, les modifications seront sauvegardées lors du clic sur Sauvegarder
  };

  const handleKeyDown = async (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSkillUpdate(id);
    }
  };

  const handleImageClick = (skillId) => {
    fileInputRef.current = skillId;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/svg+xml,image/webp';
    input.onchange = (e) => handleImageUpload(e, skillId);
    input.click();
  };

  const handleImageUpload = async (e, skillId) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Le fichier est trop volumineux. Taille maximale : 4MB');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    
    // Mettre à jour tempImageUrls pour l'affichage
    setTempImageUrls(prev => ({
      ...prev,
      [skillId]: imageUrl
    }));
    
    // Mettre à jour localSkills avec la nouvelle image_url
    setLocalSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { ...skill, image_url: imageUrl }
        : skill
    ));
    
    setModifiedSkills(prev => new Set(prev).add(skillId));
  };

  const handleDeleteClick = (id) => {
    setSkillToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (skillToDelete) {
      try {
        const updatedSkills = localSkills.filter(skill => skill.id !== skillToDelete);
        setLocalSkills(updatedSkills);
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

  const handleAddSkill = async (event) => {
    try {
      const newSkill = {
        name: "Nouvelle compétence",
        image_url: "/images/skills/defaut.svg",
      };

      console.log("Envoi de la nouvelle skill:", newSkill);

      const createdSkill = await addSkill(newSkill);
      console.log('Skill créée par l\'API:', createdSkill);
      
      setLastAddedId(createdSkill.id);
      setLocalSkills(prev => [...prev, createdSkill]);

      // Attendre le prochain cycle de rendu pour que l'input soit créé
      setTimeout(() => {
        const input = document.querySelector(`input[data-skill-id="${createdSkill.id}"]`);
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ne mettre à jour que les skills modifiées qui n'ont pas encore été sauvegardées
      const updatePromises = Array.from(modifiedSkills).map(id => {
        const skill = localSkills.find(s => s.id === id);
        return updateSkill(id, skill);
      });
      
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Réinitialiser l'état local avec les skills originaux
    setLocalSkills([...skills]);
    setTempImageUrls({});
    onClose();
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
              onKeyDown={handleAddSkill}
              className="w-full h-[40px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
              disabled={isLoading || isSaving}
            >
              <span className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-[#C8B20C]">
                Ajouter une compétence
              </span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4 skills-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {localSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 min-w-0">
                    <div 
                      className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 min-w-[32px] min-h-[32px] md:min-w-[40px] md:min-h-[40px] lg:min-w-[48px] lg:min-h-[48px] cursor-pointer"
                      onClick={() => handleImageClick(skill.id)}
                    >
                      <Image 
                        src={tempImageUrls[skill.id] || skill.image_url} 
                        alt={skill.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <input
                      data-skill-id={skill.id}
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, skill.id)}
                      onBlur={() => handleSkillBlur(skill.id)}
                      className="flex-1 min-w-0 bg-transparent border border-white rounded px-2 py-1.5 text-white text-[14px] md:text-[16px] lg:text-[24px] font-montserrat focus:outline-none focus:border-primary focus:bg-white focus:text-black transition-colors duration-200"
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
                        className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-white/10 bg-transparent">
            <Button
              onClick={handleCancel}
              variant="secondary"
              disabled={isSaving}
              className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving}
              className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
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

      <Modal
        isOpen={uploadError !== null}
        onClose={() => setUploadError(null)}
        title="Erreur d'upload"
      >
        <div className="text-red-500">{uploadError}</div>
      </Modal>
    </>
  );
};

export default SkillsEditModal; 