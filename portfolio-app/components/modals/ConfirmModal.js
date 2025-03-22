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

    const getDisplayType = (type) => {
        switch (type) {
            case 'herobanner':
                return 'Texte';
            case 'skills':
                return 'compétence';
            case 'projects':
                return 'projet';
            default:
                return 'action';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Supprimer ${getDisplayType(type)}`}
            level={level}
            id="confirm-modal"
        >
            <div className="flex flex-col">
                <div className="mb-6">
                    <p className="text-white text-center text-[14px] md:text-[16px] lg:text-[24px] font-montserrat">
                        Êtes-vous sûr de vouloir supprimer {getDisplayType(type).toLowerCase()} ?
                        <br />
                        Cette action est irréversible.
                    </p>
                </div>
                
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-white bg-transparent border border-white rounded hover:bg-white/10 transition-colors duration-200"
                        aria-label="Annuler la suppression"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-[14px] md:text-[16px] lg:text-[24px] font-montserrat text-white bg-${confirmColor || 'red'}-500 rounded hover:bg-${confirmColor || 'red'}-600 transition-colors duration-200`}
                        aria-label={`Confirmer la suppression de ${getDisplayType(type).toLowerCase()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal; 