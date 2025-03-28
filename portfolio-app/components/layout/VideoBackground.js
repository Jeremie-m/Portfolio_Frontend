"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthContext';

const VideoBackground = () => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { isAdmin } = useAuth();
  const [videoSrc, setVideoSrc] = useState(null);

  // Effet pour gérer la source de la vidéo
  useEffect(() => {
    setVideoSrc(isAdmin ? "/videos/fondadmin.mp4" : "/videos/fond.mp4");
  }, [isAdmin]);

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;

    // Fonction pour gérer le chargement de la vidéo
    const handleVideoLoad = () => {
      setIsLoaded(true);
      
      // Tenter de lire la vidéo une fois chargée
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Erreur de lecture automatique de la vidéo:", error);
          });
      }
    };

    // Fonction pour gérer la fin de la vidéo
    const handleEnded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    };

    // Vérifier si la vidéo est déjà mise en cache
    if (videoRef.current.readyState >= 3) {
      handleVideoLoad();
    } else {
      // Sinon, attendre que la vidéo soit suffisamment chargée
      videoRef.current.addEventListener('canplay', handleVideoLoad);
      
      // Précharger la vidéo en arrière-plan
      videoRef.current.load();
    }

    // Ajouter l'écouteur pour la fin de la vidéo
    videoRef.current.addEventListener('ended', handleEnded);

    return () => {
      // Nettoyage des écouteurs d'événements
      if (videoRef.current) {
        videoRef.current.removeEventListener('canplay', handleVideoLoad);
        videoRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [videoSrc]);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-999] debug-screens">
      {/* Afficher un fond uni pendant le chargement de la vidéo */}
      <div 
        className={`absolute top-0 left-0 w-full h-full bg-dark transition-opacity duration-1000 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {videoSrc && (
        <video
          key={videoSrc}
          ref={videoRef}
          className={`absolute min-w-full min-h-full object-cover transition-opacity duration-1000 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          playsInline
          preload="metadata"
          style={{ willChange: 'transform' }}
        >
          <source src={videoSrc} type="video/mp4" />
          Votre navigateur ne prend pas en charge les vidéos HTML5.
        </video>
      )}
      
      {/* Overlay pour ajuster l'opacité/contraste */}
      <div className="absolute top-0 left-0 w-full h-full bg-dark opacity-30"></div>
    </div>
  );
};

export default VideoBackground; 