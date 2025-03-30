'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ConfirmModal from '@/components/modals/ConfirmModal';
import ProjectAddModal from './ProjectAddModal';
import ProjectEditModal from './ProjectEditModal';
import { useProjects } from '@/features/projects/hooks/useProjects';
import Image from 'next/image';
import SuccessToast from '@/components/common/SuccessToast';

const ProjectsEditModal = ({ isOpen, onClose }) => {
  const { globalProjects, isLoading, deleteProject, saveProjects, editProject } = useProjects();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [localProjects, setLocalProjects] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialiser localProjects avec les projets actuels quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setLocalProjects([...globalProjects]);
    }
  }, [isOpen, globalProjects]);

  const handleDeleteClick = (id, e) => {
    e.stopPropagation(); // Empêcher le déclenchement du handleEdit sur le parent
    setProjectToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        setIsSaving(true);
        await deleteProject(projectToDelete);
        // Les projets sont déjà mis à jour dans l'état global grâce au hook useProjects
        const updatedProjects = localProjects.filter(project => project.id !== projectToDelete);
        setLocalProjects(updatedProjects);

        setSuccessMessage('Projet supprimé avec succès !');
        setShowSuccessToast(true);

      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setIsSaving(false);
        setProjectToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setProjectToDelete(null);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProject(null);
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveProjects(localProjects);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
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

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title="Gestion des projets"
      >
        <div className="flex flex-col h-[70vh]">
          <div className="sticky top-0 z-10 p-6 pb-4 border-b border-white/10">
            <button
              onClick={handleAdd}
              className="w-full h-[40px] md:h-[50px] lg:h-[60px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
              disabled={isLoading || isSaving}
            >
              <span className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-[#C8B20C]">
                Ajouter un projet
              </span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader size="40" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 pt-4 skills-scrollbar">
              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                {localProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="bg-primary-dark rounded-lg border border-primary overflow-hidden cursor-pointer hover:bg-primary-900 transition-colors duration-200"
                    onClick={() => handleEdit(project)}
                  >
                    {/* Image de couverture */}
                    <div className="w-full h-32 md:h-40 lg:h-48 relative">
                      <Image 
                        src={project.image_url} 
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="p-4 md:p-5 lg:p-6 flex flex-wrap sm:flex-nowrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold font-montserrat text-white truncate">{project.title}</h3>
                        <p className="text-sm md:text-base lg:text-lg text-white-300 break-words font-montserrat line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.skills.map((tech, index) => (
                            <span 
                              key={index}
                              className="text-xs md:text-sm lg:text-base bg-primary px-2 py-1 border border-primary rounded-xl text-white font-montserrat"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={(e) => handleDeleteClick(project.id, e)}
                          className="p-2 text-white hover:text-red-500 transition-colors"
                          disabled={isSaving}
                        >
                          <Image 
                            src="/images/delete.svg" 
                            alt="Supprimer" 
                            width={20} 
                            height={20}
                            className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-white/10 bg-transparent">
            <Button 
              onClick={onClose}
              variant="secondary"
              disabled={isSaving}
              className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
            >
              Fermer
            </Button>
            <Button 
              onClick={handleSave}
              variant="primary"
              disabled={isSaving}
              className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Loader size="20" />
                  <span>Enregistrement...</span>
                </div>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={projectToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        type="projects"
        confirmText="Supprimer"
        confirmColor="red"
        level={2}
      />

      <ProjectAddModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
      />
      
      {selectedProject && (
        <ProjectEditModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          project={selectedProject}
        />
      )}

      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
    </>
  );
};

export default ProjectsEditModal; 