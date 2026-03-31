import { describe, it, expect } from 'vitest';
import { validateDiagnostic } from '../../src/lib/api';

describe('validateDiagnostic', () => {
  const validDiagnostic = {
    resume_court: 'Profil à forte dominante cognitive et analytique. Tension entre la tête et le cœur.',
    lecture_globale: 'A'.repeat(300),
    dynamiques: [
      { titre: 'Le refuge rationnel', description: 'La pensée analytique sert de mécanisme de contrôle.' },
      { titre: 'La dissociation interne', description: 'Corps et émotions sont présents mais peu écoutés.' },
      { titre: 'Les émotions sous scellés', description: 'Les émotions sont là mais difficiles à nommer.' },
    ],
    points_solides: ['Analyse structurée', 'Ouverture intellectuelle'],
    priorites_intro: 'Le registre émotionnel est le chantier prioritaire.',
    priorites: [
      { registre: 'Émotionnel', score: 6.5, but: 'Ouvrir le canal', actions: ['Action 1'] },
    ],
    conseils: {
      pratiques_quotidiennes: {
        matin: ['Respiration 5 min'],
        journee: ['Marche 20 min'],
        soir: ['Journal émotionnel'],
      },
      conseils_generaux: ['Conseil 1'],
      concepts_a_etudier: [{ concept: 'Test', pourquoi: 'Parce que' }],
      ressources: [{ titre: 'Livre', auteur: 'Auteur', type: 'livre', pourquoi: 'Pertinent' }],
    },
  };

  it('returns true for a valid diagnostic', () => {
    expect(validateDiagnostic(validDiagnostic)).toBe(true);
  });

  it('returns false for null/undefined', () => {
    expect(validateDiagnostic(null)).toBe(false);
    expect(validateDiagnostic(undefined)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(validateDiagnostic('string')).toBe(false);
    expect(validateDiagnostic(42)).toBe(false);
  });

  it('returns false if resume_court is missing', () => {
    const { resume_court, ...rest } = validDiagnostic;
    expect(validateDiagnostic(rest)).toBe(false);
  });

  it('returns false if resume_court is too short', () => {
    expect(validateDiagnostic({ ...validDiagnostic, resume_court: 'Court' })).toBe(false);
  });

  it('returns false if lecture_globale is missing', () => {
    const { lecture_globale, ...rest } = validDiagnostic;
    expect(validateDiagnostic(rest)).toBe(false);
  });

  it('returns false if lecture_globale is too short (< 200 chars)', () => {
    expect(validateDiagnostic({ ...validDiagnostic, lecture_globale: 'Court' })).toBe(false);
  });

  it('returns false if dynamiques is empty', () => {
    expect(validateDiagnostic({ ...validDiagnostic, dynamiques: [] })).toBe(false);
  });

  it('returns false if dynamiques is missing', () => {
    const { dynamiques, ...rest } = validDiagnostic;
    expect(validateDiagnostic(rest)).toBe(false);
  });

  it('returns false if priorites is empty', () => {
    expect(validateDiagnostic({ ...validDiagnostic, priorites: [] })).toBe(false);
  });

  it('returns false if conseils.pratiques_quotidiennes is missing', () => {
    const diag = { ...validDiagnostic, conseils: { ...validDiagnostic.conseils, pratiques_quotidiennes: null } };
    expect(validateDiagnostic(diag)).toBe(false);
  });

  it('accepts minimal but valid structure', () => {
    const minimal = {
      resume_court: 'Un profil intéressant avec des forces analytiques marquées.',
      lecture_globale: 'A'.repeat(200),
      dynamiques: [{ titre: 'Test', description: 'Description' }],
      points_solides: ['Force'],
      priorites: [{ registre: 'Test', score: 10, but: 'Objectif', actions: ['Action'] }],
      conseils: { pratiques_quotidiennes: { matin: ['Test'] } },
    };
    expect(validateDiagnostic(minimal)).toBe(true);
  });
});
