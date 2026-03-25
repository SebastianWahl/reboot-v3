// Script de seed — Profil cognitif Sebastian Wahl (22 mars 2026)
// Coller dans la console du navigateur (F12 → Console) quand l'app tourne sur localhost:5173

const session = {
  session_id: "sebastian-wahl-2026-03-22",
  date: "2026-03-22",
  current_step: { registre: 4, question: 5 },
  registres: {
    reptilien: {
      completed: true,
      score: 6.7,
      points_forts: [
        "Rythme de vie stable",
        "Sécurité physique et territoriale solide",
        "Structure de journée prévisible"
      ],
      points_faibles: [
        "Sommeil très dégradé (ruminations, réveils fréquents)",
        "Routines corporelles insuffisantes",
        "Stabilité construite sur l'isolement"
      ],
      questions: [
        {
          numero: 1, texte: "Tes besoins de base sont-ils couverts de façon stable ?",
          dimensions: ["Sommeil", "Alimentation", "Sécurité physique"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Sommeil", score: 1.5, commentaire: "Sommeil dégradé, ruminations nocturnes" },
            { label: "Alimentation", score: 2.8, commentaire: "Alimentation correcte, assez stable" },
            { label: "Sécurité physique", score: 3.0, commentaire: "Environnement stable, aucun danger" }
          ],
          score_claude: 7.3, score_final: 7.3, ajuste: false
        },
        {
          numero: 2, texte: "As-tu des routines corporelles régulières ?",
          dimensions: ["Sport / mouvement", "Rythme sommeil", "Alimentation cohérente"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Sport / mouvement", score: 1.2, commentaire: "Sport abandonné depuis janvier 2025" },
            { label: "Rythme sommeil", score: 1.8, commentaire: "Heures variables, coucher tardif" },
            { label: "Alimentation cohérente", score: 2.0, commentaire: "Repas irréguliers mais corrects" }
          ],
          score_claude: 5.0, score_final: 5.0, ajuste: false
        },
        {
          numero: 3, texte: "Face au stress intense ou au danger, comment réagis-tu ?",
          dimensions: ["Réaction immédiate", "Récupération", "Anticipation"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Réaction immédiate", score: 2.2, commentaire: "Contention, pas de panique" },
            { label: "Récupération", score: 1.8, commentaire: "Récupération lente, ruminations" },
            { label: "Anticipation", score: 2.0, commentaire: "Anticipation mentale, peu d'action" }
          ],
          score_claude: 6.0, score_final: 6.0, ajuste: false
        },
        {
          numero: 4, texte: "As-tu un espace de vie et de travail que tu maîtrises ?",
          dimensions: ["Espace de vie", "Espace de travail", "Sentiment de chez soi"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Espace de vie", score: 2.3, commentaire: "Maison familiale, confortable" },
            { label: "Espace de travail", score: 2.0, commentaire: "Bureau fonctionnel mais partagé" },
            { label: "Sentiment de chez soi", score: 2.0, commentaire: "Sentiment ambivalent — transitoire" }
          ],
          score_claude: 6.3, score_final: 6.3, ajuste: false
        },
        {
          numero: 5, texte: "Ta vie a-t-elle un rythme prévisible et stable ?",
          dimensions: ["Structure de la journée", "Prévisibilité de la semaine", "Stabilité globale"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Structure de la journée", score: 3.0, commentaire: "Journée structurée, blocs horaires" },
            { label: "Prévisibilité de la semaine", score: 3.0, commentaire: "Semaine prévisible, peu d'imprévus" },
            { label: "Stabilité globale", score: 2.8, commentaire: "Stabilité solide malgré deuil récent" }
          ],
          score_claude: 8.8, score_final: 8.8, ajuste: false
        }
      ]
    },
    instinctif: {
      completed: true,
      score: 3.1,
      points_forts: [
        "Perception partielle de la fatigue physique",
        "Sensibilité aux signaux forts"
      ],
      points_faibles: [
        "Zéro pratique somatique ni respiration consciente",
        "Écrans permanents même pendant la marche",
        "Quasi aucune connexion corps-esprit cultivée"
      ],
      questions: [
        {
          numero: 1, texte: "Es-tu attentif aux signaux de ton corps ?",
          dimensions: ["Fatigue", "Tensions / douleurs", "Signaux digestifs / corporels"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Fatigue", score: 2.0, commentaire: "Fatigue perçue mais ignorée souvent" },
            { label: "Tensions / douleurs", score: 1.5, commentaire: "Douleurs dos/cou enregistrées, sans réponse" },
            { label: "Signaux digestifs / corporels", score: 1.0, commentaire: "Signaux peu conscientisés" }
          ],
          score_claude: 4.5, score_final: 4.5, ajuste: false
        },
        {
          numero: 2, texte: "Fais-tu confiance à ton intuition ?",
          dimensions: ["Perception", "Confiance", "Résultats"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Perception", score: 2.0, commentaire: "Intuition perçue intellectuellement" },
            { label: "Confiance", score: 1.5, commentaire: "Méfiance — préfère l'analyse rationnelle" },
            { label: "Résultats", score: 1.0, commentaire: "Peu de données pour évaluer" }
          ],
          score_claude: 4.5, score_final: 4.5, ajuste: false
        },
        {
          numero: 3, texte: "Pratiques-tu des activités qui t'ancrent dans ton corps ?",
          dimensions: ["Pratique physique régulière", "Respiration / pleine conscience", "Temps sans écrans"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Pratique physique régulière", score: 0.8, commentaire: "Sport abandonné, marche avec écrans" },
            { label: "Respiration / pleine conscience", score: 0.2, commentaire: "Aucune pratique de respiration" },
            { label: "Temps sans écrans", score: 0.5, commentaire: "Écrans quasi permanents" }
          ],
          score_claude: 1.5, score_final: 1.5, ajuste: false
        },
        {
          numero: 4, texte: "Arrives-tu à localiser physiquement tes émotions dans ton corps ?",
          dimensions: ["Conscience somatique", "Connexion émotion → corps", "Utilisation du signal"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Conscience somatique", score: 0.8, commentaire: "Très faible conscience somatique" },
            { label: "Connexion émotion → corps", score: 0.7, commentaire: "Connexion quasi absente" },
            { label: "Utilisation du signal", score: 0.5, commentaire: "Signal non utilisé" }
          ],
          score_claude: 2.0, score_final: 2.0, ajuste: false
        },
        {
          numero: 5, texte: "As-tu conscience de ta posture, respiration, tensions musculaires ?",
          dimensions: ["Posture", "Respiration", "Tensions musculaires"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Posture", score: 1.2, commentaire: "Posture avachie au bureau, non corrigée" },
            { label: "Respiration", score: 0.8, commentaire: "Respiration inconsciente, souvent haute" },
            { label: "Tensions musculaires", score: 1.0, commentaire: "Tensions dos/cou notées sans action" }
          ],
          score_claude: 3.0, score_final: 3.0, ajuste: false
        }
      ]
    },
    emotionnel: {
      completed: true,
      score: 3.5,
      points_forts: [
        "Empathie envers les autres réelle et solide",
        "Conscience que quelque chose est verrouillé"
      ],
      points_faibles: [
        "Vocabulaire émotionnel très basique",
        "Suppression systématique des émotions",
        "Isolement relationnel depuis le deuil (avril 2025)"
      ],
      questions: [
        {
          numero: 1, texte: "Sais-tu nommer précisément tes émotions ?",
          dimensions: ["Vocabulaire émotionnel", "Conscience en temps réel", "Nuance"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Vocabulaire émotionnel", score: 0.7, commentaire: "Bien/pas bien, rare nuance" },
            { label: "Conscience en temps réel", score: 0.8, commentaire: "Conscience différée, pas immédiate" },
            { label: "Nuance", score: 0.5, commentaire: "Difficulté à distinguer émotions proches" }
          ],
          score_claude: 2.0, score_final: 2.0, ajuste: false
        },
        {
          numero: 2, texte: "Arrives-tu à réguler une émotion intense ?",
          dimensions: ["Régulation vers le bas", "Ni suppression ni explosion", "Délai de récupération"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Régulation vers le bas", score: 1.5, commentaire: "Contention par rationalisation" },
            { label: "Ni suppression ni explosion", score: 1.2, commentaire: "Surtout suppression, rarement explosion" },
            { label: "Délai de récupération", score: 1.3, commentaire: "Récupération lente, ruminations" }
          ],
          score_claude: 4.0, score_final: 4.0, ajuste: false
        },
        {
          numero: 3, texte: "As-tu des relations proches où tu te sens en sécurité ?",
          dimensions: ["Quantité", "Qualité", "Réciprocité"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Quantité", score: 0.7, commentaire: "Très peu de liens actifs" },
            { label: "Qualité", score: 0.8, commentaire: "Liens distants depuis le deuil" },
            { label: "Réciprocité", score: 0.5, commentaire: "Réciprocité quasi absente" }
          ],
          score_claude: 2.0, score_final: 2.0, ajuste: false
        },
        {
          numero: 4, texte: "Es-tu capable d'empathie envers les autres ?",
          dimensions: ["Perception", "Distinction soi/autre", "Expression"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Perception", score: 2.8, commentaire: "Perception fine des états des autres" },
            { label: "Distinction soi/autre", score: 2.2, commentaire: "Bonne distinction, peu de fusion" },
            { label: "Expression", score: 2.0, commentaire: "Expression retenue mais présente" }
          ],
          score_claude: 7.0, score_final: 7.0, ajuste: false
        },
        {
          numero: 5, texte: "Exprimes-tu tes émotions de façon adaptée ?",
          dimensions: ["Fréquence", "Forme", "Contexte"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Fréquence", score: 0.8, commentaire: "Expression très rare" },
            { label: "Forme", score: 0.9, commentaire: "Forme adaptée quand ça arrive" },
            { label: "Contexte", score: 0.8, commentaire: "Contexte rarement perçu comme sûr" }
          ],
          score_claude: 2.5, score_final: 2.5, ajuste: false
        }
      ]
    },
    rationnel: {
      completed: true,
      score: 5.5,
      points_forts: [
        "Structuration des problèmes solide et rare",
        "Appétit d'apprentissage exceptionnel"
      ],
      points_faibles: [
        "Boucle réflexion → action cassée",
        "Remise en question défensive",
        "Décisions encore pilotées par l'émotionnel sous pression"
      ],
      questions: [
        {
          numero: 1, texte: "Arrives-tu à poser un problème complexe de façon structurée ?",
          dimensions: ["Décomposition", "Méthode", "Clarté du diagnostic"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Décomposition", score: 2.8, commentaire: "Décomposition naturelle et efficace" },
            { label: "Méthode", score: 2.5, commentaire: "Méthode intuitive mais solide" },
            { label: "Clarté du diagnostic", score: 2.2, commentaire: "Diagnostic clair, rapide" }
          ],
          score_claude: 7.5, score_final: 7.5, ajuste: false
        },
        {
          numero: 2, texte: "Planifies-tu tes actions et objectifs à moyen terme ?",
          dimensions: ["Horizon de planification", "Système de suivi", "Exécution"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Horizon de planification", score: 1.5, commentaire: "Plans théoriques, horizon variable" },
            { label: "Système de suivi", score: 0.8, commentaire: "Pas de système de suivi fiable" },
            { label: "Exécution", score: 0.7, commentaire: "Plans rarement exécutés jusqu'au bout" }
          ],
          score_claude: 3.0, score_final: 3.0, ajuste: false
        },
        {
          numero: 3, texte: "Remets-tu en question tes propres convictions ?",
          dimensions: ["Ouverture au désaccord", "Recherche active de preuves contraires", "Mise à jour des croyances"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Ouverture au désaccord", score: 1.5, commentaire: "Ouverture intellectuelle, défense émotionnelle" },
            { label: "Recherche active de preuves contraires", score: 1.0, commentaire: "Rare recherche active" },
            { label: "Mise à jour des croyances", score: 1.0, commentaire: "Lente, conditionnée à l'ego" }
          ],
          score_claude: 3.5, score_final: 3.5, ajuste: false
        },
        {
          numero: 4, texte: "Arrives-tu à prendre des décisions de façon détachée ?",
          dimensions: ["Détachement émotionnel", "Délai", "Qualité des décisions"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Détachement émotionnel", score: 1.8, commentaire: "Détachement partiel, variable selon l'enjeu" },
            { label: "Délai", score: 2.0, commentaire: "Délai utilisé comme outil" },
            { label: "Qualité des décisions", score: 1.7, commentaire: "Décisions globalement correctes" }
          ],
          score_claude: 5.5, score_final: 5.5, ajuste: false
        },
        {
          numero: 5, texte: "Te formes-tu, lis-tu, apprends-tu régulièrement ?",
          dimensions: ["Lecture", "Formation structurée", "Intégration"],
          reponse: "[Réponse non conservée — score reconstitué depuis le profil]",
          sous_scores: [
            { label: "Lecture", score: 2.8, commentaire: "Lecture régulière, variée, soutenue" },
            { label: "Formation structurée", score: 2.8, commentaire: "5+ formations actives simultanément" },
            { label: "Intégration", score: 2.2, commentaire: "Intégration partielle — théorie > pratique" }
          ],
          score_claude: 7.8, score_final: 7.8, ajuste: false
        }
      ]
    }
  },
  diagnostic: {
    dynamiques: [
      {
        titre: "Le circuit fermé rationnel",
        description: "Beaucoup d'input (formations, vidéos, réflexion), peu d'output (actions réelles). La boucle réflexion → action est cassée. Le rationnel tourne en circuit fermé."
      },
      {
        titre: "Le corps absent",
        description: "Le corps est un outil de transport pour la tête, pas une source d'information. Les signaux sont enregistrés (dos, cou, sommeil) sans réponse réelle. Zéro pratique somatique."
      },
      {
        titre: "Le verrouillage émotionnel",
        description: "Pattern de rétention émotionnelle antérieur, amplifié par le deuil d'avril 2025. L'empathie est réelle mais tournée vers les autres — jamais vers soi. Rien ne sort."
      }
    ],
    points_solides: [
      "Structuration des problèmes complexes — réelle et rare",
      "Empathie envers les autres — atout fort, mal redirigé vers soi",
      "Appétit d'apprentissage — exceptionnel, ressource à capitaliser",
      "Stabilité de vie — fondation solide malgré ses limites"
    ],
    priorites: [
      {
        registre: "Instinctif",
        score: 3.1,
        actions: [
          "Marche sans écrans 20 min par jour, téléphone en poche",
          "Cohérence cardiaque 5 min le matin avant le premier écran",
          "Body scan 5 min avant de dormir"
        ]
      },
      {
        registre: "Émotionnel",
        score: 3.5,
        actions: [
          "Journal émotionnel — 3 lignes/jour : émotion, intensité, déclencheur",
          "Roue des émotions de Plutchik — à portée pour nommer",
          "Une conversation réelle par semaine — appel ou rencontre"
        ]
      },
      {
        registre: "Rationnel",
        score: 5.5,
        actions: [
          "Règle du 2 minutes — si ça prend moins de 2 min à démarrer, le faire maintenant",
          "Une seule priorité par semaine — écrite sur papier le lundi matin",
          "Log de décisions — contexte, choix, raisonnement, relecture à 3 mois"
        ]
      }
    ],
    lecture_globale: "Profil intelligent et sensible, ayant construit une forteresse rationnelle pour traverser une période difficile. Cette forteresse a bien fonctionné — mais elle commence à coûter plus qu'elle ne protège : isolement, fatigue mentale chronique, plans sans suite, corps ignoré.\n\nLe Reptilien est solide : rythme de vie stable, sécurité territoriale, structure du quotidien. C'est la fondation. Le Rationnel est actif mais en circuit fermé : beaucoup d'analyse, peu d'action. L'Instinctif et l'Émotionnel sont les deux registres verrouillés — et ils le sont ensemble, ce qui n'est pas un hasard.\n\nLe travail n'est pas de tout changer. C'est de rouvrir progressivement les registres fermés, en commençant par le plus simple et le plus concret : le corps. Vingt minutes de marche sans écrans par jour, c'est le premier domino."
  }
};

localStorage.setItem('reboot_session', JSON.stringify(session));
console.log('✓ Profil Sebastian chargé. Recharge la page et tu arriveras directement au diagnostic.');
