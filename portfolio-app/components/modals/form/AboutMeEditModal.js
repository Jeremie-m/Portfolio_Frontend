'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/modals/Modal';
import Button from '@/components/common/Button';
import { useAboutMe } from '@/features/aboutme/hooks/useAboutMe';
import Loader from '@/components/common/Loader';

const AboutMeEditModal = ({ isOpen, onClose }) => {
  const {text, isLoading, error, saveContent, refreshContent } = useAboutMe();
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (text) {
      setEditedContent(text);
    }
  }, [text]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Sauvegarder et attendre la réponse
      const updatedData = await saveContent(editedContent);
      
      // Mise à jour réussie, fermer le modal
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-center items-center h-40">
          <Loader />
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-red-500 text-center p-4">
          Une erreur est survenue lors du chargement des données.
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Gestion du texte"
    >
      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 p-4">    
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full p-4 bg-transparent border border-white rounded-lg text-white text-[14px] md:text-[16px] lg:text-[24px] font-montserrat focus:outline-none focus:border-primary focus:bg-white focus:text-black transition-colors duration-200 resize-none overflow-y-auto skills-scrollbar"
            placeholder="Décrivez-vous..."
          />
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-white/10 bg-transparent">
          <Button 
            onClick={onClose}
            variant="secondary"
            disabled={isSaving}
            className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || editedContent === text}
            variant="primary"
            className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
          >
            {isSaving ? <Loader size="20" /> : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AboutMeEditModal; 