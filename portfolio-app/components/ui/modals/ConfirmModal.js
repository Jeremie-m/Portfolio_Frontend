'use client';

import React from 'react';
import Modal from './Modal';

const ConfirmModal = (param) => {
    let { 
        isOpen, 
        onClose, 
        onConfirm, 
        type = 'default', 
        title = "Confirmation", 
        message, 
        cancelText = "Annuler", 
        confirmText = "Confirmer", 
        confirmColor = "red", // 'red' ou 'primary' par exemple
        level = 1
    } = param;

    const getDefaultMessage = () => {
        switch (type) {
            case 'herobanner':
                return "Êtes-vous sûr de vouloir supprimer ce texte ?";
            case 'skills':
                return "Es-tu sûr de vouloir supprimer cette compétence ?";
            case 'projects':
                return "Es-tu sûr de vouloir supprimer ce projet ?";
            default:
                return "Êtes-vous sûr de vouloir effectuer cette action ?";
        }
    };

    const finalMessage = message || getDefaultMessage();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            level={level}
        >
            <div className="space-y-4">
                <p className="text-white text-[14px] font-montserrat">
                    {finalMessage}
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
                        className={`px-4 h-[40px] rounded flex items-center justify-center border transition-colors duration-200 ${
                            confirmColor === 'red' 
                                ? 'bg-red-500 border-red-500 hover:bg-red-600' 
                                : 'bg-white border-white hover:bg-white/90'
                        }`}
                    >
                        <span className={`text-[14px] font-montserrat ${
                            confirmColor === 'red' 
                                ? 'text-white' 
                                : 'text-[#C8B20C]'
                        }`}>
                            {confirmText}
                        </span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal; 