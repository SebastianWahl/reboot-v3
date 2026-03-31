import { describe, it, expect } from 'vitest';
import { calculateRegisterScore, getScoreLevel, adjustScore } from '../../src/lib/scoring';

describe('calculateRegisterScore', () => {
  it('returns 0 for null/undefined input', () => {
    expect(calculateRegisterScore(null)).toBe(0);
    expect(calculateRegisterScore(undefined)).toBe(0);
    expect(calculateRegisterScore([])).toBe(0);
  });

  it('returns 0 when no questions have scores', () => {
    const questions = [
      { score_final: null },
      { score_final: undefined },
    ];
    expect(calculateRegisterScore(questions)).toBe(0);
  });

  it('sums score_final of scored questions', () => {
    const questions = [
      { score_final: 3.0 },
      { score_final: 2.5 },
      { score_final: 4.0 },
      { score_final: 1.5 },
      { score_final: 2.0 },
    ];
    expect(calculateRegisterScore(questions)).toBe(13.0);
  });

  it('rounds to 1 decimal place', () => {
    const questions = [
      { score_final: 1.111 },
      { score_final: 2.222 },
      { score_final: 3.333 },
    ];
    expect(calculateRegisterScore(questions)).toBe(6.7);
  });

  it('ignores questions without score_final', () => {
    const questions = [
      { score_final: 3.0 },
      { score_final: null },
      { score_final: 2.0 },
    ];
    expect(calculateRegisterScore(questions)).toBe(5.0);
  });

  it('handles max score (5 questions × 5 points)', () => {
    const questions = Array(5).fill({ score_final: 5.0 });
    expect(calculateRegisterScore(questions)).toBe(25.0);
  });
});

describe('getScoreLevel', () => {
  it('returns Dominant for score >= 20', () => {
    expect(getScoreLevel(20)).toBe('Dominant');
    expect(getScoreLevel(25)).toBe('Dominant');
  });

  it('returns Développé for score >= 12.5 and < 20', () => {
    expect(getScoreLevel(12.5)).toBe('Développé');
    expect(getScoreLevel(19.9)).toBe('Développé');
  });

  it('returns Sous-développé for score >= 7.5 and < 12.5', () => {
    expect(getScoreLevel(7.5)).toBe('Sous-développé');
    expect(getScoreLevel(12.4)).toBe('Sous-développé');
  });

  it('returns Verrouillé for score < 7.5', () => {
    expect(getScoreLevel(0)).toBe('Verrouillé');
    expect(getScoreLevel(7.4)).toBe('Verrouillé');
  });
});

describe('adjustScore', () => {
  it('adds delta to current score', () => {
    expect(adjustScore(3.0, 1.0)).toBe(4.0);
  });

  it('subtracts delta from current score', () => {
    expect(adjustScore(3.0, -1.0)).toBe(2.0);
  });

  it('clamps at 0', () => {
    expect(adjustScore(0.5, -1.0)).toBe(0.0);
  });

  it('clamps at 10', () => {
    expect(adjustScore(9.5, 1.0)).toBe(10.0);
  });

  it('rounds to 1 decimal place', () => {
    expect(adjustScore(3.333, 0.111)).toBe(3.4);
  });
});
