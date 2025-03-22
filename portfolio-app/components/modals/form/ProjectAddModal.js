'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Modal from '@/components/modals/Modal';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import SuccessToast from '@/components/common/SuccessToast';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useSkills } from '@/features/skills/hooks/useSkills';

const ProjectAddModal = ({ isOpen, onClose }) => {
  const { addProject } = useProjects();
  const { skills } = useSkills();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [tempImageUrl, setTempImageUrl] = useState('/images/projects/default.jpg');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    technologies: '',
    github_link: '',
    demo_link: '',
    image_url: ''
  });
  
  // État pour stocker les données du nouveau projet
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    technologies: [],
    github_link: '',
    demo_link: '',
    image_url: '/images/projects/default.jpg'
  });

  // Réinitialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setProjectData({
        title: '',
        description: '',
        technologies: [],
        github_link: '',
        demo_link: '',
        image_url: '/images/projects/default.jpg'
      });
      setTempImageUrl('/images/projects/default.jpg');
      setUploadError(null);
      setErrors({
        title: '',
        description: '',
        technologies: '',
        github_link: '',
        demo_link: '',
        image_url: ''
      });
    }
  }, [isOpen]);

  // Fonction de validation d'URL
  const isValidUrl = (url) => {
    if (!url) return true; // On permet les URLs vides pour l'instant
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocole
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // nom de domaine
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OU adresse IP
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port et chemin
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // paramètres de requête
      '(\\#[-a-z\\d_]*)?$', // fragment
      'i'
    );
    return pattern.test(url);
  };

  // Valider un champ spécifique
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          errorMessage = 'Le titre est obligatoire';
        }
        break;
      case 'description':
        if (!value.trim()) {
          errorMessage = 'La description est obligatoire';
        }
        break;
      case 'technologies':
        if (value.length === 0) {
          errorMessage = 'Au moins une technologie est requise';
        }
        break;
      case 'github_link':
        if (value.trim() && !isValidUrl(value)) {
          errorMessage = 'Veuillez entrer une URL valide';
        }
        break;
      case 'demo_link':
        if (value.trim() && !isValidUrl(value)) {
          errorMessage = 'Veuillez entrer une URL valide';
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/svg+xml,image/webp';
    input.onchange = (e) => handleImageUpload(e);
    input.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Le fichier est trop volumineux. Taille maximale : 4MB');
      setErrors({
        ...errors,
        image_url: 'Le fichier est trop volumineux. Taille maximale : 4MB'
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setTempImageUrl(imageUrl);
    setProjectData({
      ...projectData,
      image_url: imageUrl
    });
    setUploadError(null);
    setErrors({
      ...errors,
      image_url: ''
    });

    console.log('Image sélectionnée (mock) :', {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    });
  };

  const handleInputChange = (field, value) => {
    // Mettre à jour les données
    setProjectData({
      ...projectData,
      [field]: value
    });
    
    // Valider le champ et mettre à jour les erreurs
    const errorMessage = validateField(field, value);
    setErrors({
      ...errors,
      [field]: errorMessage
    });
  };

  const handleSkillInput = (value) => {
    if (value.trim() === '') {
      // Afficher tous les skills si le champ est vide
      setFilteredSkills(skills);
      setShowSkillsDropdown(true);
      return;
    }
    
    const searchTerm = value.toLowerCase();
    
    // Filtrer les skills qui contiennent la recherche
    const filtered = skills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm)
    );
    
    // Trier les résultats par pertinence
    const sortedResults = filtered.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Si a commence par le terme de recherche mais pas b
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) {
        return -1;
      }
      
      // Si b commence par le terme de recherche mais pas a
      if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) {
        return 1;
      }
      
      // Si les deux commencent par le terme de recherche, trier alphabétiquement
      if (aName.startsWith(searchTerm) && bName.startsWith(searchTerm)) {
        return aName.localeCompare(bName);
      }
      
      // Pour les autres cas (aucun ne commence par le terme), trier par position du terme
      const aIndex = aName.indexOf(searchTerm);
      const bIndex = bName.indexOf(searchTerm);
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex; // Trier par position du terme dans le nom
      }
      
      // Si la position est la même, trier alphabétiquement
      return aName.localeCompare(bName);
    });
    
    setFilteredSkills(sortedResults);
    setShowSkillsDropdown(sortedResults.length > 0);
  };

  const handleSkillFocus = () => {
    // Afficher tous les skills disponibles quand l'input obtient le focus
    setFilteredSkills(skills);
    setShowSkillsDropdown(true);
  };

  const handleAddSkill = (skillName) => {
    if (!projectData.technologies.includes(skillName)) {
      const newTechnologies = [...projectData.technologies, skillName];
      setProjectData({
        ...projectData,
        technologies: newTechnologies
      });
      
      // Valider le champ technologies
      const errorMessage = validateField('technologies', newTechnologies);
      setErrors({
        ...errors,
        technologies: errorMessage
      });
    }
    setShowSkillsDropdown(false);
    document.getElementById('skills-input').value = '';
  };

  const handleRemoveSkill = (skillName) => {
    const newTechnologies = projectData.technologies.filter(tech => tech !== skillName);
    setProjectData({
      ...projectData,
      technologies: newTechnologies
    });
    
    // Valider le champ technologies
    const errorMessage = validateField('technologies', newTechnologies);
    setErrors({
      ...errors,
      technologies: errorMessage
    });
  };

  // Fonction pour valider tous les champs avant la soumission
  const validateAllFields = () => {
    const newErrors = {
      title: validateField('title', projectData.title),
      description: validateField('description', projectData.description),
      technologies: validateField('technologies', projectData.technologies),
      github_link: validateField('github_link', projectData.github_link),
      demo_link: validateField('demo_link', projectData.demo_link),
      image_url: ''
    };
    
    setErrors(newErrors);
    
    // Vérifier s'il y a des erreurs
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSave = async () => {
    // Valider tous les champs
    const isValid = validateAllFields();
    
    if (!isValid) {
      // Il y a des erreurs, ne pas soumettre
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('Données du projet à envoyer (simulé) :', projectData);
      
      // Simulation de l'appel API
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(projectData)
      // });
      // const data = await response.json();
      
      // Ajouter le nouveau projet à l'état global
      await addProject(projectData);
      setSuccessMessage('Projet créé avec succès !');
      
      // Afficher la notification de succès
      setShowSuccessToast(true);
      
      // Fermer la modal après succès
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error);
      setUploadError('Erreur lors de l\'ajout du projet. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  // Style commun pour les messages d'erreur
  const errorStyle = "text-white font-bold text-xs mt-1 font-montserrat";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Ajouter un Projet"
        level={2}
      >
        <div className="flex flex-col h-[70vh]">
          <div className="flex-1 overflow-y-auto p-4 skills-scrollbar">
            {uploadError && (
              <div className="bg-white/10 text-white font-bold p-2 mb-4 rounded">
                {uploadError}
              </div>
            )}
            
            {/* Image de couverture */}
            <div className="mb-6">
              <label className="block text-white text-sm md:text-base lg:text-lg font-montserrat mb-2">
                Image de couverture
              </label>
              <div className="flex items-center gap-4">
                {tempImageUrl && tempImageUrl !== '/images/projects/default.jpg' ? (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden">
                    <Image 
                      src={tempImageUrl}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                    />
                    <button 
                      onClick={() => {
                        setTempImageUrl('/images/projects/default.jpg');
                        setProjectData({
                          ...projectData,
                          image_url: '/images/projects/default.jpg'
                        });
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
                      type="button"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleImageClick}
                    type="button"
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white rounded-lg flex flex-col items-center justify-center text-[#C8B20C] font-montserrat hover:bg-white/90 transition-colors duration-200"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mt-1 text-xs md:text-sm lg:text-base">Ajouter</span>
                  </button>
                )}
                <div className="flex-1">
                  <p className="text-white/100 text-sm md:text-base lg:text-lg">
                    Format recommandé : JPEG, PNG, WebP, max 4MB
                  </p>
                </div>
              </div>
              {errors.image_url && <p className={errorStyle}>{errors.image_url}</p>}
            </div>
            
            {/* Champ titre */}
            <div className="mb-4 md:mb-5 lg:mb-6">
              <label className="block text-white text-sm md:text-base lg:text-lg font-montserrat mb-2">
                Titre
              </label>
              <input
                type="text"
                value={projectData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full bg-primary-dark border ${errors.title ? 'border-white' : 'border-white/30'} rounded px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-white text-sm md:text-base lg:text-lg font-montserrat focus:outline-none focus:border-white/100 transition-colors duration-200`}
                placeholder="Titre du projet"
              />
              {errors.title && <p className={`${errorStyle} md:text-sm lg:text-base`}>{errors.title}</p>}
            </div>
            
            {/* Champ description */}
            <div className="mb-4 md:mb-5 lg:mb-6">
              <label className="block text-white text-sm md:text-base lg:text-lg font-montserrat mb-2">
                Description
              </label>
              <textarea
                value={projectData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full bg-primary-dark border ${errors.description ? 'border-white' : 'border-white/30'} rounded px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-white text-sm md:text-base lg:text-lg font-montserrat focus:outline-none focus:border-white/100 transition-colors duration-200 min-h-[100px] md:min-h-[120px] lg:min-h-[150px]`}
                placeholder="Description du projet"
              />
              {errors.description && <p className={`${errorStyle} md:text-sm lg:text-base`}>{errors.description}</p>}
            </div>
            
            {/* Champ technologies avec autocomplétion */}
            <div className="mb-4 md:mb-5 lg:mb-6">
              <label className="block text-white text-sm md:text-base lg:text-lg font-montserrat mb-2">
                Skills
              </label>
              <div className="relative">
                <input
                  id="skills-input"
                  type="text"
                  onChange={(e) => handleSkillInput(e.target.value)}
                  onFocus={handleSkillFocus}
                  className={`w-full bg-primary-dark border ${errors.technologies ? 'border-white' : 'border-white/30'} rounded px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-white text-sm md:text-base lg:text-lg font-montserrat focus:outline-none focus:border-white/100 transition-colors duration-200`}
                  placeholder="Ajouter un skill..."
                />
                {showSkillsDropdown && (
                  <div className="absolute z-999 w-full mt-1 header-bg border border-white/30 rounded max-h-40 md:max-h-48 lg:max-h-56 overflow-y-auto skills-scrollbar">
                    {filteredSkills.map(skill => (
                      <div 
                        key={skill.id}
                        className="px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-3 hover:bg-primary-900 cursor-pointer transition-colors duration-200 flex items-center gap-2"
                        onClick={() => handleAddSkill(skill.name)}
                      >
                        <div className="relative w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7">
                          <Image 
                            src={skill.image_url}
                            alt={skill.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-sm md:text-base lg:text-lg">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Afficher les technologies sélectionnées */}
              <div className="flex flex-wrap gap-2 mt-2">
                {projectData.technologies.map((tech, index) => (
                  <div 
                    key={index}
                    className="bg-primary border border-primary px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full flex items-center gap-1 text-xs md:text-sm lg:text-base text-white"
                  >
                    <span>{tech}</span>
                    <button 
                      onClick={() => handleRemoveSkill(tech)} 
                      className="hover:text-red-300 transition-colors duration-200"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {errors.technologies && <p className={`${errorStyle} md:text-sm lg:text-base`}>{errors.technologies}</p>}
            </div>
            
            {/* Champ lien GitHub */}
            <div className="mb-4 md:mb-5 lg:mb-6">
              <label className="block text-white text-sm md:text-base lg:text-lg font-montserrat mb-2">
                Lien GitHub
              </label>
              <input
                type="url"
                value={projectData.github_link}
                onChange={(e) => handleInputChange('github_link', e.target.value)}
                className={`w-full bg-primary-dark border ${errors.github_link ? 'border-white' : 'border-white/30'} rounded px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-white text-sm md:text-base lg:text-lg font-montserrat focus:outline-none focus:border-white/100 transition-colors duration-200`}
                placeholder="https://github.com/username/repo"
              />
              {errors.github_link && <p className={`${errorStyle} md:text-sm lg:text-base`}>{errors.github_link}</p>}
            </div>
            
            {/* Champ lien démo */}
            <div className="mb-4 md:mb-5 lg:mb-6">
              <label className="block text-white text-sm md:text-base lg:text-lg font-montserrat mb-2">
                Lien de démonstration
              </label>
              <input
                type="url"
                value={projectData.demo_link}
                onChange={(e) => handleInputChange('demo_link', e.target.value)}
                className={`w-full bg-primary-dark border ${errors.demo_link ? 'border-white' : 'border-white/30'} rounded px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-white text-sm md:text-base lg:text-lg font-montserrat focus:outline-none focus:border-white/100 transition-colors duration-200`}
                placeholder="https://exemple.com"
              />
              {errors.demo_link && <p className={`${errorStyle} md:text-sm lg:text-base`}>{errors.demo_link}</p>}
            </div>
            
            {/* Message indiquant les champs obligatoires */}
            <div className="text-white/70 text-xs md:text-sm lg:text-base mb-4 font-bold">
              Les champs Titre, Description et Skills sont obligatoires
            </div>
          </div>
          
          {/* Boutons */}
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
              variant="primary"
              disabled={isSaving}
              className="text-[14px] md:text-[16px] lg:text-[24px] font-montserrat"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Loader size="20" />
                  <span>Enregistrement...</span>
                </div>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </div>
      </Modal>
      
      <SuccessToast 
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
        duration={4000}
      />
    </>
  );
};

export default ProjectAddModal; 