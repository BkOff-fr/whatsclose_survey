# 🚀 WhatsClose - Expérience Immersive 3D

Une expérience web immersive et interactive pour présenter WhatsClose, la plateforme révolutionnaire de produits locaux en casiers 24/7.

![WhatsClose](https://img.shields.io/badge/WhatsClose-v1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black)
![Three.js](https://img.shields.io/badge/Three.js-0.159-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## ✨ Caractéristiques

- 🎮 **Expérience 3D Interactive** - Scène 3D complète avec animations et interactions
- 💬 **Chat Conversationnel** - Interface de chat avec glassmorphism pour collecter les données
- 🎬 **Narration Cinématique** - Présentation immersive du concept en 4 scènes
- 📱 **Responsive Design** - Optimisé pour mobile, tablette et desktop
- ⚡ **Performance Optimisée** - Chargement dynamique et optimisations Three.js
- 🎨 **Design Moderne** - Glassmorphism, animations fluides, effets visuels premium

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm/yarn/pnpm
- Git

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/whatsclose/survey-experience.git
cd survey-experience
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Éditer `.env.local` avec vos valeurs :
```env
NEXT_PUBLIC_APP_NAME=WhatsClose
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
# Ajouter vos clés API si nécessaire
```

4. **Lancer le développement**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
src/
├── app/                      # App directory Next.js 14
│   ├── api/                  # API Routes
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Page d'accueil
│
├── components/               # Composants React
│   ├── Experience/           # Composants 3D
│   │   ├── WhatsCloseExperience.tsx
│   │   ├── Scene3D.tsx
│   │   ├── CameraController.tsx
│   │   └── SuccessScreen.tsx
│   │
│   ├── Survey/               # Composants Survey
│   │   ├── ChatSurvey3D.tsx
│   │   └── StoryNavigation.tsx
│   │
│   ├── UI/                   # Composants UI
│   │   └── LoadingScreen.tsx
│   │
│   └── providers/            # Context Providers
│       └── LenisProvider.tsx
│
├── hooks/                    # Hooks personnalisés
│   ├── useCustomHooks.ts
│   └── useSurveyStore.tsx
│
├── lib/                      # Utilitaires
│   └── api.ts
│
├── types/                    # Types TypeScript
│   └── index.ts
│
├── utils/                    # Fonctions utilitaires
│   └── helpers.ts
│
└── constants/                # Constantes
    └── index.ts
```

## 🎮 Utilisation

### Flux Utilisateur

1. **Écran de Chargement** - Animation de chargement avec branding
2. **Chat Initial** - Questions personnalisées avec interface glassmorphism
3. **Déclenchement Histoire** - Transition automatique vers le mode immersif
4. **Navigation 3D** - 4 scènes explicatives :
   - Producteurs Locaux
   - Casiers Intelligents 24/7
   - Livraison Express
   - Application Mobile
5. **Retour Chat** - Finalisation de l'inscription
6. **Écran de Succès** - Confirmation avec avantages

### Commandes Clavier

- **←/→** - Navigation entre les scènes (mode histoire)
- **ESC** - Retour au chat
- **Enter** - Validation des inputs

## 🚀 Déploiement

### Build de Production

```bash
npm run build
# ou
yarn build
# ou
pnpm build
```

### Déploiement sur Vercel (Recommandé)

```bash
# Installation CLI Vercel
npm i -g vercel

# Déploiement
vercel
```

### Déploiement sur Netlify

```bash
# Build
npm run build

# Upload du dossier .next vers Netlify
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Personnalisation des Questions

Éditer `src/components/Survey/ChatSurvey3D.tsx` :

```typescript
const questions = [
  {
    type: 'input',
    content: "Votre question ici ?",
    field: 'fieldName',
    placeholder: 'Placeholder...'
  },
  // Ajouter vos questions
];
```

### Personnalisation des Scènes 3D

Éditer `src/components/Experience/Scene3D.tsx` pour modifier les éléments 3D.

### Thème et Couleurs

Éditer `src/app/globals.css` et `tailwind.config.js` :

```css
:root {
  --accent-green: #4ade80;
  --accent-green-dark: #22c55e;
}
```

## 📊 Analytics

L'application supporte Google Analytics. Ajouter votre ID dans `.env.local` :

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔒 Sécurité

- Headers de sécurité configurés dans `middleware.ts`
- CSP (Content Security Policy) activé
- Protection XSS
- Validation des données côté client et serveur

## 🐛 Debugging

### Mode Debug

Ajouter `?debug=true` à l'URL pour activer le mode debug.

### Logs

```typescript
// Dans votre code
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### Performance 3D

Utiliser les Chrome DevTools avec le profiler Three.js :
- Installer l'extension Three.js Developer Tools
- Ouvrir les DevTools → Three.js tab

## 📱 Support Mobile

- Touch controls supportés
- Optimisations performance pour mobile
- Fallback pour WebGL non supporté

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Propriétaire - WhatsClose © 2024. Tous droits réservés.

## 🆘 Support

- Email : support@whatsclose.com
- Documentation : [docs.whatsclose.com](https://docs.whatsclose.com)
- Issues : [GitHub Issues](https://github.com/whatsclose/survey-experience/issues)

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Développé avec ❤️ par l'équipe WhatsClose