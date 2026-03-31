import { describe, it, expect } from 'vitest';
import { generateFallbackDiagnostic } from '../../src/lib/diagnosticFallback';

function makeRegistres(overrides = {}) {
  const defaults = {
    reptilien: {
      score: 12,
      questions: Array(5).fill({ score_final: 2.4 }),
      points_forts: ['Stable'],
      points_faibles: ['Sommeil'],
    },
    instinctif: {
      score: 8,
      questions: Array(5).fill({ score_final: 1.6 }),
      points_forts: ['Intuition'],
      points_faibles: ['Corps'],
    },
    emotionnel: {
      score: 6,
      questions: Array(5).fill({ score_final: 1.2 }),
      points_forts: ['Empathie'],
      points_faibles: ['Expression'],
    },
    rationnel: {
      score: 18,
      questions: Array(5).fill({ score_final: 3.6 }),
      points_forts: ['Analyse'],
      points_faibles: ['Sur-analyse'],
    },
  };
  for (const [k, v] of Object.entries(overrides)) {
    defaults[k] = { ...defaults[k], ...v };
  }
  return defaults;
}

describe('generateFallbackDiagnostic', () => {
  it('returns all required fields', () => {
    const diag = generateFallbackDiagnostic(makeRegistres());
    expect(diag).toHaveProperty('resume_court');
    expect(diag).toHaveProperty('lecture_globale');
    expect(diag).toHaveProperty('dynamiques');
    expect(diag).toHaveProperty('points_solides');
    expect(diag).toHaveProperty('priorites_intro');
    expect(diag).toHaveProperty('priorites');
    expect(diag).toHaveProperty('conseils');
  });

  it('passes validateDiagnostic checks', async () => {
    const { validateDiagnostic } = await import('../../src/lib/api');
    const diag = generateFallbackDiagnostic(makeRegistres());
    expect(validateDiagnostic(diag)).toBe(true);
  });

  it('generates dynamiques with 3 items', () => {
    const diag = generateFallbackDiagnostic(makeRegistres());
    expect(diag.dynamiques).toHaveLength(3);
    diag.dynamiques.forEach(d => {
      expect(d.titre).toBeTruthy();
      expect(d.description).toBeTruthy();
    });
  });

  it('generates priorites for all 4 registres', () => {
    const diag = generateFallbackDiagnostic(makeRegistres());
    expect(diag.priorites.length).toBeGreaterThanOrEqual(3);
  });

  it('generates pratiques_quotidiennes with matin/journee/soir', () => {
    const diag = generateFallbackDiagnostic(makeRegistres());
    const pq = diag.conseils.pratiques_quotidiennes;
    expect(pq.matin.length).toBeGreaterThan(0);
    expect(pq.journee.length).toBeGreaterThan(0);
    expect(pq.soir.length).toBeGreaterThan(0);
  });

  it('includes sommeil advice when reptilien < 15', () => {
    const diag = generateFallbackDiagnostic(makeRegistres({ reptilien: { score: 10 } }));
    const allText = JSON.stringify(diag.conseils);
    expect(allText.toLowerCase()).toMatch(/sommeil|dormir|coucher/);
  });

  it('handles edge case with all scores at 0', () => {
    const registres = {
      reptilien: { score: 0, questions: [], points_forts: [], points_faibles: [] },
      instinctif: { score: 0, questions: [], points_forts: [], points_faibles: [] },
      emotionnel: { score: 0, questions: [], points_forts: [], points_faibles: [] },
      rationnel: { score: 0, questions: [], points_forts: [], points_faibles: [] },
    };
    const diag = generateFallbackDiagnostic(registres);
    expect(diag.resume_court).toBeTruthy();
    expect(diag.dynamiques).toHaveLength(3);
  });

  it('handles edge case with all scores at max (25)', () => {
    const registres = {
      reptilien: { score: 25, questions: [], points_forts: [], points_faibles: [] },
      instinctif: { score: 25, questions: [], points_forts: [], points_faibles: [] },
      emotionnel: { score: 25, questions: [], points_forts: [], points_faibles: [] },
      rationnel: { score: 25, questions: [], points_forts: [], points_faibles: [] },
    };
    const diag = generateFallbackDiagnostic(registres);
    expect(diag.resume_court).toBeTruthy();
  });
});
