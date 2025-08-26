# 🤝 Guide de Contribution - WhatsClose

Merci de votre intérêt pour contribuer au projet WhatsClose ! Ce document fournit les directives pour contribuer au projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Développement](#développement)
- [Standards de Code](#standards-de-code)
- [Process de Review](#process-de-review)
- [Versioning](#versioning)

## 📜 Code de Conduite

Ce projet adhère au [Code de Conduite](CODE_OF_CONDUCT.md). En participant, vous acceptez de respecter ses termes.

## 🚀 Comment Contribuer

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clone votre fork
git clone https://github.com/YOUR_USERNAME/whatsclose-survey.git
cd whatsclose-survey

# Ajouter l'upstream
git remote add upstream https://github.com/whatsclose/survey-experience.git
```

### 2. Créer une Branche

```bash
# Créer une branche depuis develop
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name

# Conventions de nommage :
# - feature/nom-feature : Nouvelle fonctionnalité
# - fix/nom-bug : Correction de bug
# - docs/nom-doc : Documentation
# - style/nom-style : Changements de style
# - refactor/nom-refactor : Refactorisation
# - test/nom-test : Ajout de tests
# - chore/nom-tache : Tâches de maintenance
```

### 3. Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer les tests en watch mode
npm run test:watch
```

### 4. Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/).

```bash
# Format
<type>(<scope>): <subject>

# Exemples
feat(chat): add multi-language support
fix(3d): resolve camera rotation issue
docs(api): update endpoint documentation
style(ui): improve glassmorphism effect
refactor(survey): simplify question logic
test(utils): add validation tests
chore(deps): update dependencies
```

Types de commits :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, missing semicolons, etc.
- `refactor`: Refactorisation du code
- `test`: Ajout de tests
- `chore`: Maintenance, dépendances, etc.
- `perf`: Amélioration des performances
- `ci`: Changements CI/CD

### 5. Tests

```bash
# Lancer tous les tests
npm test

# Avec coverage
npm run test:coverage

# Tests spécifiques
npm test -- --testPathPattern=ChatSurvey
```

Exigences :
- Coverage minimum : 70%
- Tous les tests doivent passer
- Nouveaux composants = nouveaux tests

### 6. Linting et Formatage

```bash
# Linting
npm run lint
npm run lint:fix

# Formatage
npm run format

# Type checking
npm run type-check
```

### 7. Pull Request

```bash
# Push vers votre fork
git push origin feature/your-feature-name
```

Puis créer une PR sur GitHub avec :
- Titre descriptif
- Description détaillée
- Screenshots si changements UI
- Tests ajoutés/modifiés
- Documentation mise à jour

Template de PR :

```markdown
## Description
Brève description des changements.

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Code suit les standards du projet
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Changelog mis à jour
- [ ] Pas de warnings de lint
- [ ] Tests passent localement

## Screenshots (si applicable)
[Ajouter des screenshots]

## Notes additionnelles
[Contexte supplémentaire]
```

## 💻 Développement

### Structure du Projet

```
src/
├── app/           # Routes Next.js
├── components/    # Composants React
├── hooks/         # Hooks personnalisés
├── lib/           # Utilitaires
├── types/         # Types TypeScript
├── utils/         # Fonctions helper
└── constants/     # Constantes
```

### Technologies

- **Framework**: Next.js 14
- **3D**: Three.js + React Three Fiber
- **Animation**: Framer Motion
- **Style**: Tailwind CSS
- **State**: Zustand
- **Tests**: Jest + Testing Library
- **CI/CD**: GitHub Actions

### Variables d'Environnement

```bash
# Copier le template
cp .env.example .env.local

# Variables requises
NEXT_PUBLIC_APP_NAME=WhatsClose
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📏 Standards de Code

### TypeScript

- Utiliser des types stricts
- Pas de `any` sauf absolument nécessaire
- Interfaces pour les props de composants
- Types pour les unions et intersections

```typescript
// ✅ Bon
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ Mauvais
const Button = (props: any) => { ... }
```

### React

- Functional components avec hooks
- Nommage PascalCase pour les composants
- Props destructurées
- Mémoisation quand nécessaire

```typescript
// ✅ Bon
const MyComponent: FC<Props> = ({ title, children }) => {
  const memoizedValue = useMemo(() => computeExpensive(), [deps]);
  return <div>{children}</div>;
};

// ❌ Mauvais
function myComponent(props) {
  return <div>{props.children}</div>;
}
```

### CSS/Tailwind

- Utiliser les classes Tailwind
- Éviter les styles inline
- Grouper les classes logiquement

```typescript
// ✅ Bon
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ❌ Mauvais
<div style={{ display: 'flex', padding: '1rem' }}>
```

### Tests

- Un fichier de test par composant
- Tests unitaires et d'intégration
- Mocks pour les dépendances externes

```typescript
// ✅ Bon
describe('ChatSurvey', () => {
  it('should render welcome message', () => {
    render(<ChatSurvey />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
```

## 🔄 Process de Review

1. **Auto-review** : Vérifiez votre code
2. **Tests** : Tous les tests passent
3. **Documentation** : README/docs à jour
4. **Review** : 2 approvals minimum
5. **Merge** : Squash and merge vers develop

### Critères de Review

- [ ] Code lisible et maintenable
- [ ] Suit les conventions du projet
- [ ] Tests appropriés
- [ ] Performance acceptable
- [ ] Pas de code mort
- [ ] Pas de console.log
- [ ] Sécurité respectée

## 📦 Versioning

Nous suivons [Semantic Versioning](https://semver.org/) :

- **MAJOR** : Breaking changes
- **MINOR** : Nouvelles fonctionnalités
- **PATCH** : Bug fixes

```bash
# Exemples
1.0.0 -> 2.0.0 # Breaking change
1.0.0 -> 1.1.0 # Nouvelle feature
1.0.0 -> 1.0.1 # Bug fix
```

## 🐛 Signaler un Bug

1. Vérifier les issues existantes
2. Créer une issue avec :
   - Description claire
   - Étapes de reproduction
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, navigateur, etc.)

## 💡 Proposer une Fonctionnalité

1. Vérifier les issues existantes
2. Créer une issue "Feature Request" avec :
   - Problème résolu
   - Solution proposée
   - Alternatives considérées
   - Mockups/designs si applicable

## 📝 Documentation

- Commenter le code complexe
- JSDoc pour les fonctions publiques
- README à jour pour les nouvelles features
- Exemples d'utilisation

```typescript
/**
 * Calcule le temps de lecture estimé
 * @param text - Le texte à analyser
 * @returns Le temps en millisecondes
 */
export function calculateReadingTime(text: string): number {
  // Implementation
}
```

## 🆘 Besoin d'Aide ?

- 📧 Email : dev@whatsclose.com
- 💬 Discord : [WhatsClose Dev](https://discord.gg/whatsclose)
- 📚 Documentation : [docs.whatsclose.com](https://docs.whatsclose.com)

## 📄 License

En contribuant, vous acceptez que vos contributions soient sous la même license que le projet.

---

Merci de contribuer à WhatsClose ! 🚀