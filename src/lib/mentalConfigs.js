// 12 questions pour l'audit Mental & Cognitif
// Format hybride : Échelle Likert 1-5 + 3 champs texte libres

export const MENTAL_QUESTIONS = [
  {
    id: 'mental_01',
    dimension: 'Structuration Cognitive',
    icon: '🧩',
    texte: "Face à un problème complexe (projet, décision, dilemme), comment structures-tu ta pensée pour le résoudre ?",
    suggestions: 'décomposition en étapes, liste de pros/cons, mind mapping, analyse systémique, recherche d informations, consultation',
    champ1: 'Dernier problème complexe que tu as structuré',
    champ2: 'La méthode que tu as utilisée (ou l absence de méthode)',
    champ3: 'Ce qui t a aidé ou bloqué dans ce processus',
    noteMin: "Totalement chaotique — je me perds dans les options",
    noteMax: "Très structuré — j'ai une méthode claire et efficace"
  },
  {
    id: 'mental_02',
    dimension: 'Planification & Exécution',
    icon: '📋',
    texte: "Quand tu as une intention ou un objectif, arrives-tu à le transformer en actions concrètes et à les réaliser ?",
    suggestions: 'todo list, calendrier, rappels, projets prioritaires, actions immédiates, report habituel',
    champ1: 'Dernier objectif où tu es passé de l intention à l action',
    champ2: 'Ce qui t a fait passer à l action (ou ce qui t a bloqué)',
    champ3: 'Pattern habituel : planificateur ou procrastinateur ?',
    noteMin: "Beaucoup d'intentions, peu d'actions concrètes",
    noteMax: "Exécution fluide — je transforme mes idées en réalité"
  },
  {
    id: 'mental_03',
    dimension: 'Gestion du Feedback',
    icon: '🔄',
    texte: "Comment réagis-tu quand quelqu'un remet en question tes idées, tes décisions ou ton travail ?",
    suggestions: 'défense immédiate, écoute active, remise en question, analyse de la critique, adaptation, rejet',
    champ1: 'Dernière fois où on a remis en question une idée ou décision importante',
    champ2: 'Ton réflexe initial (défensive, ouverte, curieuse, etc.)',
    champ3: 'Résultat : as-tu changé d avis ou maintenu ta position ?',
    noteMin: "Très défensif — je prends la critique comme une attaque",
    noteMax: "Ouvert et curieux — la critique m enrichit"
  },
  {
    id: 'mental_04',
    dimension: 'Prise de Décision',
    icon: '⚖️',
    texte: "Arrives-tu à prendre des décisions en distinguant clairement l'intuition, les émotions et la rationalité ?",
    suggestions: 'analyse pros/cons, gut feeling, émotion du moment, recherche de données, consultation, procrastination',
    champ1: 'Dernière décision importante prise (ou reportée)',
    champ2: 'Qu est-ce qui a guidé ta décision : raison, intuition, émotion ?',
    champ3: 'Résultat : regret, satisfaction, doute persistant ?',
    noteMin: "Décisions impulsives ou bloqué par l analyse",
    noteMax: "Distingue clairement et combine les 3 sources"
  },
  {
    id: 'mental_05',
    dimension: 'Apprentissage Continu',
    icon: '📚',
    texte: "As-tu une pratique régulière d'apprentissage et de mise à jour de tes connaissances ?",
    suggestions: 'lecture, podcasts, formations, expérimentation, veille, discussion, curiosité quotidienne',
    champ1: 'Dernier sujet où tu as activement appris quelque chose',
    champ2: 'Ta méthode d apprentissage préférée et sa fréquence',
    champ3: 'Ce qui t empêche d apprendre (manque de temps, manque d intérêt, etc.)',
    noteMin: "Apprentissage sporadique ou lié à l obligation",
    noteMax: "Apprentissage régulier et guidé par la curiosité"
  },
  {
    id: 'mental_06',
    dimension: 'Pensée Critique',
    icon: '🔍',
    texte: "Remets-tu en question tes propres certitudes et biais de pensée ? Cherches-tu activement des contre-arguments ?",
    suggestions: 'devil s advocate, recherche de sources contradictoires, questionnement des croyances, biais cognitifs',
    champ1: 'Dernière croyance ou certitude que tu as remise en question',
    champ2: 'Comment tu identifies tes propres biais de pensée',
    champ3: 'Sujet où tu es le plus fermé ou dogmatique',
    noteMin: "Je défends mes positions — rarement remis en question",
    noteMax: "Remise en question régulière de mes propres certitudes"
  },
  {
    id: 'mental_07',
    dimension: 'Mémoire de Travail',
    icon: '💾',
    texte: "Comment gères-tu la charge cognitive ? Arrives-tu à jongler avec plusieurs informations sans te perdre ?",
    suggestions: 'notes, listes, organisation digitale, multitâche, focus unique, surcharge cognitive fréquente',
    champ1: 'Dernière situation où tu as été submergé par trop d informations',
    champ2: 'Outils ou méthodes que tu utilises pour gérer la charge mentale',
    champ3: 'Ce qui te fait perdre le fil ou oublier des éléments importants',
    noteMin: "Surcharge cognitive fréquente — j oublie beaucoup",
    noteMax: "Gestion optimale — je garde le fil même sous pression"
  },
  {
    id: 'mental_08',
    dimension: 'Flexibilité Mentale',
    icon: '🌊',
    texte: "Quand les plans changent ou qu'une situation évolue, arrives-tu à adapter ta pensée rapidement ?",
    suggestions: 'pivot rapide, rigidité, frustration, exploration d alternatives, improvisation, plan B systématique',
    champ1: 'Dernière fois où tu as dû changer de plan ou pivoter rapidement',
    champ2: 'Ton réflexe face au changement (adaptation, résistance, stress)',
    champ3: 'Domaine où tu es le plus rigide ou le plus flexible',
    noteMin: "Très rigide — le changement me stresse énormément",
    noteMax: "Très adaptable — je pivote avec fluidité"
  },
  {
    id: 'mental_09',
    dimension: 'Focus & Concentration',
    icon: '🎯',
    texte: "Arrives-tu à maintenir une concentration profonde (deep work) sans te laisser distraire ?",
    suggestions: 'blocage notifications, pomodoro, environnement calme, multitâche constant, interruptions fréquentes',
    champ1: 'Dernière session de deep work réussie (ou échouée)',
    champ2: 'Ce qui te distrait le plus (téléphone, notifications, pensées)',
    champ3: 'Méthodes que tu utilises (ou pas) pour protéger ton focus',
    noteMin: "Distraction constante — incapable de focus profond",
    noteMax: "Focus excellent — je contrôle mes distractions"
  },
  {
    id: 'mental_10',
    dimension: 'Pensée Stratégique',
    icon: '🗺️',
    texte: "Quand tu réfléchis à long terme, arrives-tu à anticiper les conséquences et à construire une vision claire ?",
    suggestions: 'vision 1/3/5 ans, anticipation des obstacles, planification stratégique, vivre au jour le jour',
    champ1: 'Dernier projet où tu as pensé stratégiquement à long terme',
    champ2: 'Horizon temporel où tu es le plus à l aise (court, moyen, long)',
    champ3: 'Ce qui te bloque dans la pensée stratégique',
    noteMin: "Vision floue — je vis au jour le jour",
    noteMax: "Vision claire — j anticipe et planifie efficacement"
  },
  {
    id: 'mental_11',
    dimension: 'Créativité Cognitive',
    icon: '💡',
    texte: "Arrives-tu à générer des idées nouvelles, à penser différemment, à faire des connexions inattendues ?",
    suggestions: 'brainstorming, mind mapping, analogies, pensée latérale, innovation, blocage créatif',
    champ1: 'Dernière idée vraiment originale ou créative que tu as eue',
    champ2: 'Contexte où tu es le plus créatif (vs le moins)',
    champ3: 'Ce qui bloque ou libère ta créativité',
    noteMin: "Difficulté à générer des idées nouvelles",
    noteMax: "Créativité fluide — je fais des connexions inattendues"
  },
  {
    id: 'mental_12',
    dimension: 'Métacognition',
    icon: '🪞',
    texte: " observes-tu tes propres patterns de pensée ? Arrives-tu à te 'mettre en spectateur' de ton mental ?",
    suggestions: 'introspection, journaling, thérapie, observation des pensées, analyse des réactions, conscience des biais',
    champ1: 'Dernière fois où tu as observé un pattern de pensée en temps réel',
    champ2: 'Outils ou pratiques qui t aident à observer ta pensée',
    champ3: "Pattern de pensée qui te joue des tours (doute, perfectionnisme, etc.)",
    noteMin: "Je suis 'dans' mes pensées sans jamais les observer",
    noteMax: "Conscience constante de mes processus de pensée"
  }
];

export const MENTAL_DIMENSIONS = {
  'Structuration Cognitive': 'Capacité à décomposer et organiser les problèmes complexes',
  'Planification & Exécution': 'Passer de l intention à l action concrète et réaliser',
  'Gestion du Feedback': 'Réaction constructive aux remises en question et critiques',
  'Prise de Décision': 'Distinguer et combiner intuition, émotions et rationalité',
  'Apprentissage Continu': 'Pratique régulière et curiosité pour l apprentissage',
  'Pensée Critique': 'Remettre en question ses certitudes et identifier ses biais',
  'Mémoire de Travail': 'Gestion de la charge cognitive et maintien du fil',
  'Flexibilité Mentale': 'Adaptation au changement et capacité à pivoter',
  'Focus & Concentration': 'Maintien de la concentration profonde sans distraction',
  'Pensée Stratégique': 'Vision long terme et anticipation des conséquences',
  'Créativité Cognitive': 'Génération d idées nouvelles et connexions inattendues',
  'Métacognition': 'Observation et conscience de ses propres patterns de pensée'
};

// Calcul du score
export function calculateMentalScore(answers) {
  const dimensions = Object.keys(MENTAL_DIMENSIONS);
  let total = 0;
  const scoresByDimension = {};
  
  dimensions.forEach((dim, index) => {
    const questionId = `mental_${String(index + 1).padStart(2, '0')}`;
    const note = answers[questionId]?.note || 0;
    total += note;
    scoresByDimension[dim] = note;
  });
  
  const scoreSur100 = Math.round((total / 60) * 100); // 12 questions x 5 max = 60
  
  let interpretation;
  if (scoreSur100 < 30) {
    interpretation = 'Profil mental à construire — beaucoup d espace pour développer les capacités cognitives';
  } else if (scoreSur100 < 50) {
    interpretation = 'Profil mental intermédiaire — certaines ressources présentes mais des blocages importants subsistent';
  } else if (scoreSur100 < 70) {
    interpretation = 'Profil mental affirmé — bonne maîtrise cognitive avec encore des zones d ombre';
  } else {
    interpretation = 'Profil mental maîtrisé — intelligence cognitive développée et pensée structurée';
  }
  
  return {
    dimensions: scoresByDimension,
    scoreSur100,
    total,
    interpretation,
    maxPossible: 60
  };
}
