'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/modals/Modal';
import ConfirmModal from '@/components/modals/ConfirmModal';
import SuccessToast from '@/components/common/SuccessToast';
import { useHeroBanner } from '@/features/herobanner/hooks/useHeroBanner';

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
  const [localTexts, setLocalTexts] = useState([]);
  const newInputRef = useRef(null);
  
  // État pour les notifications toast
  const [toast, setToast] = useState({
    visible: false,
    message: '',
  });

  // Fonction pour afficher un toast
  const showToast = (message) => {
    setToast({
      visible: true,
      message,
    });
  };

  // Fonction pour fermer le toast
  const closeToast = () => {
    setToast({
      ...toast,
      visible: false,
    });
  };

  React.useEffect(() => {
    setLocalTexts(texts);
  }, [texts]);

  const handleTextChange = (id, newText) => {
    const updatedTexts = localTexts.map(item => 
      item.id === id ? { ...item, text: newText } : item
    );
    setLocalTexts(updatedTexts);
  };

  const handleTextBlur = async (id) => {
    try {
      const originalItem = texts.find(item => item.id === id);
      const updatedItem = localTexts.find(item => item.id === id);
      
      if (originalItem && updatedItem && originalItem.text !== updatedItem.text) {
        await saveTexts([updatedItem]);
        showToast('Texte modifié avec succès');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
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
        showToast('Texte supprimé avec succès');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleAddText = async () => {
    try {
      const newItem = await addText();
      showToast('Nouveau texte ajouté avec succès');
      
      // Focus sur le nouveau champ de texte
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveTexts(localTexts);
      showToast('Tous les textes ont été enregistrés');
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
        <div className="flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-4 skills-scrollbar">
            <button
              onClick={handleAddText}
              className="w-full h-[40px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200 mb-6"
              disabled={isLoading || isSaving}
            >
              <span className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-[#C8B20C]">
                Ajouter un texte
              </span>
            </button>

            {isLoading ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              <div className="flex flex-col gap-4">
                {localTexts.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input
                      ref={index === 0 ? newInputRef : null}
                      type="text"
                      value={item.text}
                      onChange={(e) => handleTextChange(item.id, e.target.value)}
                      onBlur={() => handleTextBlur(item.id)}
                      className="flex-1 bg-transparent border border-white rounded px-3 py-2 text-white text-[14px] md:text-[16px] lg:text-[24px] font-montserrat focus:outline-none focus:border-primary focus:bg-white focus:text-black transition-colors duration-200"
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
                        className="w-4 h-4 md:w-8 md:h-8 lg:w-12 lg:h-12"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-white/10 bg-transparent">
            <button
              onClick={onClose}
              className="px-4 h-[40px] text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-white bg-transparent border border-white rounded hover:bg-white/10 transition-colors duration-200"
              disabled={isSaving}
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 h-[40px] text-[14px] md:text-[16px] lg:text-[24px] font-montserrat bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
              disabled={isLoading || isSaving}
            >
              <span className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-[#C8B20C]">
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

      {/* Toast de succès */}
      <SuccessToast
        isVisible={toast.visible}
        message={toast.message}
        onClose={closeToast}
        duration={3000}
      />
    </>
  );
};

export default HeroEditModal; 