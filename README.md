# VisionMaster

**Un assistant d'apprentissage adaptatif powered by OpenRouter.ai**

VisionMaster est une application web intelligente qui transforme vos cours (PDF, TXT) en plans d'étude personnalisés et génère des questions d'examen adaptées à votre niveau et contexte d'apprentissage.

## Features

* Analyse de documents : import de cours, analyse et extraction automatique du contexte
* Quiz adaptatif : génération de questions d'examen basées sur vos documents
* Fiches de révision dynamiques : cours structurés générés automatiquement
* Chat pédagogique : questions/réponses avec possibilité de partager des documents
* Streaming en temps réel : réponses fluides et progressives
* Responsive design : desktop et mobile

## Prérequis

* Node.js >= 16
* OpenRouter API Key ([https://openrouter.ai](https://openrouter.ai))

## Installation

1. Clonez ou ouvrez le projet

   ```bash
   cd ModulRevsion
   ```

2. Installez les dépendances

   ```bash
   npm install
   ```

3. Configurez l'API Key

   * Créez un compte sur OpenRouter.ai et récupérez votre clé API
   * Ouvrez `.env.local` et mettez à jour :

   ```env
   VITE_OPENROUTER_API_KEY=votre_cle_api_ici
   ```

4. Lancez le serveur de développement

   ```bash
   npm run dev
   ```

5. Ouvrez dans votre navigateur

   ```
   http://localhost:5173
   ```

## Guide d'Utilisation

### Importer un document

1. Cliquez sur le bouton Upload en haut à droite
2. Sélectionnez votre PDF ou TXT (cours, résumé, notes)
3. L'IA analyse automatiquement et crée un contexte personnalisé
4. Les fiches de révision se régénèrent selon votre contenu

### Générer des questions

1. Allez dans l'onglet Quiz
2. Activez Utiliser l'IA pour générer des questions dynamiques
3. Les questions s'adaptent au contexte de votre document
4. Répondez et consultez les réponses

### Discuter avec VisionBot

1. Ouvrez le chat depuis l'interface
2. Posez des questions sur vos cours
3. Partagez des documents pour des analyses spécifiques
4. Obtenez des explications et conseils pédagogiques

### Réviser avec les fiches

1. Consultez les fiches générées automatiquement
2. Chaque fiche couvre un sujet clé de votre cours
3. Naviguez avec le menu latéral
4. Les fiches se mettent à jour quand vous changez de document

## Architecture

```
ModulRevsion/
├── controllers/
│   └── AppController.ts          # Logique métier et gestion d'état
├── services/
│   ├── ChatService.ts            # Service chat OpenRouter
│   ├── GeminiQuestionProvider.ts # Générateur de questions
│   └── StaticQuestionProvider.ts # Questions statiques (fallback)
├── views/
│   ├── ChatWidget.tsx            # Widget chat
│   └── components.tsx            # Composants réutilisables
├── models/
│   ├── types.ts                  # Types TypeScript
│   └── data.tsx                  # Données statiques
├── index.tsx                     # Composant principal App
├── vite.config.ts                # Configuration Vite
├── tsconfig.json                 # Configuration TypeScript
├── package.json                  # Dépendances
└── .env.local                    # Configuration (API keys)
```

## Stack Technique

| Layer    | Technology                 |
| -------- | -------------------------- |
| Frontend | React 19 + TypeScript      |
| Build    | Vite 6                     |
| Styling  | Tailwind CSS               |
| AI API   | OpenRouter (GPT-3.5-turbo) |
| State    | React Hooks                |

## Configuration

### Modèle IA

Par défaut : `openai/gpt-3.5-turbo`

Pour changer, modifiez dans les services :

**ChatService.ts (ligne 15)**

```typescript
private modelId: string = "openai/gpt-3.5-turbo";
```

**GeminiQuestionProvider.ts (ligne 9)**

```typescript
private modelId: string = "openai/gpt-3.5-turbo";
```

### Modèles disponibles via OpenRouter

* openai/gpt-3.5-turbo
* openai/gpt-4
* anthropic/claude-3-opus

Liste complète : [https://openrouter.ai/models](https://openrouter.ai/models)

## Build et Déploiement

### Build pour production

```bash
npm run build
```

Génère un dossier `dist/` prêt à être déployé sur Vercel, Netlify, GitHub Pages ou tout serveur HTTP.

### Déployer sur Vercel

```bash
npm install -g vercel
vercel
```

## Dépannage

* Clé API manquante : vérifiez `.env.local` et redémarrez le serveur
* Erreur 429 (quota) : vérifiez votre solde OpenRouter
* Questions statiques : assurez-vous que Utiliser l'IA est activé et que l'analyse est terminée
* Chat inactif : vérifiez la connexion et les logs du terminal

## Variables d'Environnement

```env
VITE_OPENROUTER_API_KEY=sk_openrouter_xxxxx
VITE_API_URL=https://openrouter.ai/api/v1
```

## Fonctionnalités Clés

### Analyse de contexte

* Extraction automatique du domaine
* Détection des sujets et sous-sujets
* Estimation du niveau de difficulté
* Format standardisé pour l'IA

### Génération de questions

* Trois questions par révision
* Mix théorie et code
* Réponses concises et pédagogiques
* Difficultés : facile, moyen, difficile

### Chat intelligent

* Conversation multi-tour
* Support des pièces jointes
* Streaming des réponses
* Historique par session

## Personnalisation

### Couleurs et thème

Modifiez dans `tailwind.config.js` ou les composants :

```typescript
"from-brand-600 to-indigo-600"
```

### Prompts système

Modifiez `systemInstruction` dans `ChatService.ts` pour ajuster la personnalité du bot.

## Performance

* First Paint < 1s
* Chat streaming fluide
* Upload jusqu'à 20MB
* Responsive de mobile à 4K

## Licence

MIT

## Contribution

Forkez le projet et proposez une Pull Request.

## Support

Consultez le README, ouvrez une issue ou vérifiez la console du navigateur.

---

Made by ZAKARIAE ([https://www.linkedin.com/in/zakariae-el-haddouchi-992474339/](https://www.linkedin.com/in/zakariae-el-haddouchi-992474339/)) for students and educators

Dernière mise à jour : Janvier 2026
