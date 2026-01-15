import { IQuestionProvider, Question } from '../models/types';

// ==========================================
// INFRASTRUCTURE : ADAPTATEUR STATIC
// ==========================================

export class StaticQuestionProvider implements IQuestionProvider {
  async getQuestions(context?: string): Promise<Question[]> {
    // Note: Le provider statique ignore le contexte dynamique car ses données sont 'en dur'
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
            {
              id: 1,
              question: "Quel est l'avantage principal de l'IA Neuro-symbolique par rapport au Deep Learning classique ?",
              answer: "Elle combine la capacité d'apprentissage des réseaux de neurones avec l'explicabilité et le raisonnement de la logique symbolique.",
              difficulty: "Moyen"
            },
            {
              id: 2,
              question: "En quoi les Spiking Neural Networks (SNN) diffèrent-ils des ANN traditionnels ?",
              answer: "Ils traitent l'information par impulsions (spikes) temporelles, imitant mieux le cerveau biologique et consommant beaucoup moins d'énergie.",
              difficulty: "Difficile"
            },
            {
              id: 3,
              question: "Quelle est la responsabilité principale d'un MLOps Engineer ?",
              answer: "L'industrialisation des modèles : automatisation du déploiement (CI/CD), monitoring en production et gestion du cycle de vie des modèles.",
              difficulty: "Facile"
            },
            {
              id: 4,
              question: "Qu'est-ce que le 'Data Drift' qu'un ingénieur IA doit surveiller ?",
              answer: "C'est la dérive des données : quand la distribution des données réelles en production s'éloigne de celle des données d'entraînement, dégradant la performance.",
              difficulty: "Moyen"
            },
            {
              id: 5,
              question: "Qu'apporte un 'Liquid Neural Network' par rapport à un RNN classique ?",
              answer: "Sa capacité à s'adapter en temps réel après l'entraînement, offrant une meilleure robustesse face aux environnements changeants.",
              difficulty: "Difficile"
            },
            {
              id: 6,
              question: "Dans le cadre de l'optimisation GPU, qu'est-ce qu'un kernel CUDA ?",
              answer: "Une fonction bas niveau exécutée directement sur le GPU pour paralléliser massivement les calculs matriciels.",
              difficulty: "Difficile"
            },
            {
              id: 7,
              question: "Quel est le but de la 'Distillation' de modèles (Knowledge Distillation) ?",
              answer: "Transférer la connaissance d'un grand modèle (Teacher) vers un modèle plus petit (Student) pour réduire les coûts d'inférence tout en gardant la performance.",
              difficulty: "Moyen"
            }
        ]);
      }, 500);
    });
  }
}