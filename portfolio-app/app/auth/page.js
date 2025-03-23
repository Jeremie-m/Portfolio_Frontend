'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';

// Fonctions de validation pour prévenir les attaques XSS et SQLi
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Échapper les caractères spéciaux HTML pour prévenir les XSS
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const isValidEmail = (email) => {
  // Validation stricte du format email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Valider la complexité du mot de passe si nécessaire
  // ou simplement vérifier qu'il ne contient pas de caractères dangereux
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
  return passwordRegex.test(password) && password.length >= 8;
};

// Vérifier si l'entrée contient des patterns de SQLi
const hasSQLiPattern = (input) => {
  const sqlPatterns = [
    /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION)(\s|$)/i,
    /['";](\s|\d)*(\s|$)/,
    /--(\s|$)/,
    /\/\*.*\*\//
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

export default function AuthPage() {
  const router = useRouter();
  const { setIsAdmin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: ''
  });

  // Réinitialiser les erreurs de validation quand les données du formulaire changent
  useEffect(() => {
    setValidationErrors({
      email: '',
      password: ''
    });
  }, [formData]);

  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };
    let isValid = true;
    
    // Validation de l'email
    if (!isValidEmail(formData.email)) {
      errors.email = "Format d'email invalide";
      isValid = false;
    }
    
    // Détection de patterns SQLi dans l'email
    if (hasSQLiPattern(formData.email)) {
      errors.email = "L'email contient des caractères non autorisés";
      isValid = false;
    }
    
    // Validation du mot de passe
    if (!isValidPassword(formData.password)) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères et ne pas inclure de caractères spéciaux non autorisés";
      isValid = false;
    }
    
    // Détection de patterns SQLi dans le mot de passe
    if (hasSQLiPattern(formData.password)) {
      errors.password = "Le mot de passe contient des caractères non autorisés";
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validation des entrées avant soumission
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    // Sanitize les entrées pour prévenir XSS
    const sanitizedData = {
      email: sanitizeInput(formData.email.trim()),
      password: formData.password // Ne pas modifier le mot de passe pour l'authentification
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        // Stockage du token dans le localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          setIsAdmin(true); // Mettre à jour le contexte
        }
        // Redirection vers la page principale
        router.push('/');
      } else {
        // Gestion des différents types d'erreurs
        switch (response.status) {
          case 401:
            setError('Email ou mot de passe incorrect');
            break;
          case 400:
            setError(data.message || 'Veuillez vérifier vos informations');
            break;
          default:
            setError('Une erreur est survenue lors de la connexion');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Erreur de connexion:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser l'erreur quand l'utilisateur commence à taper
    if (error) setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full m-2 max-w-md p-8 rounded-lg header-bg [filter:drop-shadow(0_4px_8px_#0B61EE)] relative z-10"
      >
        <h1 className="text-2xl md:text-[32px] lg:text-[48px] font-bold text-white mb-6 text-center font-montserrat">
          Admin 
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm font-montserrat"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm md:text-[16px] lg:text-[24px] font-medium text-white mb-2 font-montserrat"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg text-sm md:text-[16px] lg:text-[24px] bg-white text-[#121212] focus:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 ${validationErrors.email ? 'border-2 border-red-500' : ''}`}
              placeholder="votre@email.com"
              maxLength={100} // Limiter la longueur des entrées
              aria-invalid={validationErrors.email ? 'true' : 'false'}
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
            />
            {validationErrors.email && (
              <p id="email-error" className="mt-1 text-red-500 text-xs">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm md:text-[16px] lg:text-[24px] font-medium text-white mb-2 font-montserrat"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg text-[14px] md:text-[16px] lg:text-[24px] bg-white text-[#121212] focus:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 ${validationErrors.password ? 'border-2 border-red-500' : ''}`}
              placeholder="••••••••"
              maxLength={100} // Limiter la longueur des entrées
              aria-invalid={validationErrors.password ? 'true' : 'false'}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
            />
            {validationErrors.password && (
              <p id="password-error" className="mt-1 text-red-500 text-xs">
                {validationErrors.password}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 text-sm md:text-[16px] lg:text-[24px] bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 