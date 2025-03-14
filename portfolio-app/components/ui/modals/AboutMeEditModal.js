'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from '@/components/ui/Button';
import { useAboutMe } from '@/hooks/useAboutMe';
import Loader from '@/components/ui/Loader';

const AboutMeEditModal = ({ isOpen, onClose }) => {
  const { content, isLoading, error, saveContent } = useAboutMe();
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content) {
      setEditedContent(content);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveContent(editedContent);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Éditer la section "Qui suis-je ?"</h2>
        
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-48 p-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Décrivez-vous..."
        />

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
            disabled={isSaving || editedContent === content}
          >
            {isSaving ? <Loader size="20" /> : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AboutMeEditModal; 