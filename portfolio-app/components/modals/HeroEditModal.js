'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { heroBannerTexts } from '@/mocks/herobanner';

const HeroEditModal = ({ isOpen, onClose }) => {
  const [texts, setTexts] = useState(heroBannerTexts);
  const [itemToDelete, setItemToDelete] = useState(null);
  const newInputRef = useRef(null);

  const handleTextChange = (id, newText) => {
    setTexts(texts.map(item => 
      item.id === id ? { ...item, text: newText } : item
    ));
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTexts(texts.filter(item => item.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleAddText = () => {
    const newId = Math.max(...texts.map(item => item.id)) + 1;
    const newItem = {
      id: newId,
      text: "Nouveau texte",
      isActive: true
    };
    setTexts([newItem, ...texts]);

    setTimeout(() => {
      if (newInputRef.current) {
        newInputRef.current.focus();
        newInputRef.current.select();
      }
    }, 0);
  };

  const handleSave = () => {
    console.log('Textes à sauvegarder:', texts);
    onClose();
  };

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
          >
            <span className="text-[14px] font-montserrat text-[#C8B20C]">
              Ajouter un texte
            </span>
          </button>

          <div className="flex flex-col gap-4">
            {texts.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <input
                  ref={index === 0 ? newInputRef : null}
                  type="text"
                  value={item.text}
                  onChange={(e) => handleTextChange(item.id, e.target.value)}
                  className="flex-1 bg-transparent border border-white rounded px-3 py-2 text-white text-[14px] font-montserrat focus:outline-none focus:border-primary focus:bg-white focus:text-black transition-colors duration-200"
                />
                <button 
                  onClick={() => handleDeleteClick(item.id)}
                  className="p-2 hover:opacity-80 transition-opacity"
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

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 h-[40px] text-[14px] font-montserrat text-white bg-transparent border border-white rounded hover:bg-white/10 transition-colors duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 h-[40px] bg-white rounded flex items-center justify-center border border-white hover:bg-white/90 transition-colors duration-200"
            >
              <span className="text-[14px] font-montserrat text-[#C8B20C]">
                Enregistrer
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
      />
    </>
  );
};

export default HeroEditModal; 