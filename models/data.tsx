import React from 'react';
import { Code, Layers, Zap, Briefcase, TrendingUp, Cpu, Network } from 'lucide-react';
import { Fiche } from './types';

// ==========================================
// DONNÉES STATIQUES (REPOSITORY)
// ==========================================

export const STATIC_FICHES: Fiche[] = [
  {
    id: 1,
    title: "Missions de l'Ingénieur IA",
    icon: <Code size={24} />,
    color: "bg-blue-100 text-blue-700",
    content: [
      {
        subtitle: "Architecture & Modélisation",
        points: [
          "**Design de Modèles** : Sélectionner l'architecture (Transformers, CNN, GNN) adaptée au problème.",
          "**Fine-tuning** : Adapter des modèles fondation (LLMs, ViT) sur des données métier spécifiques.",
          "**Data Engineering** : Création de pipelines robustes pour l'ingestion et le nettoyage des données."
        ],
        code: `from transformers import AutoModelForCausalLM\n\n# Chargement d'un modèle pour fine-tuning\nmodel = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B")`
      },
      {
        subtitle: "Déploiement & Production",
        points: [
          "**Inférence** : Optimisation de la latence et du débit (Quantization, Pruning).",
          "**API** : Exposition du modèle via FastAPI ou Flask.",
          "**Monitoring** : Surveillance du *Data Drift* et de la performance en temps réel."
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Sujets Futurs & Émergents",
    icon: <Zap size={24} />,
    color: "bg-purple-100 text-purple-700",
    content: [
      {
        subtitle: "IA Neuro-symbolique",
        points: [
          "**Concept** : Hybridation entre réseaux de neurones (apprentissage) et logique symbolique (raisonnement).",
          "**Intérêt** : Combine la robustesse au bruit du Deep Learning et l'explicabilité de la logique.",
          "**Avenir** : Crucial pour une IA capable de raisonner de manière fiable et transparente."
        ]
      },
      {
        subtitle: "Spiking Neural Networks (SNN)",
        points: [
          "**Biomimétisme** : Imite le fonctionnement impulsif des neurones biologiques.",
          "**Efficacité** : Consommation énergétique drastiquement réduite (neuromorphic hardware).",
          "**Use Case** : Robotique embarquée, capteurs IoT ultra-basse consommation."
        ]
      },
      {
        subtitle: "Liquid Neural Networks",
        points: [
          "**Adaptabilité** : Le modèle continue d'apprendre et de s'adapter après l'entraînement (temps réel).",
          "**Stabilité** : Robuste face aux changements de distribution imprévus."
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Carrières & Évolution",
    icon: <Briefcase size={24} />,
    color: "bg-green-100 text-green-700",
    content: [
      {
        subtitle: "Au-delà du Code",
        points: [
          "**MLOps Engineer** : Spécialiste de l'automatisation, CI/CD et infrastructure ML.",
          "**AI Architect** : Vision systémique, choix des briques technologiques et scalabilité.",
          "**AI Ethicist** : Audit des biais, conformité (AI Act), et impact sociétal."
        ]
      },
      {
        subtitle: "Le Profil Senior (10 ans+)",
        points: [
          "**Vision Stratégique** : Anticiper les ruptures (ex: l'arrivée des LLMs) avant qu'elles ne deviennent mainstream.",
          "**System Design** : Concevoir des écosystèmes IA complexes (Data Lake -> Training -> Edge).",
          "**Mentoring** : Faire monter en compétence les juniors et définir les standards de qualité."
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Performance Expert",
    icon: <TrendingUp size={24} />,
    color: "bg-orange-100 text-orange-700",
    content: [
      {
        subtitle: "Optimisation Avancée",
        points: [
          "**Kernel Optimization** : Écriture de kernels CUDA personnalisés pour maximiser l'utilisation GPU.",
          "**Distributed Training** : Parallélisme de données et de modèles sur clusters (Ray, Horovod).",
          "**Distillation** : Compression de modèles géants (Teacher) vers des modèles légers (Student) sans perte majeure."
        ]
      }
    ]
  }
];