'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { useHeroBanner } from '@/hooks/useHeroBanner';

const HeroEditModal = ({ isOpen, onClose }) => {
  const { 
    texts, 
    isLoading, 
    error, 
    saveTexts,
    deleteText,
    addText
  } = useHeroBanner();
  
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const newInputRef = useRef(null);

  const handleTextChange = async (id, newText) => {
    try {
      const updatedTexts = texts.map(item => 
        item.id === id ? { ...item, text: newText } : item
      );
      await saveTexts(updatedTexts);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      // TODO: Afficher un message d'erreur à l'utilisateur
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteText(itemToDelete);
        setItemToDelete(null);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        // TODO: Afficher un message d'erreur à l'utilisateur
      }
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleAddText = async () => {
    try {
      const newItem = await addText();
      
      // Focus sur le nouveau champ de texte
      setTimeout(() => {
        if (newInputRef.current) {
          newInputRef.current.focus();
          newInputRef.current.select();
        }
      }, 0);
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      // TODO: Afficher un message d'erreur à l'utilisateur
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveTexts(texts);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // TODO: Afficher un message d'erreur à l'utilisateur
    } finally {
      setIsSaving(false);
    }
  };

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
        title="Gestion Hero Banner"
      >
        <div className="space-y-4">
          <button
            onClick={handleAddText}
            className="w-full h-[40px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
            disabled={isLoading || isSaving}
          >
            <span className="text-[14px] font-montserrat text-[#C8B20C]">
              Ajouter un texte
            </span>
          </button>

          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <div className="flex flex-col gap-4">
              {texts.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input
                    ref={index === 0 ? newInputRef : null}
                    type="text"
                    value={item.text}
                    onChange={(e) => handleTextChange(item.id, e.target.value)}
                    className="flex-1 bg-transparent border border-white rounded px-3 py-2 text-white text-[14px] font-montserrat focus:outline-none focus:border-primary focus:bg-white focus:text-black transition-colors duration-200"
                    disabled={isSaving}
                  />
                  <button 
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-2 hover:opacity-80 transition-opacity"
                    disabled={isSaving}
                  >
                    <Image 
                      src="/images/delete.svg" 
                      alt="Supprimer" 
                      width={16} 
                      height={16}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 h-[40px] text-[14px] font-montserrat text-white bg-transparent border border-white rounded hover:bg-white/10 transition-colors duration-200"
              disabled={isSaving}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 h-[40px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
              disabled={isLoading || isSaving}
            >
              <span className="text-[14px] font-montserrat text-[#C8B20C]">
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </span>
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={itemToDelete !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        type="herobanner"
        confirmText="Supprimer"
        confirmColor="red"
        level={2}
      />
    </>
  );
};

export default HeroEditModal; 