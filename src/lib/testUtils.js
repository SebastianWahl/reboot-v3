/**
 * Calcule le score global de l'Audit Instinctif à partir des réponses
 * @param {Object} answers - Objet contenant les réponses { questionId: { note, contexte, exemple, reaction } }
 * @returns {Object} Scores par dimension et score global
 */
export function calculateInstinctifScore(answers) {
  const dimensions = [
    'noticing', 'not_distracting', 'attention_regulation', 'emotional_awareness',
    'trusting', 'self_regulation', 'body_listening', 'intuition',
    'interoceptive_clarity', 'self_compassion', 'embodied_presence', 'somatic_integration'
  ];
  
  const scores = {};
  let totalScore = 0;
  let answeredCount = 0;
  
  dimensions.forEach((dim, index) => {
    const questionId = `inst_${String(index + 1).padStart(2, '0')}`;
    const answer = answers[questionId];
    
    if (answer && answer.note) {
      scores[dim] = answer.note;
      totalScore += answer.note;
      answeredCount++;
    } else {
      scores[dim] = 0;
    }
  });
  
  // Score brut sur 60 (12 questions × 5 points)
  const rawScore = totalScore;
  
  // Conversion sur 100
  const scoreSur100 = answeredCount > 0 
    ? Math.round((rawScore / (answeredCount * 5)) * 100)
    : 0;
  
  return {
    dimensions: scores,
    rawScore,
    scoreSur100,
    answeredCount,
    interpretation: getInterpretation(scoreSur100)
  };
}

/**
 * Retourne l'interprétation textuelle du score
 */
function getInterpretation(score) {
  if (score < 25) return "Instinctif très sous-développé";
  if (score < 41) return "Instinctif à développer";
  if (score < 61) return "Instinctif moyen";
  if (score < 81) return "Instinctif développé";
  return "Instinctif très développé";
}

/**
 * Vérifie si toutes les questions ont une note
 * @param {Object} answers - Réponses de l'utilisateur
 * @param {Number} totalQuestions - Nombre total de questions
 * @returns {Boolean}
 */
export function hasAllNotes(answers, totalQuestions = 12) {
  for (let i = 1; i <= totalQuestions; i++) {
    const questionId = `inst_${String(i).padStart(2, '0')}`;
    if (!answers[questionId]?.note) {
      return false;
    }
  }
  return true;
}

/**
 * Compte le nombre de champs texte manquants ou insuffisants
 * @param {Object} answers - Réponses de l'utilisateur
 * @param {Object} thresholds - Seuils minimaux de caractères
 * @returns {Number} Nombre de champs manquants
 */
export function countMissingTexts(answers, thresholds = {
  contexte: 20,
  exemple: 30,
  reaction: 10
}) {
  let missing = 0;
  
  Object.values(answers).forEach(answer => {
    if (!answer.contexte || answer.contexte.length < thresholds.contexte) missing++;
    if (!answer.exemple || answer.exemple.length < thresholds.exemple) missing++;
    if (!answer.reaction || answer.reaction.length < thresholds.reaction) missing++;
  });
  
  return missing;
}

/**
 * Formate les réponses pour l'envoi à l'API Claude
 * @param {Object} answers - Réponses brutes
 * @returns {Object} Données formatées
 */
export function formatAnswersForAPI(answers) {
  const dimensions = [
    'noticing', 'not_distracting', 'attention_regulation', 'emotional_awareness',
    'trusting', 'self_regulation', 'body_listening', 'intuition',
    'interoceptive_clarity', 'self_compassion', 'embodied_presence', 'somatic_integration'
  ];
  
  const formattedDimensions = dimensions.map((dim, index) => {
    const questionId = `inst_${String(index + 1).padStart(2, '0')}`;
    const answer = answers[questionId];
    
    return {
      dimension: dim,
      score: answer?.note || 0,
      reponses: {
        contexte: answer?.contexte || '',
        exemple: answer?.exemple || '',
        reaction: answer?.reaction || ''
      }
    };
  });
  
  return {
    scores: formattedDimensions,
    totalScore: calculateInstinctifScore(answers)
  };
}

/**
 * Détermine les 3 axes prioritaires (dimensions avec les scores les plus faibles)
 * @param {Object} scores - Scores par dimension
 * @returns {Array} Les 3 dimensions à prioriser
 */
export function getPriorityAxes(scores) {
  return Object.entries(scores)
    .sort(([,a], [,b]) => a - b)
    .slice(0, 3)
    .map(([dimension, score]) => ({ dimension, score }));
}

/**
 * Génère un hash unique des réponses pour le caching
 * @param {Object} answers - Réponses de l'utilisateur
 * @returns {String} Hash MD5-like simplifié
 */
export function generateAnswersHash(answers) {
  const str = JSON.stringify(answers);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Calcule le temps estimé de complétion
 * @param {Number} currentQuestion - Index de la question actuelle (0-based)
 * @param {Number} totalQuestions - Nombre total de questions
 * @returns {String} Temps formaté
 */
export function estimateRemainingTime(currentQuestion, totalQuestions = 12) {
  const remaining = totalQuestions - currentQuestion;
  const minutes = Math.ceil(remaining * 2); // ~2 min par question
  return minutes <= 1 ? '1 minute' : `${minutes} minutes`;
}

/**
 * Valide une réponse individuelle
 * @param {Object} answer - Réponse à valider
 * @returns {Object} Résultat de la validation
 */
export function validateAnswer(answer) {
  const errors = [];
  
  if (!answer.note) {
    errors.push("Une note de 1 à 5 est requise");
  }
  
  if (answer.note && (answer.note < 1 || answer.note > 5)) {
    errors.push("La note doit être entre 1 et 5");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
