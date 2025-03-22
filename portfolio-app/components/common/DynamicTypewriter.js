'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * Composant qui affiche un texte avec un effet de machine à écrire
 * Les textes sont affichés un par un, s'écrivent caractère par caractère,
 * puis sont effacés caractère par caractère avant de passer au texte suivant
 */
const DynamicTypewriter = ({ texts = [], speed = 100, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const totalBlinkTarget = useRef(0);
  
  // Filtrer uniquement les textes actifs
  const activeTexts = texts.filter(text => text.isActive);
  
  // Si aucun texte actif, afficher un texte par défaut
  if (activeTexts.length === 0) {
    activeTexts.push({ id: 0, text: 'Développeur Full-Stack', isActive: true });
  }
  
  // Texte actuel
  const currentText = activeTexts[currentIndex]?.text || '';
  
  // Calculer la vitesse de clignotement en fonction de la vitesse d'écriture
  // Plus la vitesse d'écriture est rapide, plus le clignotement est rapide
  const blinkSpeed = Math.max(200, 600 - speed * 2);
  
  useEffect(() => {
    let timeout;
    
    // Si tous les textes ont été affichés, revenir au premier
    if (currentIndex >= activeTexts.length) {
      setCurrentIndex(0);
      return;
    }
    
    // Période de clignotement quand le texte est complètement écrit
    if (!isDeleting && displayedText === currentText && !isBlinking) {
      // Générer un nombre aléatoire de clignotements entre 2 et 5
      totalBlinkTarget.current = Math.floor(Math.random() * 4) + 2;
      setIsBlinking(true);
      setBlinkCount(0);
      return;
    }
    
    // Gérer le clignotement
    if (isBlinking) {
      timeout = setTimeout(() => {
        setBlinkCount(prevCount => {
          if (prevCount >= totalBlinkTarget.current * 2) {
            setIsBlinking(false);
            setIsDeleting(true);
            return 0;
          }
          return prevCount + 1;
        });
      }, blinkSpeed); // Vitesse de clignotement proportionnelle à la vitesse d'écriture
      return () => clearTimeout(timeout);
    }
    
    // Délai avant la prochaine action (écriture ou effacement)
    const actionDelay = isDeleting ? speed / 2 : speed;
    
    // Gestion de l'écriture et de l'effacement
    timeout = setTimeout(() => {
      if (isDeleting) {
        // Effacer un caractère
        setDisplayedText(currentText.substring(0, displayedText.length - 1));
        
        // Si tout est effacé, passer au texte suivant
        if (displayedText.length <= 1) {
          setIsDeleting(false);
          setCurrentIndex(prevIndex => prevIndex + 1);
        }
      } else {
        // Ajouter un caractère
        setDisplayedText(currentText.substring(0, displayedText.length + 1));
      }
    }, actionDelay);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentIndex, currentText, speed, isBlinking, blinkCount, activeTexts.length, blinkSpeed]);
  
  // Déterminer si on affiche un underscore ou non
  // L'underscore apparaît seulement lorsque le texte est complet (pendant la phase de clignotement)
  // ou pendant la suppression (pour conserver un effet de curseur)
  const showCursor = displayedText === currentText || isDeleting;
  const cursor = showCursor ? (isBlinking ? (blinkCount % 2 === 0 ? '_' : '') : '_') : '';
  
  return (
    <span className={className}>
      {displayedText}{cursor}
    </span>
  );
};

export default DynamicTypewriter; 