// 12 questions pour l'audit Émotionnel & Relationnel
// Basé sur le modèle des réponses réelles de Sebastian Wahl

export const EMOTIONNEL_QUESTIONS = [
  {
    id: 'emo_01',
    dimension: 'Vocabulaire Émotionnel',
    dimension_label: 'Vocabulaire Émotionnel',
    ordre: 1,
    icon: '💭',
    question: "Dans un moment intense (colère, tristesse, excitation, peur), arrives-tu à nommer précisément ce que tu ressens avec des mots ?",
    hints: ['joie exubérante', 'tristesse mélancolique', 'peur paralysante', 'colère bouillonnante', 'anxiété diffuse'],
    champ_contexte_label: 'Dernier moment intense où tu as essayé de nommer ton émotion',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Les mots qui sont venus (ou le manque de mots)',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Ce que tu aurais aimé pouvoir exprimer',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Totalement flou — je ne sais pas ce que je ressens",
    likert_5: "Précis — j'ai un vocabulaire riche et nuancé"
  },
  {
    id: 'emo_02',
    dimension: 'Régulation Émotionnelle',
    dimension_label: 'Régulation Émotionnelle',
    ordre: 2,
    icon: '🌊',
    question: "Quand une émotion forte surgit (colère, tristesse, excitation), que fais-tu pour la gérer ?",
    hints: ['respiration', 'marche', 'écriture', 'musique', 'sport', 'méditation', 'attente', 'expression'],
    champ_contexte_label: 'Dernière émotion forte et comment tu l as gérée',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce qui t aide vraiment vs ce que tu fais par habitude',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Ce qui te bloque ou amplifie l émotion',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Je me laisse submerger — je ne sais pas quoi faire",
    likert_5: "J'ai une boîte à outils complète et je choisis activement"
  },
  {
    id: 'emo_03',
    dimension: 'Sécurité Relationnelle',
    dimension_label: 'Sécurité Relationnelle',
    ordre: 3,
    icon: '🤝',
    question: "As-tu des relations proches dans lesquelles tu te sens pleinement en sécurité émotionnelle (sans filtre, sans peur du jugement) ?",
    hints: ['ami de cœur', 'partenaire', 'thérapeute', 'membre famille', 'groupe', 'personne de confiance'],
    champ_contexte_label: 'Les personnes avec qui tu te sens vraiment toi-même',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce qui crée cette sécurité (ou l absence)',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Relations qui se sont érodées récemment et pourquoi',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Personne — je porte un masque partout",
    likert_5: "Plusieurs personnes — je peux être vulnérable sans peur"
  },
  {
    id: 'emo_04',
    dimension: 'Empathie Réciproque',
    dimension_label: 'Empathie Réciproque',
    ordre: 4,
    icon: '💞',
    question: "Arrives-tu à te mettre à la place des autres ET à sentir qu'ils comprennent ce que tu vis ?",
    hints: ['comprérence mutuelle', 'miroir émotionnel', 'validation', 'écoute active', 'présence silencieuse'],
    champ_contexte_label: 'Dernière fois où tu as senti une vraie comprérence réciproque',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce qui te permet de percevoir les émotions des autres',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Ce qui t empêche de sentir compris',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Je comprends les autres mais personne ne me comprend",
    likert_5: "Échanges fluides de comprérence émotionnelle"
  },
  {
    id: 'emo_05',
    dimension: 'Expression Émotionnelle',
    dimension_label: 'Expression Émotionnelle',
    ordre: 5,
    icon: '🗣️',
    question: "Arrives-tu à exprimer verbalement ce que tu ressens aux personnes proches — même quand c'est difficile ?",
    hints: ['dire je t aime', 'exprimer de la colère', 'demander de l aide', 'montrer de la tristesse', 'partager la peur'],
    champ_contexte_label: 'Dernière fois où tu as exprimé une émotion difficile',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Comment ça s est passé (accueil ou rejet)',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Ce que tu retiens habituellement et pourquoi',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Je retiens tout — expression impossible",
    likert_5: "Expression fluide — je dis ce que je ressens"
  },
  {
    id: 'emo_06',
    dimension: 'Gestion des Conflits',
    dimension_label: 'Gestion des Conflits',
    ordre: 6,
    icon: '⚡',
    question: "Comment gères-tu les tensions ou conflits émotionnels dans tes relations ?",
    hints: ['fuite', 'confrontation', 'médiation', 'silence', 'expression', 'attente', 'escalade', 'résolution'],
    champ_contexte_label: 'Dernier conflit émotionnel et comment tu l as géré',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ton pattern habituel (fuite, attaque, gel, etc.)',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Ce que tu aimerais faire différemment',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Je fuis ou j'explose — pas de milieu",
    likert_5: "Gestion nuancée et constructive des conflits"
  },
  {
    id: 'emo_07',
    dimension: 'Intimité Émotionnelle',
    dimension_label: 'Intimité Émotionnelle',
    ordre: 7,
    icon: '🔐',
    question: "Te permets-tu d'être vulnérable — de montrer tes failles, tes doutes, tes peurs — avec au moins une personne ?",
    hints: ['vulnérabilité partagée', 'secrets de cœur', 'peurs révélées', 'doutes exprimés', 'faiblesse montrée'],
    champ_contexte_label: 'Personne avec qui tu es le plus vulnérable',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce que tu as partagé récemment de vraiment personnel',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Ce que tu ne montres à personne et pourquoi',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Jamais vulnérable — armure totale",
    likert_5: "Vulnérabilité partagée régulièrement"
  },
  {
    id: 'emo_08',
    dimension: 'Réparation Relationnelle',
    dimension_label: 'Réparation Relationnelle',
    ordre: 8,
    icon: '🤲',
    question: "Quand tu blesses quelqu'un ou qu'on te blesse émotionnellement, arrives-tu à réparer ?",
    hints: ['excuses', 'pardon', 'discussion', 'temps', 'geste', 'reconnaissance', 'changement de comportement'],
    champ_contexte_label: 'Dernière fois où tu as dû réparer une blessure émotionnelle',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce qui a aidé (ou pas) à réparer',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Blessures non réparées qui persistent',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Je ne sais pas réparer — les blessures s accumulent",
    likert_5: "Réparation active et efficace des ruptures"
  },
  {
    id: 'emo_09',
    dimension: 'Boundaries Émotionnelles',
    dimension_label: 'Boundaries Émotionnelles',
    ordre: 9,
    icon: '🛡️',
    question: "Arrives-tu à dire non ou à poser des limites quand les émotions des autres t'envahissent ?",
    hints: ['dire non', 'poser des limites', 'se protéger', 'ne pas absorber', 'garder sa place', 'équilibre donner-recevoir'],
    champ_contexte_label: 'Dernière fois où tu as dû poser une limite émotionnelle',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce qui t empêche de poser des limites (peur, culpabilité, etc.)',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Conséquences quand tu ne poses pas de limites',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "J'absorbe tout — aucune limite",
    likert_5: "Limites claires et respectées"
  },
  {
    id: 'emo_10',
    dimension: 'Soutien Émotionnel',
    dimension_label: 'Soutien Émotionnel',
    ordre: 10,
    icon: '🤗',
    question: "Sais-tu demander de l'aide ou du soutien émotionnel quand tu en as besoin — sans culpabilité ?",
    hints: ['demander de l aide', 'exprimer un besoin', 'recevoir du soutien', 'accepter l aide', 'lâcher prise'],
    champ_contexte_label: 'Dernière fois où tu as demandé du soutien émotionnel',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Ce qui t empêche de demander (orgueil, peur, etc.)',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Type de soutien dont tu aurais besoin en ce moment',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Je ne demande jamais — je gère seul",
    likert_5: "Demande aisée et soutien bien reçu"
  },
  {
    id: 'emo_11',
    dimension: 'Authenticité Relationnelle',
    dimension_label: 'Authenticité Relationnelle',
    ordre: 11,
    icon: '🎭',
    question: "Dans tes relations proches, es-tu authentique — le même en privé et avec ces personnes ? Ou portes-tu des masques ?",
    hints: ['authenticité', 'masque social', 'vrai soi', 'personnage', 'spontanéité', 'gêne', 'peur du jugement'],
    champ_contexte_label: 'Personne avec qui tu es 100% authentique',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Masques que tu portes habituellement et pourquoi',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Coût de ces masques sur ton bien-être',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Masque constant — jamais authentique",
    likert_5: "Authenticité totale dans les relations proches"
  },
  {
    id: 'emo_12',
    dimension: 'Cohérence Émotionnelle',
    dimension_label: 'Cohérence Émotionnelle',
    ordre: 12,
    icon: '🔗',
    question: "Tes émotions, pensées et actions sont-elles alignées — ou vivre-tu des contradictions internes ?",
    hints: ['alignement', 'dissonance cognitive', 'émotions refoulées', 'actions contradictoires', 'authenticité'],
    champ_contexte_label: 'Domaine de ta vie où il y a le plus de dissonance',
    champ_contexte_placeholder: 'Décris le contexte...',
    champ_exemple_label: 'Contradictions entre ce que tu ressens, penses et fais',
    champ_exemple_placeholder: 'Donne un exemple concret...',
    champ_reaction_label: 'Coût de ces contradictions sur ton bien-être',
    champ_reaction_placeholder: 'Comment as-tu réagi ?',
    likert_1: "Totalement désaligné — vivre en contradiction",
    likert_5: "Alignement parfait — cohérence totale"
  }
];

export const EMOTIONNEL_DIMENSIONS = {
  'Vocabulaire Émotionnel': 'Capacité à nommer et identifier ses émotions avec précision',
  'Régulation Émotionnelle': 'Gestion active et constructive des émotions fortes',
  'Sécurité Relationnelle': 'Présence de relations où on peut être soi-même sans filtre',
  'Empathie Réciproque': 'Comprérence mutuelle des émotions dans les relations',
  'Expression Émotionnelle': 'Capacité à verbaliser ce qu on ressent',
  'Gestion des Conflits': 'Navigation constructive des tensions émotionnelles',
  'Intimité Émotionnelle': 'Capacité à être vulnérable et authentique',
  'Réparation Relationnelle': 'Compétence à réparer les blessures émotionnelles',
  'Boundaries Émotionnelles': 'Poser des limites pour protéger son espace émotionnel',
  'Soutien Émotionnel': 'Demander et recevoir de l aide émotionnelle',
  'Authenticité Relationnelle': 'Être son vrai soi dans les relations',
  'Cohérence Émotionnelle': 'Alignement entre émotions, pensées et actions'
};

// Calcul du score
export function calculateEmotionnelScore(answers) {
  const dimensions = Object.keys(EMOTIONNEL_DIMENSIONS);
  let total = 0;
  const scoresByDimension = {};
  
  dimensions.forEach((dim, index) => {
    const questionId = `emo_${String(index + 1).padStart(2, '0')}`;
    const note = answers[questionId]?.note || 0;
    total += note;
    scoresByDimension[dim] = note;
  });
  
  const scoreSur100 = Math.round((total / 60) * 100); // 12 questions x 5 max = 60
  
  let interpretation;
  if (scoreSur100 < 30) {
    interpretation = 'Profil émotionnel à construire — beaucoup d espace pour développer la conscience et l expression émotionnelle';
  } else if (scoreSur100 < 50) {
    interpretation = 'Profil émotionnel intermédiaire — certaines ressources présentes mais des blocages importants subsistent';
  } else if (scoreSur100 < 70) {
    interpretation = 'Profil émotionnel affirmé — bonne conscience et expression avec encore des zones d ombre';
  } else {
    interpretation = 'Profil émotionnel maîtrisé — intelligence émotionnelle développée et relations authentiques';
  }
  
  return {
    dimensions: scoresByDimension,
    scoreSur100,
    total,
    interpretation,
    maxPossible: 60
  };
}
