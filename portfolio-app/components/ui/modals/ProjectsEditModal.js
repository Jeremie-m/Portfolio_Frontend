'use client';

import { useState } from 'react';
import Modal from './Modal';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

const ProjectsEditModal = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Logique de sauvegarde à implémenter
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Éditer les projets"
    >
      <div className="p-6 space-y-6">
        {/* Contenu de la modale à implémenter */}
        <div className="flex justify-end space-x-4">
          <Button 
            onClick={onClose}
            variant="secondary"
            disabled={isSaving}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader size="20" /> : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectsEditModal; 