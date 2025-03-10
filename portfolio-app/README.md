# Portfolio de Jérémie Marie

Ce projet est un portfolio personnel développé avec Next.js et Tailwind CSS, présentant mes compétences, projets et informations de contact.

## Fonctionnalités

- **Design Responsive** : Adapté à tous les appareils (mobile, tablette, desktop)
- **Sections Principales** :
  - Hero Banner avec photo de profil
  - À propos (Qui suis-je ?)
  - Compétences
  - Projets
  - Contact
- **API Mock** : Simulation d'API pour les tests avant intégration avec le backend NestJS
- **Authentification** : Système de connexion/déconnexion pour la partie admin

## Technologies Utilisées

- **Frontend** :
  - Next.js (React Framework avec SSR)
  - Tailwind CSS (Styling)
  - React Hooks
- **Mock API** :
  - Next.js API Routes

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/jeremie-m/portfolio.git
cd portfolio
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
│   ├── globals.css       # Styles globaux
│   ├── layout.js         # Layout principal
│   └── page.js           # Page d'accueil
├── components/           # Composants React
│   ├── Header.js         # En-tête du site
│   ├── HeroBanner.js     # Bannière principale avec photo
│   ├── About.js          # Section "Qui suis-je ?"
│   ├── Skills.js         # Section "Mes Compétences"
│   ├── Projects.js       # Section "Mes Projets"
│   ├── Contact.js        # Section "Contact"
│   ├── Footer.js         # Pied de page
│   └── MobileNav.js      # Navigation mobile
├── mocks/                # Données de test
│   ├── projects.js       # Projets
│   ├── blog.js           # Articles de blog
│   └── technologies.js   # Technologies
├── public/               # Fichiers statiques
│   └── images/           # Images
└── ...
```

## Déploiement

Ce projet peut être facilement déployé sur Vercel :

```bash
npm run build
npm run start
```

## Licence

Tous droits réservés © 2025 Jérémie Marie
