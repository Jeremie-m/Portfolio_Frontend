# Portfolio de Jérémie Marie

Ce projet est un portfolio personnel développé avec Next.js et Tailwind CSS, présentant mes compétences, projets et informations de contact, avec une architecture moderne basée sur les features.

## Fonctionnalités

- **Design Responsive** : Adapté à tous les appareils (mobile, tablette, desktop)
- **Architecture Feature-First** : Organisation du code par fonctionnalité pour une meilleure maintenabilité
- **Animations et Interactions** : Animations fluides avec Framer Motion pour une expérience utilisateur engageante
- **Sections Principales** :
  - Hero Banner avec photo de profil et typewriter dynamique
  - À propos (Qui suis-je ?)
  - Compétences (présentation interactive en éventail)
  - Projets
  - Contact
- **API Mock** : Simulation d'API pour les tests avant intégration avec le backend
- **Authentification** : Système de connexion/déconnexion pour la partie admin
- **Mode Admin** : Interface spéciale pour la modification du contenu
- **Optimisation des Images** : Utilisation de Sharp et Next.js Image pour des performances optimales

## Technologies Utilisées

- **Frontend** :
  - Next.js 15 (React Framework avec support pour SSR et SSG)
  - Tailwind CSS v4 (Styling utilitaire)
  - Framer Motion (Animations)
  - React Hooks & Contextes (Gestion d'état)
- **Développement** :
  - ESLint (Linting)
  - Modern JavaScript (ES6+)
- **Optimisation** :
  - Sharp (Traitement d'images)
  - Potrace (Conversion d'images)

## Installation

1. Cloner le dépôt :
```bash
git https://github.com/Jeremie-m/Portfolio_Frontend.git
cd portfolio-app
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
portfolio-app/
├── app/                  # Dossier principal de l'application Next.js
│   ├── api/              # Routes API pour les mocks
│   │   ├── auth/         # API d'authentification
│   │   ├── projects/     # API des projets
│   │   └── skills/       # API des compétences
│   ├── auth/             # Routes d'authentification
│   ├── globals.css       # Styles globaux
│   ├── layout.js         # Layout principal
│   ├── page.js           # Page d'accueil
│   └── favicon.ico       # Icône du site
├── components/           # Composants React partagés
│   ├── common/           # Composants réutilisables
│   ├── layout/           # Composants de mise en page (Header, Footer)
│   ├── modals/           # Composants de fenêtres modales
│   └── sections/         # Sections principales du portfolio
├── features/             # Organisation par fonctionnalité
│   ├── aboutme/          # Fonctionnalité "À propos"
│   │   ├── contexts/     # Contextes React
│   │   ├── hooks/        # Hooks personnalisés
│   │   └── mocks/        # Données mockées
│   ├── auth/             # Authentification
│   │   └── contexts/     # Contextes d'authentification
│   ├── herobanner/       # Bannière d'en-tête
│   │   ├── contexts/     # Contextes React
│   │   ├── hooks/        # Hooks personnalisés
│   │   └── mocks/        # Données mockées
│   ├── projects/         # Gestion des projets
│   │   ├── contexts/     # Contextes React
│   │   ├── hooks/        # Hooks personnalisés
│   │   └── mocks/        # Données mockées
│   └── skills/           # Gestion des compétences
│       ├── contexts/     # Contextes React
│       ├── hooks/        # Hooks personnalisés
│       └── mocks/        # Données mockées
├── public/               # Fichiers statiques
│   └── images/           # Images
├── ...
```

## Architecture

Le projet suit une architecture "feature-first" où le code est organisé par fonctionnalité plutôt que par type de fichier. Chaque fonctionnalité contient ses propres :

- **Composants** : UI spécifique à la fonctionnalité
- **Hooks** : Logique de gestion d'état et d'interaction avec l'API
- **Contextes** : Partage d'état global pour la fonctionnalité
- **Mocks** : Données de test

Cette approche permet une meilleure séparation des préoccupations et rend le code plus maintenable et évolutif.

## Déploiement

Ce projet peut être facilement déployé sur Vercel, la plateforme recommandée pour les applications Next.js :

```bash
# Construction pour la production
npm run build

# Démarrage en mode production
npm run start
```

Pour un déploiement automatique, connectez votre dépôt GitHub à Vercel.

## Futurs Développements

- Intégration avec un backend NestJS pour la gestion des données en temps réel
- Implémentation de la génération de site statique (SSG) pour des performances optimales
- Ajout d'un blog avec système de gestion de contenu
- Améliorations d'accessibilité supplémentaires

## Licence

Tous droits réservés © 2025 Jérémie Marie
