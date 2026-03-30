// Fallback diagnostic generator - Crée un rapport complet quand l'API échoue
// Basé sur les scores des 4 registres

const REGISTRES_META = {
  reptilien: { label: 'Reptilien', icon: '🦎', abbr: 'REP' },
  instinctif: { label: 'Instinctif', abbr: 'INS', icon: '🫀' },
  emotionnel: { label: 'Émotionnel', abbr: 'EMO', icon: '💛' },
  rationnel: { label: 'Rationnel', abbr: 'RAT', icon: '🧠' }
};

export function generateFallbackDiagnostic(registresScores) {
  const scores = {
    reptilien: registresScores.reptilien?.score || 0,
    instinctif: registresScores.instinctif?.score || 0,
    emotionnel: registresScores.emotionnel?.score || 0,
    rationnel: registresScores.rationnel?.score || 0
  };

  const total = scores.reptilien + scores.instinctif + scores.emotionnel + scores.rationnel;
  
  // Déterminer le profil dominant et la configuration
  const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const faible = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  
  return {
    resume_court: generateSynthese(scores, dominant, faible),
    lecture_globale: generateLecture(scores, dominant, faible, total),
    dynamiques: generateDynamiques(scores, dominant, faible),
    points_solides: generateForces(scores),
    priorites_intro: generatePrioritesIntro(scores, faible),
    priorites: generatePriorites(scores),
    conseils: generateConseils(scores)
  };
}

function generateSynthese(scores, dominant, faible) {
  const configs = {
    rationnel: 'Profil à forte dominante cognitive et analytique.',
    reptilien: 'Profil ancré avec des ressources physiques solides.',
    emotionnel: 'Profil relationnel et empathique.',
    instinctif: 'Profil intuitif et corporel.'
  };
  
  const tensions = {
    'rationnel-emotionnel': 'Tension entre la tête et le cœur.',
    'rationnel-instinctif': 'Déconnexion entre l\'analyse et le ressenti corporel.',
    'emotionnel-instinctif': 'Émotions présentes mais corps peu écouté.',
    'reptilien-instinctif': 'Fondations solides mais manque de finesse corporelle.'
  };
  
  const base = configs[dominant] || 'Profil équilibré';
  const tensionKey = `${dominant}-${faible}`;
  const tension = tensions[tensionKey] || 'Déséquilibre à travailler.';
  
  return `${base} ${tension} Le registre ${REGISTRES_META[faible].label} (${scores[faible]}/25) demande une attention particulière pour rééquilibrer le profil.`;
}

function generateLecture(scores, dominant, faible, total) {
  const pourcentage = Math.round((total / 100) * 100);
  
  let texte = `Ce profil totalise ${total}/100 points (${pourcentage}%), avec une configuration marquée par une dominante ${REGISTRES_META[dominant].label.toLowerCase()} (${scores[dominant]}/25) et un point faible significatif au niveau ${REGISTRES_META[faible].label.toLowerCase()} (${scores[faible]}/25).\n\n`;
  
  // Analyse par registre
  texte += `Le registre ${REGISTRES_META.reptilien.label} à ${scores.reptilien}/25 indique `;
  if (scores.reptilien >= 15) {
    texte += `des fondations physiques solides. Les besoins primaires sont globalement satisfaits, ce qui constitue une base favorable pour le développement personnel. `;
  } else if (scores.reptilien >= 10) {
    texte += `une base physique moyenne avec des marges de progression importantes sur le sommeil, l'activité physique ou l'alimentation. `;
  } else {
    texte += `une fragilité des fondations physiques. Le sommeil, l'énergie ou l'ancrage corporel nécessitent une attention prioritaire. Sans cette base, les autres registres auront du mal à s'épanouir. `;
  }
  
  texte += `\n\nLe registre ${REGISTRES_META.instinctif.label} à ${scores.instinctif}/25 révèle `;
  if (scores.instinctif >= 15) {
    texte += `une bonne connexion aux signaux internes et à l'intuition. La personne sait écouter son corps et fait confiance à ses ressentis. `;
  } else if (scores.instinctif >= 10) {
    texte += `une conscience corporelle partielle. Les signaux intenses sont perçus mais les nuances sont manquées. `;
  } else {
    texte += `une déconnexion marquée avec le corps. L'intuition est peu fiable ou ignorée, et les signaux physiques sont traités comme des problèmes techniques plutôt que comme de l'information. `;
  }
  
  texte += `\n\nLe registre ${REGISTRES_META.emotionnel.label} à ${scores.emotionnel}/25 montre `;
  if (scores.emotionnel >= 15) {
    texte += `des ressources émotionnelles solides. La personne sait nommer, réguler et exprimer ses émotions dans des relations satisfaisantes. `;
  } else if (scores.emotionnel >= 10) {
    texte += `des capacités émotionnelles en développement. Certaines ressources existent mais des blocages persistent dans l'expression ou la régulation. `;
  } else {
    texte += `une vie émotionnelle contrainte. Les émotions sont présentes mais difficiles à nommer, canaliser ou partager. Les relations peuvent en pâtir. `;
  }
  
  texte += `\n\nLe registre ${REGISTRES_META.rationnel.label} à ${scores.rationnel}/25 témoigne `;
  if (scores.rationnel >= 15) {
    texte += `d'une pensée analytique structurée et efficace. La personne sait décomposer les problèmes, apprendre et planifier. `;
  } else if (scores.rationnel >= 10) {
    texte += `de capacités cognitives correctes mais qui pourraient être mieux exploitées. `;
  } else {
    texte += `de difficultés dans la structuration de la pensée, la planification ou la prise de décision. Le mode de fonctionnement est plus réactif qu'analytique. `;
  }
  
  texte += `\n\nCe profil dessine une personne qui `;
  if (dominant === 'rationnel' && scores.rationnel > scores.instinctif + 5 && scores.rationnel > scores.emotionnel + 5) {
    texte += `fonctionne principalement par l'analyse et la compréhension, parfois au détriment du ressenti et de l'intuition. Le risque est de construire une "forteresse cognitive" qui protège mais isole.`;
  } else if (dominant === 'reptilien' && scores.reptilien > 15) {
    texte += `a des bases solides mais qui pourrait mieux utiliser ses ressources physiques pour développer l'intuition et l'intelligence émotionnelle.`;
  } else if (scores.instinctif < 10 && scores.emotionnel < 10) {
    texte += `a une vie intérieure (corps + émotions) peu développée par rapport à ses capacités mentales. C'est le chantier prioritaire pour retrouver un équilibre.`;
  } else {
    texte += `a un profil avec des ressources réelles mais un équilibre à retrouver entre les différents modes de fonctionnement.`;
  }
  
  return texte;
}

function generateDynamiques(scores, dominant, faible) {
  const dynamiques = [];
  
  // Dynamique 1 : Le profil dominant
  if (dominant === 'rationnel' && scores.rationnel > 15) {
    dynamiques.push({
      titre: 'Le refuge rationnel',
      description: `La pensée analytique sert de mécanisme de contrôle et de sécurité. C'est une stratégie efficace qui a bien fonctionné, mais elle occupe tellement d'espace mental qu'elle laisse peu de place au ressenti corporel et émotionnel. Le risque est de fonctionner en "circuit fermé" : beaucoup d'input cognitif, peu d'output réel dans la vie.`
    });
  } else if (dominant === 'reptilien' && scores.reptilien > 15) {
    dynamiques.push({
      titre: 'L\'ancrage physique solide',
      description: `Les fondations sont là, mais elles ne sont pas toujours utilisées comme ressources pour développer les autres registres. C'est comme avoir une belle maison avec des fondations solides mais ne pas oser sortir de chez soi. Le corps existe comme base de survie, pas encore comme source d'information fine.`
    });
  }
  
  // Dynamique 2 : La dissonance corps/émotions
  if (scores.instinctif < 10 && scores.emotionnel < 10) {
    dynamiques.push({
      titre: 'La dissociation interne',
      description: `Corps et émotions sont présents mais peu écoutés. Les signaux internes sont traités comme des problèmes à gérer plutôt que comme des informations précieuses. Cela crée une forme de "dissociation fonctionnelle" où la tête pilote sans consulter les autres instances.`
    });
  }
  
  // Dynamique 3 : Le registre faible
  if (faible === 'instinctif' && scores.instinctif < 8) {
    dynamiques.push({
      titre: 'Le corps fantôme',
      description: `L'intuition et les signaux corporels sont ignorés ou jugés non fiables. Le corps existe comme source de problèmes (fatigue, tensions) mais pas comme ressource. C'est le registre le plus à reconstruire car il est fondamental pour l'équilibre global.`
    });
  } else if (faible === 'emotionnel' && scores.emotionnel < 8) {
    dynamiques.push({
      titre: 'Les émotions sous scellés',
      description: `Les émotions sont là mais difficiles à nommer, réguler ou exprimer. Il peut y avoir un pattern de rétention alternant avec des débordements. Les relations en pâtissent car la vulnérabilité est difficile.`
    });
  } else if (faible === 'reptilien' && scores.reptilien < 10) {
    dynamiques.push({
      titre: 'Les fondations à restaurer',
      description: `Le sommeil, l'énergie ou l'activité physique sont dégradés. Sans ces bases, les autres chantiers ne peuvent pas avancer sereinement. C'est la priorité absolue : le corps vient en premier.`
    });
  }
  
  // Si on n'a pas 3 dynamiques, compléter
  while (dynamiques.length < 3) {
    dynamiques.push({
      titre: `Configuration ${REGISTRES_META[dominant].label.toLowerCase()}/${REGISTRES_META[faible].label.toLowerCase()}`,
      description: `Cette configuration entre ${REGISTRES_META[dominant].label.toLowerCase()} fort et ${REGISTRES_META[faible].label.toLowerCase()} faible crée un déséquilibre à travailler. Les ressources du registre dominant peuvent être utilisées pour développer le registre faible.`
    });
  }
  
  return dynamiques.slice(0, 3);
}

function generateForces(scores) {
  const forces = [];
  
  Object.entries(scores).forEach(([registre, score]) => {
    if (score >= 15) {
      const forceTexts = {
        reptilien: 'Base physique solide et stable pour construire',
        instinctif: 'Capacité à percevoir et écouter les signaux internes',
        emotionnel: 'Ressources émotionnelles et relationnelles réelles',
        rationnel: 'Excellente capacité d\'analyse et de structuration'
      };
      forces.push(forceTexts[registre]);
    }
  });
  
  // Forces génériques si pas assez
  if (forces.length < 3) {
    forces.push('Conscience des enjeux et motivation pour progresser');
  }
  if (forces.length < 3) {
    forces.push('Lucidité sur son profil et ses points de vigilance');
  }
  if (forces.length < 3) {
    forces.push('Capacité d\'apprentissage et d\'adaptation présente');
  }
  
  return forces.slice(0, 5);
}

function generatePrioritesIntro(scores, faible) {
  const registrePrioritaire = scores.reptilien < 15 ? 'reptilien' : faible;
  
  return `Le registre ${REGISTRES_META[registrePrioritaire].label} (${scores[registrePrioritaire]}/25) est le chantier prioritaire car il constitue la base sur laquelle tout le reste repose. La séquence recommandée est : d'abord ${REGISTRES_META[registrePrioritaire].label.toLowerCase()}, puis développer progressivement les autres registres. Ces chantiers se renforcent mutuellement dès que le premier démarre.`;
}

function generatePriorites(scores) {
  const priorites = [];
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  
  sorted.forEach(([registre, score]) => {
    if (priorites.length >= 4) return;
    
    const buts = {
      reptilien: score < 15 ? 'restaurer les fondamentaux' : 'optimiser la base',
      instinctif: score < 10 ? 'réintégrer le corps' : 'affiner l écoute',
      emotionnel: score < 10 ? 'ouvrir le canal émotionnel' : 'développer l expression',
      rationnel: score < 15 ? 'débloquer la pensée' : 'équilibrer l analyse'
    };
    
    const actions = getActionsForRegistre(registre, score);
    
    priorites.push({
      registre: REGISTRES_META[registre].label,
      score: score,
      but: buts[registre],
      actions: actions
    });
  });
  
  return priorites;
}

function getActionsForRegistre(registre, score) {
  const actions = {
    reptilien: score < 12 ? [
      'Téléphone hors chambre à 22h — qualité du sommeil prioritaire',
      'Activité physique 3x/semaine minimum — ancrage corporel',
      'Heures de repas régulières — rythme circadien stable'
    ] : score < 17 ? [
      'Optimiser le sommeil : routine, obscurité, température',
      'Intensifier l\'activité physique avec plaisir',
      'Créer des rituels d\'ancrage matin et soir'
    ] : [
      'Maintenir les bonnes pratiques de sommeil',
      'Diversifier les activités physiques',
      'Utiliser cette base pour développer les autres registres'
    ],
    instinctif: score < 8 ? [
      'Marche sans smartphone 20 min/jour — corps sans occupation',
      'Cohérence cardiaque 5 min/jour (app Respirelax)',
      'Body scan 5 min le soir — écouter sans comprendre'
    ] : score < 13 ? [
      'Pratique de méditation corporelle 10 min/jour',
      'Noter 3 sensations corporelles par jour',
      'Tester des pratiques somatiques (yoga, tai chi)'
    ] : [
      'Affiner l\'écoute des signaux subtils',
      'Développer l\'intuition dans les décisions',
      'Partager cette connexion corporelle'
    ],
    emotionnel: score < 8 ? [
      'Journal émotionnel : nommer 1 émotion/jour',
      'Roue des émotions de Plutchik à portée de main',
      'Une vraie conversation/semaine — pas WhatsApp'
    ] : score < 13 ? [
      'Pratiquer l\'expression émotionnelle avec confiance',
      'Identifier les déclencheurs émotionnels',
      'Cultiver une relation de sécurité émotionnelle'
    ] : [
      'Affiner le vocabulaire émotionnel',
      'Aider les autres dans leur régulation',
      'Explorer la vulnérabilité dans les relations'
    ],
    rationnel: score < 12 ? [
      'Structurer un problème par jour — méthode 5W',
      'Une décision consciente/jour sans sur-analyse',
      'Technique Pomodoro pour le focus'
    ] : score < 17 ? [
      'Développer la pensée stratégique long terme',
      'Pratiquer la pensée critique sur ses certitudes',
      'Équilibrer analyse et intuition'
    ] : [
      'Utiliser cette force pour développer les autres registres',
      'Mentorat : aider les autres à structurer',
      'Créativité cognitive : pensée latérale'
    ]
  };
  
  return actions[registre] || ['Action à définir selon le contexte'];
}

function generateConseils(scores) {
  const conseilsGeneraux = [];
  
  if (scores.reptilien < 12) {
    conseilsGeneraux.push('Sans sommeil réparateur et activité physique, les autres chantiers ne peuvent pas avancer. Le corps vient en premier.');
  }
  
  if (scores.rationnel > 15 && scores.instinctif < 10) {
    conseilsGeneraux.push('Votre force analytique peut être utilisée pour comprendre et développer vos autres registres, pas pour les remplacer.');
  }
  
  if (scores.instinctif < 10 && scores.emotionnel < 10) {
    conseilsGeneraux.push('Ne cherchez pas à "comprendre" avant de ressentir. Le comprendre vient après, pas avant.');
  }
  
  conseilsGeneraux.push('Les petits gestes répétés valent mieux que les grands changements. Un pas à la fois.');
  conseilsGeneraux.push('La progression est non-linéaire. Certains jours seront meilleurs que d\'autres, c\'est normal.');
  
  // Pratiques quotidiennes
  const pratiques = {
    matin: [],
    journee: [],
    soir: []
  };
  
  // Matin
  if (scores.reptilien < 15) {
    pratiques.matin.push('Réveil à heure fixe — téléphone hors chambre');
    pratiques.matin.push('5 min de respiration ou cohérence cardiaque avant les écrans');
  } else {
    pratiques.matin.push('Routine matinale ancrée : respiration, étirements, intention');
    pratiques.matin.push('Un moment de calme avant de consulter les écrans');
  }
  
  // Journée
  if (scores.instinctif < 10) {
    pratiques.journee.push('Marche sans smartphone 20 min — corps sans occupation cognitive');
    pratiques.journee.push('3 pauses de 1 min pour vérifier une sensation corporelle');
  } else {
    pratiques.journee.push('Respecter les signaux de faim, fatigue, tension');
    pratiques.journee.push('Une pause écran toutes les 90 min');
  }
  
  // Soir
  if (scores.emotionnel < 10) {
    pratiques.soir.push('Journal émotionnel : émotion du jour, intensité, déclencheur');
    pratiques.soir.push('Téléphone hors chambre à 22h');
  } else {
    pratiques.soir.push('Intégration de la journée : 3 choses positives');
    pratiques.soir.push('Rituel de déconnexion : méditation, lecture, étirements');
  }
  
  // Concepts
  const concepts = [
    { concept: 'Théorie polyvagale (Porges)', pourquoi: 'Comprendre le système nerveux et la régulation de la sécurité corporelle.' },
    { concept: 'Intelligence émotionnelle (Goleman)', pourquoi: 'Cadre complet pour développer conscience et régulation émotionnelle.' },
    { concept: 'Somatic Experiencing (Levine)', pourquoi: 'Méthode concrète pour reconnecter corps et psyché.' },
    { concept: 'Métacognition', pourquoi: 'Observer ses propres processus de pensée pour mieux les maîtriser.' }
  ];
  
  // Ressources
  const ressources = [
    { titre: 'Le corps n\'oublie rien', auteur: 'Bessel van der Kolk', type: 'livre', pourquoi: 'Comprendre comment les émotions non traitées se logent dans le corps.' },
    { titre: 'Emotional Intelligence', auteur: 'Daniel Goleman', type: 'livre', pourquoi: 'Développer méthodiquement l\'intelligence émotionnelle.' },
    { titre: 'Waking the Tiger', auteur: 'Peter Levine', type: 'livre', pourquoi: 'Méthode Somatic Experiencing pour réactiver le registre instinctif.' },
    { titre: 'Thinking, Fast and Slow', auteur: 'Daniel Kahneman', type: 'livre', pourquoi: 'Comprendre les deux systèmes de pensée et leurs biais.' }
  ];
  
  return {
    pratiques_quotidiennes: pratiques,
    conseils_generaux: conseilsGeneraux,
    concepts_a_etudier: concepts,
    ressources: ressources
  };
}
