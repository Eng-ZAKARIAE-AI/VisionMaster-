# VisionMaster 🧠

**Un assistant d'apprentissage adaptatif powered by OpenRouter.ai**

VisionMaster est une application web intelligent qui transforme vos cours (PDF, TXT) en plans d'étude personnalisés et génère des questions d'examen adaptées à votre niveau et contexte d'apprentissage.

## 🚀 Features

- **📚 Analyse de Documents** : Upload vos cours, l'IA analyse et extrait automatiquement le contexte
- **🎯 Quiz Adaptatif** : Génération de questions d'examen basées sur vos documents
- **📖 Fiches de Révision Dynamiques** : Cours structuré automatiquement généré selon votre contenu
- **💬 Chat Pédagogique** : Posez des questions avec possibilité de partager des documents
- **🔄 Streaming en Temps Réel** : Réponses fluides et progressives
- **📱 Responsive Design** : Fonctionne sur desktop et mobile

## 📋 Prérequis

- **Node.js** >= 16
- **OpenRouter API Key** (gratuit : https://openrouter.ai)

## 🛠️ Installation

1. **Clonez ou ouvrez le projet**
   ```bash
   cd ModulRevsion
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Configurez l'API Key**
   - Allez sur [OpenRouter.ai](https://openrouter.ai)
   - Créez un compte gratuit et récupérez votre clé API
   - Ouvrez `.env.local` et mettez à jour :
   ```env
   VITE_OPENROUTER_API_KEY=votre_clé_api_ici
   ```

4. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrez dans votre navigateur**
   ```
   http://localhost:5173
   ```

## 📖 Guide d'Utilisation

### 1️⃣ Importer un Document

1. Cliquez sur le bouton **Upload** en haut à droite
2. Sélectionnez votre PDF ou TXT (cours, résumé, notes)
3. L'IA analyse automatiquement et crée un contexte personnalisé
4. Les fiches de révision se régénèrent selon votre contenu

### 2️⃣ Générer des Questions

1. Allez dans l'onglet **Quiz**
2. Activez **Utiliser l'IA** pour générer des questions dynamiques
3. Les questions s'adaptent au contexte de votre document
4. Répondez et consultez les réponses

### 3️⃣ Discuter avec VisionBot

1. Ouvrez le chat (💬 en bas à droite)
2. Posez des questions sur vos cours
3. Partagez des documents pour des analyses spécifiques
4. Obtenez des explications et conseils pédagogiques

### 4️⃣ Réviser avec les Fiches

1. Consultez les fiches générées automatiquement
2. Chaque fiche couvre un sujet clé de votre cours
3. Naviguer avec le menu latéral
4. Les fiches se mettent à jour quand vous changez de document

## 🏗️ Architecture

```
ModulRevsion/
├── controllers/
│   └── AppController.ts          # Logique métier & state management
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

## 🔌 Stack Technique

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **AI API** | OpenRouter (GPT-3.5-turbo) |
| **State** | React Hooks (useState, useEffect) |

## ⚙️ Configuration

### Modèle IA

Par défaut : `openai/gpt-3.5-turbo`

Pour changer, modifiez dans les services :

**ChatService.ts (ligne 15)**
```typescript
private modelId: string = "openai/gpt-3.5-turbo"; // ou tout autre modèle OpenRouter
```

**GeminiQuestionProvider.ts (ligne 9)**
```typescript
private modelId: string = "openai/gpt-3.5-turbo";
```

### Modèles disponibles via OpenRouter

- `openai/gpt-3.5-turbo` (rapide, économique)
- `openai/gpt-4` (meilleure qualité)
- `anthropic/claude-3-opus` (très puissant)
- [Voir tous les modèles](https://openrouter.ai/models)

## 🚀 Build & Deploy

### Build pour production
```bash
npm run build
```

Crée un dossier `dist/` prêt à être déployé sur :
- **Vercel** / **Netlify** / **GitHub Pages**
- **Docker** / **Kubernetes**
- N'importe quel serveur HTTP

### Déployer sur Vercel (gratuit)
```bash
npm install -g vercel
vercel
```

## 🐛 Dépannage

**Q: "Clé API manquante"**
- ✅ Vérifiez que `.env.local` contient `VITE_OPENROUTER_API_KEY=...`
- ✅ Redémarrez le serveur (`npm run dev`)

**Q: "Erreur 429 - Quota dépassé"**
- ✅ Vérifiez votre solde/limite sur [OpenRouter](https://openrouter.ai)
- ✅ Upgrader vers un plan payant si nécessaire

**Q: Les questions restent statiques après upload**
- ✅ Vérifiez que l'onglet Quiz affiche "Utiliser l'IA"
- ✅ Attendez que l'analyse du document soit terminée
- ✅ Vérifiez la console (F12) pour les erreurs

**Q: Le chat ne répond pas**
- ✅ Vérifiez votre connexion internet
- ✅ Consultez les logs : `npm run dev` et vérifiez le terminal

## 📝 Variables d'Environnement

```env
# Requis
VITE_OPENROUTER_API_KEY=sk_openrouter_xxxxx

# Optionnel
VITE_API_URL=https://openrouter.ai/api/v1
```

## 📚 Fonctionnalités Clés Détaillées

### Analyse de Context
- Extraction automatique du domaine (ML, Vision, etc.)
- Détection des sujets et sous-sujets
- Niveau de difficulté estimé
- Format standardisé pour l'IA

### Génération de Questions
- 3 questions par révision
- Mix code + théorie
- Réponses concises et pédagogiques
- Difficulté: Facile / Moyen / Difficile

### Chat Intelligent
- Conversation multi-tour
- Support des pièces jointes (PDF/images)
- Streaming des réponses
- Historique conservé par session

## 🎨 Personnalisation

### Couleurs & Thème
Modifiez dans `tailwind.config.js` ou directement dans les composants :
```typescript
"from-brand-600 to-indigo-600" // Gradient principal
```

### Prompts Système
Modifiez `systemInstruction` dans `ChatService.ts` pour changer la personnalité du bot.

## 📊 Performance

- **First Paint** : < 1s
- **Chat Streaming** : réponses fluides
- **Upload** : support jusqu'à 20MB (limité par OpenRouter)
- **Responsive** : optimisé pour mobile (375px - 4K)

## 📄 License

MIT - Libre d'utilisation et de modification

## 🤝 Contribution

Les contributions sont bienvenues ! Fork, modifiez, et créez une Pull Request.

## 📧 Support

Besoin d'aide ?
- 📖 Consultez ce README
- 🐛 Ouvrez une issue
- 💬 Vérifiez la console du navigateur (F12)

---

**Made with ❤️ for students and educators**

Dernière mise à jour : Janvier 2026
