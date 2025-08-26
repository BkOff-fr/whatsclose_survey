# 🚀 WhatsClose - Guide de Démarrage Rapide

## 📦 Installation en 5 minutes

### 1️⃣ Cloner et Installer

```bash
# Cloner le repository
git clone https://github.com/whatsclose/survey-experience.git
cd survey-experience

# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
```

### 2️⃣ Configuration Automatique

```bash
# Script de configuration interactif
npm run setup
```

Ou configuration manuelle :

```bash
# Créer le fichier .env.local
cp .env.example .env.local

# Éditer avec vos valeurs
nano .env.local
```

### 3️⃣ Lancer le Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) 🎉

## 🏗️ Structure Essentielle

```
src/
├── components/
│   ├── Experience/           # Composants 3D
│   │   ├── WhatsCloseExperience.tsx  # Point d'entrée
│   │   ├── Scene3D.tsx               # Scène 3D
│   │   └── CameraController.tsx      # Contrôle caméra
│   └── Survey/
│       ├── ChatSurvey3D.tsx          # Chat interface
│       └── StoryNavigation.tsx       # Navigation histoire
├── app/
│   ├── page.tsx              # Page principale
│   └── api/                  # Routes API
└── types/                    # Types TypeScript
```

## 🎯 Commandes Essentielles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Démarrer production |
| `npm run test` | Lancer les tests |
| `npm run lint` | Vérifier le code |
| `npm run format` | Formater le code |
| `npm run type-check` | Vérifier les types |
| `npm run monitor` | Monitoring santé |

## 🔧 Personnalisation Rapide

### Modifier les Questions du Chat

Éditer `src/components/Survey/ChatSurvey3D.tsx` :

```typescript
const questions = [
  {
    type: 'input',
    content: "Votre nouvelle question ?",
    field: 'fieldName',
    placeholder: 'Placeholder...'
  },
  // Ajouter vos questions ici
];
```

### Changer les Couleurs

Éditer `src/app/globals.css` :

```css
:root {
  --accent-green: #4ade80;  /* Couleur principale */
  --accent-green-dark: #22c55e; /* Couleur secondaire */
}
```

### Modifier les Scènes 3D

Éditer `src/components/Experience/Scene3D.tsx` :

```typescript
// Ajouter une nouvelle scène
function MyNewScene({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff0000" />
    </mesh>
  );
}
```

## 🐳 Docker Quick Start

### Avec Docker

```bash
# Build l'image
docker build -t whatsclose-survey .

# Lancer le container
docker run -p 3000:3000 whatsclose-survey
```

### Avec Docker Compose

```bash
docker-compose up
```

## 🚢 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivre les instructions
```

### Build Manuel

```bash
# Build production
npm run build

# Les fichiers sont dans .next/
# Servir avec :
npm run start
```

## 📊 Tests

```bash
# Tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests en watch mode
npm run test:watch
```

## 🔍 Debugging

### Mode Debug

Ajouter `?debug=true` à l'URL :
```
http://localhost:3000?debug=true
```

### Console Browser

```javascript
// Dans la console du navigateur
window.__THREE__ // Accès à Three.js
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ // React DevTools
```

### Monitoring

```bash
# Lancer le monitoring
npm run monitor
```

## 📱 Test Mobile

### Tunnel Local

```bash
# Avec ngrok
ngrok http 3000

# Ou avec localtunnel
lt --port 3000
```

### Émulateur Chrome

1. Ouvrir Chrome DevTools
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Sélectionner un appareil

## ⚡ Performance

### Analyser le Bundle

```bash
npm run analyze
```

### Lighthouse

```bash
npm run lighthouse
```

## 🆘 Problèmes Fréquents

### Port 3000 Occupé

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 [PID]

# Ou utiliser un autre port
npm run dev -- -p 3001
```

### Erreur de Dépendances

```bash
# Nettoyer et réinstaller
npm run clean
```

### Erreur WebGL

- Vérifier que WebGL est activé dans le navigateur
- Mettre à jour les drivers graphiques
- Essayer un autre navigateur

### Build Failed

```bash
# Vérifier les types
npm run type-check

# Vérifier le linting
npm run lint

# Clear cache
rm -rf .next
npm run build
```

## 📚 Ressources

- 📖 [Documentation Complète](./README.md)
- 🎨 [Guide de Style](./docs/STYLE_GUIDE.md)
- 🔧 [API Documentation](./docs/API.md)
- 🤝 [Guide de Contribution](./CONTRIBUTING.md)
- 🐛 [Issues GitHub](https://github.com/whatsclose/survey-experience/issues)

## 💬 Support

- 📧 Email : support@whatsclose.com
- 💬 Discord : [WhatsClose Community](https://discord.gg/whatsclose)
- 🐦 Twitter : [@whatsclose](https://twitter.com/whatsclose)

---

🎉 **Prêt à révolutionner les courses locales !**

```bash
# Let's go! 🚀
npm run dev
```