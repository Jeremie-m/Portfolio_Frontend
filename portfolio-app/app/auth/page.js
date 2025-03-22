'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';

export default function AuthPage() {
  const router = useRouter();
  const { setIsAdmin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
              className="w-full px-4 py-2 rounded-lg text-sm md:text-[16px] lg:text-[24px] bg-white text-[#121212] focus:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50"
              placeholder="votre@email.com"
            />
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
              className="w-full px-4 py-2 rounded-lg text-[14px] md:text-[16px] lg:text-[24px] bg-white text-[#121212] focus:outline-none transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50"
              placeholder="••••••••"
            />
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