/**
 * Calcule la somme des score_final de chaque question dans un registre.
 * Chaque question vaut 5 pts max → registre sur 25 pts max.
 * @param {Array} questions - tableau de questions avec un champ score_final
 * @returns {number} somme arrondie à 1 décimale
 */
export function calculateRegisterScore(questions) {
  if (!questions || questions.length === 0) return 0;
  const scored = questions.filter(q => q.score_final !== null && q.score_final !== undefined);
  if (scored.length === 0) return 0;
  const sum = scored.reduce((acc, q) => acc + q.score_final, 0);
  return Math.round(sum * 10) / 10;
}

/**
 * Retourne le niveau textuel correspondant à un score sur 25.
 * @param {number} score - score sur 25
 * @returns {string}
 */
export function getScoreLevel(score) {
  if (score >= 20) return 'Dominant';
  if (score >= 12.5) return 'Développé';
  if (score >= 7.5) return 'Sous-développé';
  return 'Verrouillé';
}

/**
 * Ajuste un score par un delta, clampé entre 0.0 et 10.0.
 * @param {number} currentScore
 * @param {number} delta
 * @returns {number} arrondi à 1 décimale
 */
export function adjustScore(currentScore, delta) {
  const result = currentScore + delta;
  const clamped = Math.min(10.0, Math.max(0.0, result));
  return Math.round(clamped * 10) / 10;
}
