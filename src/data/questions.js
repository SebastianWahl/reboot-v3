export const REGISTERS = [
  { id: 'reptilien', label: 'Reptilien', icon: '🦎', intro: 'Ton ancrage, ta sécurité physique, tes routines de base.', color: '#e07b39' },
  { id: 'instinctif', label: 'Instinctif', icon: '🫀', intro: 'Ta connexion au corps, ton intuition, tes ressentis somatiques.', color: '#c0392b' },
  { id: 'emotionnel', label: 'Émotionnel', icon: '💛', intro: 'Ta conscience émotionnelle, ta régulation, tes liens aux autres.', color: '#e6a817' },
  { id: 'rationnel', label: 'Rationnel', icon: '🧠', intro: "Ta clarté de pensée, ta capacité d'analyse, ton passage à l'acte.", color: '#2980b9' },
];

export const QUESTIONS = [
  { registre: 'reptilien', numero: 1, texte: 'Tes besoins de base sont-ils couverts de façon stable ? Parle-moi de ton sommeil, ton alimentation, et ta sécurité physique.', dimensions: ['Sommeil', 'Alimentation', 'Sécurité physique'] },
  { registre: 'reptilien', numero: 2, texte: "As-tu des routines corporelles régulières ? Décris ton activité physique, tes heures de lever/coucher, et ta façon de manger au quotidien.", dimensions: ['Sport / mouvement', 'Rythme sommeil', 'Alimentation cohérente'] },
  { registre: 'reptilien', numero: 3, texte: "Face au stress intense ou au danger, comment réagis-tu ? Décris ta réaction dans l'instant, comment tu récupères, et comment tu anticipes ces situations.", dimensions: ['Réaction immédiate', 'Récupération', 'Anticipation'] },
  { registre: 'reptilien', numero: 4, texte: "As-tu un espace de vie et de travail que tu maîtrises et qui te ressource ? Comment te sens-tu dans ton environnement quotidien ?", dimensions: ['Espace de vie', 'Espace de travail', 'Sentiment de "chez soi"'] },
  { registre: 'reptilien', numero: 5, texte: 'Ta vie a-t-elle un rythme prévisible et stable ? Décris comment se structure ta journée type et ta semaine.', dimensions: ['Structure de la journée', 'Prévisibilité de la semaine', 'Stabilité globale'] },
  { registre: 'instinctif', numero: 6, texte: 'Es-tu attentif aux signaux de ton corps — fatigue, tensions, douleurs, faim ? Comment y réponds-tu au quotidien ?', dimensions: ['Fatigue', 'Tensions / douleurs', 'Signaux digestifs / corporels'] },
  { registre: 'instinctif', numero: 7, texte: 'Fais-tu confiance à ton intuition, ton "gut feeling" ? Décris comment tu le perçois, si tu lui fais confiance, et ce que ça donne quand tu le suis.', dimensions: ['Perception', 'Confiance', 'Résultats'] },
  { registre: 'instinctif', numero: 8, texte: "Pratiques-tu des activités qui t'ancrent dans ton corps — sport, yoga, méditation, respiration ? As-tu des moments sans écrans dans ta journée ?", dimensions: ['Pratique physique régulière', 'Respiration / pleine conscience', 'Temps sans écrans'] },
  { registre: 'instinctif', numero: 9, texte: 'Arrives-tu à localiser physiquement tes émotions dans ton corps ? Quand tu es stressé ou joyeux, que ressens-tu physiquement et où ?', dimensions: ['Conscience somatique', 'Connexion émotion → corps', 'Utilisation du signal'] },
  { registre: 'instinctif', numero: 10, texte: 'As-tu conscience de ta posture, de ta façon de respirer, de tes tensions musculaires au quotidien ? Décris ce que tu observes.', dimensions: ['Posture', 'Respiration', 'Tensions musculaires'] },
  { registre: 'emotionnel', numero: 11, texte: 'Sais-tu nommer précisément tes émotions au moment où tu les vis ? Arrives-tu à distinguer frustration, colère, déception, impuissance ?', dimensions: ['Vocabulaire émotionnel', 'Conscience en temps réel', 'Nuance'] },
  { registre: 'emotionnel', numero: 12, texte: "Arrives-tu à réguler une émotion intense sans l'étouffer ni te laisser déborder ? Décris ce qui se passe en toi quand tu vis une émotion forte.", dimensions: ['Régulation vers le bas', 'Ni suppression ni explosion', 'Délai de récupération'] },
  { registre: 'emotionnel', numero: 13, texte: 'As-tu des relations proches où tu te sens vraiment compris et en sécurité ? Décris ces liens — combien, comment, à quel niveau de profondeur.', dimensions: ['Quantité', 'Qualité', 'Réciprocité'] },
  { registre: 'emotionnel', numero: 14, texte: "Es-tu capable d'empathie envers les autres ? Arrives-tu à sentir ce qu'ils vivent, à distinguer leurs émotions des tiennes, et à le leur montrer ?", dimensions: ['Perception', 'Distinction soi/autre', 'Expression'] },
  { registre: 'emotionnel', numero: 15, texte: 'Exprimes-tu tes émotions de façon adaptée dans ta vie relationnelle ? Ou as-tu tendance à les retenir, les minimiser ou les laisser déborder ?', dimensions: ['Fréquence', 'Forme', 'Contexte'] },
  { registre: 'rationnel', numero: 16, texte: "Arrives-tu à poser un problème complexe de façon structurée ? Décris comment tu t'y prends quand tu dois résoudre quelque chose de difficile.", dimensions: ['Décomposition', 'Méthode', 'Clarté du diagnostic'] },
  { registre: 'rationnel', numero: 17, texte: 'Planifies-tu tes actions et objectifs à moyen terme ? As-tu un système de suivi ? Tes plans se traduisent-ils en actions réelles ?', dimensions: ['Horizon de planification', 'Système de suivi', 'Exécution'] },
  { registre: 'rationnel', numero: 18, texte: 'Remets-tu en question tes propres convictions ? Accueilles-tu les points de vue contraires ? Et quand tu as tort, comment réagis-tu ?', dimensions: ['Ouverture au désaccord', 'Recherche active de preuves contraires', 'Mise à jour des croyances'] },
  { registre: 'rationnel', numero: 19, texte: "Arrives-tu à prendre des décisions importantes de façon détachée de tes émotions du moment ? Décris ton processus de décision sur des sujets importants.", dimensions: ['Détachement émotionnel', 'Délai', 'Qualité des décisions'] },
  { registre: 'rationnel', numero: 20, texte: "Te formes-tu, lis-tu, apprends-tu régulièrement ? Et ce que tu apprends, tu l'appliques concrètement ou ça reste théorique ?", dimensions: ['Lecture', 'Formation structurée', 'Intégration'] },
];

export const REGISTER_ORDER = ['reptilien', 'instinctif', 'emotionnel', 'rationnel'];
