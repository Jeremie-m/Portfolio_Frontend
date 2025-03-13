'use client';

import React from 'react';
import Modal from './Modal';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = 'default', // 'herobanner', 'skills', 'projects', 'default'
  title = "Confirmation",
  message,
  cancelText = "Annuler",
  confirmText = "Confirmer",
  confirmColor = "red" // 'red' ou 'primary' par exemple
}) => {
  const getDefaultMessage = () => {
    switch (type) {
      case 'herobanner':
        return "Es-tu sûr de vouloir supprimer ce texte ?";
      case 'skills':
        return "Es-tu sûr de vouloir supprimer cette compétence ?";
      case 'projects':
        return "Es-tu sûr de vouloir supprimer ce projet ?";
      default:
        return "Es-tu sûr ?";
    }
  };

  const getConfirmButtonClasses = () => {
    const baseClasses = "px-4 h-[40px] text-white rounded flex items-center justify-center transition-colors duration-200 ";
    
    if (confirmColor === 'red') {
      return baseClasses + "bg-red-500 border border-red-500 hover:bg-red-600";
    }
    return baseClasses + "bg-primary border border-primary hover:bg-primary/90";
  };

  // Utilise le message personnalisé s'il est fourni, sinon utilise le message par défaut selon le type
  const displayMessage = message || getDefaultMessage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="space-y-4">
        <p className="text-white text-[14px] font-montserrat">
          {displayMessage}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 h-[40px] text-[14px] font-montserrat text-white bg-transparent border border-white rounded hover:bg-white/10 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={getConfirmButtonClasses()}
          >
            <span className="text-[14px] font-montserrat">
              {confirmText}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal; 